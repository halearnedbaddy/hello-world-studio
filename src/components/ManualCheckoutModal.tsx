import { useState, useEffect } from 'react';
import { X, Smartphone, Building2, Copy, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';

interface PaymentInfo {
  mpesa: {
    tillNumber: string;
    businessName: string;
    instructions: string[];
  };
  bank: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
    instructions: string[];
  };
}

interface ManualCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    currency?: string;
    images?: string[];
  };
  storeSlug: string;
  onSuccess: (transactionId: string) => void;
}

export function ManualCheckoutModal({ isOpen, onClose, product, storeSlug, onSuccess }: ManualCheckoutModalProps) {
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState<'details' | 'payment' | 'confirm' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'BANK'>('MPESA');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [buyerDetails, setBuyerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [paymentDetails, setPaymentDetails] = useState({
    reference: '', // M-Pesa code or bank reference
    proofUrl: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentInfo();
    }
  }, [isOpen]);

  const fetchPaymentInfo = async () => {
    try {
      // Fetch payment info - currently using defaults
      // Use default payment info
      setPaymentInfo({
        mpesa: {
          tillNumber: '4107197',
          businessName: 'PayLoom',
          instructions: [
            'Go to M-Pesa on your phone',
            'Select "Lipa na M-Pesa"',
            'Select "Buy Goods and Services"',
            'Enter Till Number: 4107197',
            'Enter the exact amount shown above',
            'Enter your M-Pesa PIN',
            'Note down the M-Pesa confirmation code'
          ]
        },
        bank: {
          bankName: 'Equity Bank',
          accountName: 'PayLoom Ltd',
          accountNumber: '1234567890',
          branchCode: '012',
          instructions: [
            'Log in to your bank app or visit a branch',
            'Transfer the exact amount to the account above',
            'Use your phone number as reference',
            'Save the transaction receipt'
          ]
        }
      });
    } catch (err) {
      console.error('Failed to fetch payment info:', err);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  const handleCreateTransaction = async () => {
    if (!buyerDetails.name || !buyerDetails.phone) {
      setError('Please fill in your name and phone number');
      return;
    }

    if (!product.price) {
      setError('Product price is not available');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Create transaction via storefront API
      const { data, error: invokeError } = await supabase.functions.invoke('storefront-api', {
        body: {
          action: 'checkout',
          storeSlug,
          productId: product.id,
          buyerName: buyerDetails.name,
          buyerPhone: buyerDetails.phone,
          buyerEmail: buyerDetails.email || undefined,
          buyerAddress: buyerDetails.address || undefined,
          paymentMethod,
        },
      });

      if (invokeError) throw invokeError;
      if (!data?.success) throw new Error(data?.error || 'Failed to create order');

      const txId = data.data?.transactionId || data.data?.id;
      if (txId) {
        setTransactionId(txId);
        setStep('payment');
      } else {
        throw new Error('No transaction ID returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentDetails.reference) {
      setError('Please enter your payment reference code');
      return;
    }

    if (!transactionId) {
      setError('Transaction not found');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Call the submit-payment endpoint directly

      // Call the submit-payment endpoint
      const response = await fetch(
        `https://pxyyncsnjpuwvnwyfdwx.supabase.co/functions/v1/escrow-api/submit-payment/${transactionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethod,
            paymentReference: paymentDetails.reference,
            payerPhone: buyerDetails.phone,
            payerName: buyerDetails.name,
            paymentProofUrl: paymentDetails.proofUrl || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit payment');
      }

      setStep('success');
      onSuccess(transactionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-card-foreground">
            {step === 'details' && 'Checkout'}
            {step === 'payment' && 'Complete Payment'}
            {step === 'confirm' && 'Confirm Payment'}
            {step === 'success' && 'Payment Submitted'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Summary */}
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <div className="flex gap-4">
              {product.images && product.images.length > 0 && (
                <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                {product.price && (
                  <p className="text-lg font-bold text-primary mt-1">
                    {formatPrice(product.price, product.currency || 'KES')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 1: Buyer Details */}
          {step === 'details' && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={buyerDetails.name}
                    onChange={(e) => setBuyerDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={buyerDetails.phone}
                    onChange={(e) => setBuyerDetails(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+254712345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email (optional)</label>
                  <input
                    type="email"
                    value={buyerDetails.email}
                    onChange={(e) => setBuyerDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Delivery Address</label>
                  <textarea
                    value={buyerDetails.address}
                    onChange={(e) => setBuyerDetails(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={2}
                    placeholder="Enter delivery address"
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('MPESA')}
                      className={`p-3 border-2 rounded-lg flex items-center gap-2 transition ${
                        paymentMethod === 'MPESA' 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Smartphone className="text-primary" size={20} />
                      <span className="font-medium text-foreground">M-Pesa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('BANK')}
                      className={`p-3 border-2 rounded-lg flex items-center gap-2 transition ${
                        paymentMethod === 'BANK' 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Building2 className="text-primary" size={20} />
                      <span className="font-medium text-foreground">Bank</span>
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                onClick={handleCreateTransaction}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                {loading ? 'Creating Order...' : 'Continue to Payment'}
              </button>
            </>
          )}

          {/* Step 2: Payment Instructions */}
          {step === 'payment' && paymentInfo && (
            <>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  💰 Pay {formatPrice(product.price || 0, product.currency || 'KES')}
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Send the exact amount using the details below, then enter your confirmation code.
                </p>
              </div>

              {paymentMethod === 'MPESA' ? (
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Till Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-foreground">{paymentInfo.mpesa.tillNumber}</span>
                        <button 
                          onClick={() => copyToClipboard(paymentInfo.mpesa.tillNumber, 'till')}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {copied === 'till' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Business Name</span>
                      <span className="font-medium text-foreground">{paymentInfo.mpesa.businessName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{formatPrice(product.price || 0, product.currency || 'KES')}</span>
                        <button 
                          onClick={() => copyToClipboard(String(product.price || 0), 'amount')}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {copied === 'amount' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">How to pay:</h4>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      {paymentInfo.mpesa.instructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bank</span>
                      <span className="font-medium text-foreground">{paymentInfo.bank.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Account Name</span>
                      <span className="font-medium text-foreground">{paymentInfo.bank.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{paymentInfo.bank.accountNumber}</span>
                        <button 
                          onClick={() => copyToClipboard(paymentInfo.bank.accountNumber, 'account')}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {copied === 'account' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-bold text-primary">{formatPrice(product.price || 0, product.currency || 'KES')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {paymentMethod === 'MPESA' ? 'M-Pesa Confirmation Code *' : 'Bank Reference Number *'}
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.reference}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, reference: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                    placeholder={paymentMethod === 'MPESA' ? 'e.g. QHK7XXXXXX' : 'e.g. TXN123456789'}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 bg-muted text-muted-foreground py-3 rounded-lg font-semibold hover:bg-muted/80 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={loading || !paymentDetails.reference}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'I Have Paid'}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Payment Submitted!</h3>
              <p className="text-muted-foreground">
                Your payment is being verified. You'll receive a notification once it's confirmed.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-mono font-bold text-foreground">{transactionId}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
