import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MPESA_ENV = Deno.env.get("MPESA_ENV") || "sandbox";
const MPESA_BASE_URL = MPESA_ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

const PAYMENT_TIMEOUT = 90000; // 90 seconds for async payments

interface STKPushResult {
  success: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  responseCode?: string;
  responseDescription?: string;
  customerMessage?: string;
  error?: string;
}

interface B2CResult {
  success: boolean;
  conversationId?: string;
  originatorConversationId?: string;
  responseCode?: string;
  responseDescription?: string;
  error?: string;
}

// Get M-Pesa OAuth token with retry
async function getAccessToken(attempt = 1): Promise<string> {
  const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa consumer key and secret must be configured");
  }

  try {
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: { Authorization: `Basic ${auth}` },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("M-Pesa OAuth returned non-JSON response");
      throw new Error("M-Pesa API returned an invalid response");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(`M-Pesa auth error (attempt ${attempt}/3):`, error);
    if (attempt >= 3) {
      throw new Error(`Failed to get M-Pesa access token after 3 attempts`);
    }
    await new Promise((r) => setTimeout(r, 2000 * Math.pow(2, attempt - 1)));
    return getAccessToken(attempt + 1);
  }
}

// STK Push - Request payment from buyer
async function stkPush(
  phoneNumber: string,
  amount: number,
  orderRef: string,
  callbackUrl: string
): Promise<STKPushResult> {
  try {
    const shortcode = Deno.env.get("MPESA_SHORTCODE");
    const passkey = Deno.env.get("MPESA_PASSKEY");

    if (!shortcode || !passkey) {
      throw new Error("M-Pesa shortcode and passkey must be configured");
    }

    const token = await getAccessToken();
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);
    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    const formattedPhone = phoneNumber.replace(/\+/g, "").replace(/^0/, "254");

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: orderRef,
      TransactionDesc: `Payment for ${orderRef}`,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PAYMENT_TIMEOUT);

    const response = await fetch(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("M-Pesa STK Push returned non-JSON response");
      throw new Error("M-Pesa API returned an invalid response");
    }

    const data = await response.json();

    if (data.ResponseCode === "0") {
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        customerMessage: data.CustomerMessage,
      };
    } else {
      return {
        success: false,
        error: data.ResponseDescription || data.errorMessage || "STK Push failed",
      };
    }
  } catch (error) {
    console.error("M-Pesa STK Push error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "STK Push failed",
    };
  }
}

// B2C - Pay seller
async function payoutToSeller(
  phoneNumber: string,
  amount: number,
  orderRef: string
): Promise<B2CResult> {
  try {
    const shortcode = Deno.env.get("MPESA_SHORTCODE");
    const initiatorName = Deno.env.get("MPESA_INITIATOR_NAME");
    const securityCredential = Deno.env.get("MPESA_SECURITY_CREDENTIAL");
    const apiUrl = Deno.env.get("SUPABASE_URL");

    if (!shortcode || !initiatorName || !securityCredential) {
      throw new Error("M-Pesa B2C credentials must be configured");
    }

    const token = await getAccessToken();
    const formattedPhone = phoneNumber.replace(/\+/g, "").replace(/^0/, "254");

    const payload = {
      InitiatorName: initiatorName,
      SecurityCredential: securityCredential,
      CommandID: "BusinessPayment",
      Amount: Math.round(amount),
      PartyA: shortcode,
      PartyB: formattedPhone,
      Remarks: `Payout for order ${orderRef}`,
      QueueTimeOutURL: `${apiUrl}/functions/v1/mpesa-api/webhook/timeout`,
      ResultURL: `${apiUrl}/functions/v1/mpesa-api/webhook/b2c-result`,
      Occasion: "PayLoom Seller Payout",
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PAYMENT_TIMEOUT);

    const response = await fetch(
      `${MPESA_BASE_URL}/mpesa/b2c/v1/paymentrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("M-Pesa B2C returned non-JSON response");
      throw new Error("M-Pesa API returned an invalid response");
    }

    const data = await response.json();

    if (data.ResponseCode === "0") {
      return {
        success: true,
        conversationId: data.ConversationID,
        originatorConversationId: data.OriginatorConversationID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
      };
    } else {
      return {
        success: false,
        error: data.ResponseDescription || data.errorMessage || "B2C payout failed",
      };
    }
  } catch (error) {
    console.error("M-Pesa B2C error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "B2C payout failed",
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const action = pathParts[pathParts.length - 1];

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Handle STK Push
    if (action === "stk-push" && req.method === "POST") {
      const { phoneNumber, amount, orderId, orderRef } = await req.json();

      if (!phoneNumber || !amount || !orderId) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const callbackUrl = `${supabaseUrl}/functions/v1/mpesa-api/webhook/stk-callback`;
      const result = await stkPush(phoneNumber, amount, orderRef || orderId, callbackUrl);

      if (result.success) {
        // Save M-Pesa transaction record
        await supabase.from("mpesa_transactions").insert({
          order_id: orderId,
          transaction_type: "stk_push",
          merchant_request_id: result.merchantRequestId,
          checkout_request_id: result.checkoutRequestId,
          phone_number: phoneNumber,
          amount,
          status: "pending",
          raw_request: { phoneNumber, amount, orderId, orderRef },
        });
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle B2C Payout
    if (action === "payout" && req.method === "POST") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { phoneNumber, amount, orderId, orderRef } = await req.json();

      if (!phoneNumber || !amount || !orderId) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result = await payoutToSeller(phoneNumber, amount, orderRef || orderId);

      if (result.success) {
        // Save M-Pesa transaction record
        await supabase.from("mpesa_transactions").insert({
          order_id: orderId,
          transaction_type: "b2c_payout",
          conversation_id: result.conversationId,
          phone_number: phoneNumber,
          amount,
          status: "pending",
          raw_request: { phoneNumber, amount, orderId, orderRef },
        });
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle STK Callback
    if (url.pathname.includes("/webhook/stk-callback") && req.method === "POST") {
      console.log("📥 M-Pesa STK Callback received");
      const body = await req.json();
      const { Body } = body;
      const { stkCallback } = Body;

      const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

      // Find transaction
      const { data: transaction } = await supabase
        .from("mpesa_transactions")
        .select("*")
        .eq("checkout_request_id", CheckoutRequestID)
        .single();

      if (!transaction) {
        console.error("Transaction not found:", CheckoutRequestID);
        return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const status = ResultCode === 0 ? "completed" : "failed";
      let mpesaReceiptNumber = null;

      if (ResultCode === 0) {
        const { CallbackMetadata } = stkCallback;
        const items = CallbackMetadata?.Item || [];
        mpesaReceiptNumber = items.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;
      }

      // Update M-Pesa transaction
      await supabase
        .from("mpesa_transactions")
        .update({
          status,
          result_code: String(ResultCode),
          result_desc: ResultDesc,
          mpesa_receipt_number: mpesaReceiptNumber,
          callback_data: stkCallback,
          completed_at: new Date().toISOString(),
        })
        .eq("id", transaction.id);

      // Update order if payment successful
      if (ResultCode === 0 && transaction.order_id) {
        await supabase
          .from("transactions")
          .update({
            status: "paid",
            payment_method: "mpesa",
            payment_reference: mpesaReceiptNumber,
            paid_at: new Date().toISOString(),
          })
          .eq("id", transaction.order_id);

        // Call escrow lock
        const escrowResponse = await fetch(
          `${supabaseUrl}/functions/v1/escrow-api/lock`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: transaction.order_id, amount: transaction.amount }),
          }
        );
        console.log("Escrow lock result:", await escrowResponse.json());
      }

      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Success" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle B2C Result Callback
    if (url.pathname.includes("/webhook/b2c-result") && req.method === "POST") {
      console.log("📥 M-Pesa B2C Result received");
      const body = await req.json();
      const { Result } = body;

      const { ConversationID, ResultCode, ResultDesc, ResultParameters } = Result;

      // Find transaction by conversation ID
      const { data: transaction } = await supabase
        .from("mpesa_transactions")
        .select("*")
        .eq("conversation_id", ConversationID)
        .single();

      if (transaction) {
        let transactionReceipt = null;
        if (ResultCode === 0 && ResultParameters?.ResultParameter) {
          transactionReceipt = ResultParameters.ResultParameter.find(
            (p: any) => p.Key === "TransactionReceipt"
          )?.Value;
        }

        await supabase
          .from("mpesa_transactions")
          .update({
            status: ResultCode === 0 ? "completed" : "failed",
            result_code: String(ResultCode),
            result_desc: ResultDesc,
            mpesa_receipt_number: transactionReceipt,
            callback_data: Result,
            completed_at: new Date().toISOString(),
          })
          .eq("id", transaction.id);

        // Record in ledger
        if (ResultCode === 0 && transaction.order_id) {
          await supabase.from("ledger_entries").insert({
            entry_ref: `PAY-${Date.now()}`,
            order_id: transaction.order_id,
            transaction_type: "payout",
            debit_account: "payout_pending",
            credit_account: "seller",
            amount: transaction.amount,
            description: `Payout to seller, Receipt: ${transactionReceipt}`,
            metadata: { mpesa_receipt: transactionReceipt, conversation_id: ConversationID },
          });
        }
      }

      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Success" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle timeout callback
    if (url.pathname.includes("/webhook/timeout") && req.method === "POST") {
      console.log("📥 M-Pesa Timeout received");
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: false, error: "Unknown endpoint" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("M-Pesa API error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
