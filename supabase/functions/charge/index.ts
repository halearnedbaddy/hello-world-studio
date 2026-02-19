import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { supabaseAdmin, validateApiKey } from "../_shared/supabase.ts";

// Fee calculation: 2.5% + KSh 20 (2000 cents)
const FEE_PERCENTAGE = 0.025;
const FEE_FIXED = 2000; // 20 KSh in cents

function calculateFee(amount: number): number {
  return Math.round(amount * FEE_PERCENTAGE) + FEE_FIXED;
}

// Detect payment provider from phone number prefix
function detectProvider(phone: string): "MPESA" | "AIRTEL" | null {
  const cleanPhone = phone.replace(/\D/g, "");
  
  // Safaricom (M-Pesa) prefixes
  const mpesaPrefixes = ["2547", "2541", "01", "07"];
  // Airtel prefixes
  const airtelPrefixes = ["2548", "2550", "08", "050"];
  
  for (const prefix of mpesaPrefixes) {
    if (cleanPhone.startsWith(prefix)) return "MPESA";
  }
  
  for (const prefix of airtelPrefixes) {
    if (cleanPhone.startsWith(prefix)) return "AIRTEL";
  }
  
  // Default to M-Pesa for Kenyan numbers
  if (cleanPhone.startsWith("254") || cleanPhone.startsWith("0")) {
    return "MPESA";
  }
  
  return null;
}

// Format phone number to international format
function formatPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  
  // Convert local format to international
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.slice(1);
  }
  
  // Ensure it starts with country code
  if (!cleaned.startsWith("254")) {
    cleaned = "254" + cleaned;
  }
  
  return cleaned;
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    // Get API key from header
    const apiKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "");
    
    const { account, error: authError, mode } = await validateApiKey(apiKey || "");
    if (authError || !account) {
      return errorResponse(authError || "Invalid API key", 401);
    }

    // Parse request body
    const body = await req.json();
    const { amount, phone, currency = "KES", description, external_ref } = body;

    // Validate required fields
    if (!amount || typeof amount !== "number" || amount < 100) {
      return errorResponse("Amount must be at least 100 cents (KSh 1)", 400);
    }

    if (!phone) {
      return errorResponse("Phone number is required", 400);
    }

    // Format and validate phone
    const formattedPhone = formatPhone(phone);
    if (formattedPhone.length < 12) {
      return errorResponse("Invalid phone number format", 400);
    }

    // Detect payment provider
    const paymentMethod = detectProvider(formattedPhone);
    if (!paymentMethod) {
      return errorResponse("Unsupported phone number. Use Safaricom or Airtel numbers.", 400);
    }

    // Calculate fee
    const feeAmount = calculateFee(amount);

    // Generate transaction ID
    const transactionId = `txn_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;

    // Create transaction record
const { data: transaction, error: txError } = await supabaseAdmin
      .from("transactions")
      .insert({
        id: transactionId,
        account_id: account.id,
        amount,
        currency,
        phone: formattedPhone,
        payment_method: paymentMethod,
        description: description || null,
        status: "PENDING",
        fee_amount: feeAmount,
        fee_percentage: FEE_PERCENTAGE,
        external_ref: external_ref || null,
        metadata: {
          mode,
          ip: req.headers.get("x-forwarded-for") || "unknown",
        },
      })
      .select()
      .single();

    if (txError) {
      console.error("Transaction creation error:", txError);
      return errorResponse("Failed to create transaction", 500);
    }

    // In SANDBOX mode, simulate STK push
    if (mode === "sandbox") {
      // Simulate async callback after 3 seconds
      setTimeout(async () => {
        // 80% success rate in sandbox
        const success = Math.random() > 0.2;
        
await supabaseAdmin
          .from("transactions")
          .update({
            status: success ? "SUCCESS" : "FAILED",
            completed_at: new Date().toISOString(),
            provider_ref: success ? `SANDBOX_${Date.now()}` : null,
            metadata: {
              ...transaction.metadata,
              sandbox_simulated: true,
            },
          })
          .eq("id", transactionId);

        // TODO: Fire webhook if configured
      }, 3000);

      return jsonResponse({
        success: true,
        transaction_id: transactionId,
        status: "PENDING",
        message: `[SANDBOX] STK Push simulated to ${formattedPhone}. Check status in ~3 seconds.`,
        mode: "sandbox",
        amount,
        fee: feeAmount,
        net_amount: amount - feeAmount,
      });
    }

    // In LIVE mode, initiate real STK Push
    // TODO: Implement Daraja API integration
    // For now, return pending status
    return jsonResponse({
      success: true,
      transaction_id: transactionId,
      status: "PENDING",
      message: `STK Push sent to ${formattedPhone}`,
      amount,
      currency,
      fee: feeAmount,
      payment_method: paymentMethod,
    });
  } catch (error) {
    console.error("Charge error:", error);
    return errorResponse("Internal server error", 500);
  }
});
