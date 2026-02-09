import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';
import { LoaderIcon, ShieldIcon, CheckCircleIcon, ChevronRightIcon, XIcon } from '@/components/icons';
import { Smartphone, Check } from 'lucide-react';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/supabaseProject';

interface PaymentLinkData {
  id: string;
  productName: string;
  productDescription?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  status: string;
  seller: {
    name: string;
    sellerProfile?: {
      rating: number;
      totalReviews: number;
      isVerified: boolean;
    };
  };
}

type CheckoutStep = 'details' | 'paying' | 'success';

export function BuyPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const [link, setLink] = useState<PaymentLinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('details');
  const [activeImage, setActiveImage] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentPolling, setPaymentPolling] = useState(false);

  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (linkId) loadPaymentLink();
  }, [linkId]);

  // Poll for payment completion
  useEffect(() => {
    if (!paymentPolling || !transactionId) return;
    
    const interval = setInterval(async () => {
      try {
         const response = await fetch(`${SUPABASE_URL}/functions/v1/intasend-api/payment-status`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
           body: JSON.stringify({ orderId: transactionId }),
         });
        const result = await response.json();
        
        if (result.success) {
          const pmtStatus: string | null = result.payment?.status;
          const orderStatus = result.order?.status;
          
          if (pmtStatus === 'completed' || orderStatus === 'processing' || orderStatus === 'paid') {
            setPaymentPolling(false);
            setCheckoutStep('success');
          } else if (pmtStatus === 'failed') {
            setPaymentPolling(false);
            toast({
              title: 'Payment Failed',
              description: 'M-Pesa payment was not completed. Please try again.',
              variant: 'destructive',
            });
            setCheckoutStep('details');
          }
        }
      } catch (err) {
        console.error('Payment status check error:', err);
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      setPaymentPolling(false);
      if (checkoutStep === 'paying') {
        toast({
          title: 'Payment Timeout',
          description: 'Payment verification timed out. If you completed payment, check your order status.',
        });
      }
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paymentPolling, transactionId]);

  const loadPaymentLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/links-api/${linkId}`, {
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
      });
      const result = await response.json();
      if (result.success && result.data) {
        setLink(result.data);
      } else {
        setError(result.error || 'Payment link not found');
      }
    } catch (err) {
      console.error('Failed to load payment link:', err);
      setError('Failed to load payment link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!buyerInfo.name || !buyerInfo.phone) {
      toast({
        title: 'Required Fields',
        description: 'Please enter your name and M-Pesa phone number',
        variant: 'destructive',
      });
      return;
    }

    // Validate phone number format
    const cleanPhone = buyerInfo.phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
    if (!/^(\+?254|0)[0-9]{9}$/.test(cleanPhone)) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid Kenyan phone number (e.g. 0712345678)',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create order
      const orderResponse = await fetch(`${SUPABASE_URL}/functions/v1/links-api/${linkId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({
          buyerName: buyerInfo.name,
          buyerPhone: buyerInfo.phone,
          buyerEmail: buyerInfo.email || undefined,
          deliveryAddress: buyerInfo.address,
          paymentMethod: 'MPESA',
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success || !orderResult.data?.transactionId) {
        const code = orderResult.code ? ` (${orderResult.code})` : '';
        const http = !orderResponse.ok ? ` [HTTP ${orderResponse.status}]` : '';
        throw new Error(`${orderResult.error || 'Failed to create order'}${code}${http}`);
      }

      const orderId = orderResult.data.transactionId;
      setTransactionId(orderId);

      // Step 2: Initiate IntaSend STK Push
      const stkResponse = await fetch(`${SUPABASE_URL}/functions/v1/intasend-api/stk-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({
          phoneNumber: buyerInfo.phone,
          email: buyerInfo.email,
          amount: link!.price,
          orderId,
          narrative: `Payment for ${link!.productName}`,
        }),
      });

      const stkResult = await stkResponse.json();

      if (!stkResult.success) {
        throw new Error(stkResult.error || 'Failed to initiate payment');
      }

      // Step 3: Show waiting screen & start polling
      setCheckoutStep('paying');
      setPaymentPolling(true);

    } catch (err: any) {
      toast({
        title: 'Payment Error',
        description: err.message || 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon size={48} className="animate-spin text-[#5d2ba3] mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XIcon size={32} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Link Not Available</h1>
          <p className="text-gray-600 mb-6">{error || 'This payment link is invalid or has expired.'}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#3d1a7a] text-white rounded-lg hover:bg-[#250e52] transition font-medium"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const discount = link.originalPrice ? Math.round(((link.originalPrice - link.price) / link.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="PayLoom" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2 text-sm text-[#5d2ba3]">
            <ShieldIcon size={16} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
              {link.images && link.images.length > 0 ? (
                <img src={link.images[activeImage]} alt={link.productName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No image available</div>
              )}
            </div>
            {link.images && link.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {link.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${activeImage === idx ? 'border-[#5d2ba3]' : 'border-gray-200'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-[#5d2ba3]/20 rounded-full flex items-center justify-center text-[#5d2ba3] font-bold">
                {link.seller.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{link.seller.name}</p>
                {link.seller.sellerProfile?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#5d2ba3]">
                    <CheckCircleIcon size={12} /> Verified Seller
                  </span>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{link.productName}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#3d1a7a]">{formatPrice(link.price, link.currency)}</span>
                {link.originalPrice && link.originalPrice > link.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(link.originalPrice, link.currency)}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">{discount}% OFF</span>
                  </>
                )}
              </div>
            </div>

            {link.productDescription && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{link.productDescription}</p>
              </div>
            )}

            <div className="bg-[#5d2ba3]/5 border border-[#5d2ba3]/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircleIcon size={16} className="text-[#5d2ba3]" />
                <span>PayLoom Protection - Payment held in escrow</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircleIcon size={16} className="text-[#5d2ba3]" />
                <span>Money-back guarantee if item not received</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircleIcon size={16} className="text-[#5d2ba3]" />
                <span>Automatic M-Pesa payment - no manual codes</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full py-4 bg-[#3d1a7a] text-white rounded-lg font-bold text-lg hover:bg-[#250e52] transition flex items-center justify-center gap-2"
            >
              Buy Now
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !paymentPolling && setShowCheckout(false)} />
          
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#3d1a7a]">
                {checkoutStep === 'details' && 'Complete Your Purchase'}
                {checkoutStep === 'paying' && 'Completing Payment...'}
                {checkoutStep === 'success' && 'Payment Successful!'}
              </h2>
              {!paymentPolling && (
                <button onClick={() => { setShowCheckout(false); setCheckoutStep('details'); }} className="p-2 hover:bg-gray-100 rounded-full">
                  <XIcon size={20} />
                </button>
              )}
            </div>

            <div className="p-6 space-y-5">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  {link.images?.[0] && (
                    <img src={link.images[0]} alt="" className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{link.productName}</p>
                    <p className="text-lg font-bold text-[#3d1a7a]">{formatPrice(link.price, link.currency)}</p>
                  </div>
                </div>
              </div>

              {/* Step 1: Buyer Details + Pay Now */}
              {checkoutStep === 'details' && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        value={buyerInfo.name}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3d1a7a]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number *</label>
                      <div className="flex items-center gap-2">
                        <Smartphone className="text-green-600" size={20} />
                        <input
                          type="tel"
                          value={buyerInfo.phone}
                          onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                          placeholder="0712 345 678"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3d1a7a]"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">You'll receive an M-Pesa payment prompt on this number</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        value={buyerInfo.email}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3d1a7a]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                      <textarea
                        value={buyerInfo.address}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })}
                        placeholder="Enter delivery address"
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3d1a7a] resize-none"
                      />
                    </div>
                  </div>

                  {/* Pay Now Button */}
                  <button
                    onClick={handlePayNow}
                    disabled={processing || !buyerInfo.name || !buyerInfo.phone}
                    className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-3"
                  >
                    {processing ? (
                      <>
                        <LoaderIcon size={20} className="animate-spin" />
                        Initiating Payment...
                      </>
                    ) : (
                      <>
                        <Smartphone size={22} />
                        Pay {formatPrice(link.price, link.currency)} via M-Pesa
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    You'll receive an automatic M-Pesa prompt on your phone. Enter your PIN to pay.
                  </p>
                </>
              )}

              {/* Step 2: Waiting for M-Pesa payment */}
              {checkoutStep === 'paying' && (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Smartphone className="text-green-600 animate-pulse" size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Phone</h3>
                    <p className="text-gray-600">
                      An M-Pesa payment prompt has been sent to <span className="font-bold">{buyerInfo.phone}</span>.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">Enter your M-Pesa PIN to complete the payment.</p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <LoaderIcon size={16} className="animate-spin" />
                    <span>Waiting for payment confirmation...</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                    <p className="font-medium mb-1">Didn't receive the prompt?</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-700">
                      <li>Check if your phone has M-Pesa service</li>
                      <li>Ensure you have sufficient M-Pesa balance</li>
                      <li>Try again if the prompt expired</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setPaymentPolling(false);
                      setCheckoutStep('details');
                    }}
                    className="text-sm text-gray-500 underline hover:text-gray-700"
                  >
                    Cancel and try again
                  </button>
                </div>
              )}

              {/* Step 3: Success */}
              {checkoutStep === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Payment Received!</h3>
                  <p className="text-gray-600">
                    Your M-Pesa payment has been confirmed. Your order is being processed.
                  </p>
                  {transactionId && (
                    <div className="bg-gray-100 rounded-lg p-4 text-sm">
                      <p className="text-gray-500">Order ID</p>
                      <p className="font-mono font-bold text-gray-900">{transactionId}</p>
                    </div>
                  )}
                  <button
                    onClick={() => { setShowCheckout(false); setCheckoutStep('details'); navigate(`/track/${transactionId}`); }}
                    className="w-full py-3 bg-[#3d1a7a] text-white rounded-lg font-semibold hover:bg-[#250e52] transition"
                  >
                    Track Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyPage;
