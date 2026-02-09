import { useState } from 'react';
import { XIcon, CheckCircleIcon, LoaderIcon, PhoneIcon } from '@/components/icons';
import { getPlanById } from '@/config/subscriptionPlans';

type FlowStep = 'confirm' | 'processing' | 'success' | 'trial';

interface SubscriptionPaymentFlowProps {
  open: boolean;
  onClose: () => void;
  planId: string;
  billingCycle: 'monthly' | 'annual';
  mode: 'payment' | 'trial';
  onComplete: () => void;
}

export function SubscriptionPaymentFlow({ open, onClose, planId, billingCycle, mode, onComplete }: SubscriptionPaymentFlowProps) {
  const [step, setStep] = useState<FlowStep>(mode === 'trial' ? 'trial' : 'confirm');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);

  const plan = getPlanById(planId);
  if (!open || !plan) return null;

  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  const nextDate = new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000);

  const handleConfirmPayment = async () => {
    if (!phone.trim()) return;
    setProcessing(true);
    setStep('processing');

    // Simulate M-Pesa STK push delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    setProcessing(false);
    setStep('success');
  };

  const handleStartTrial = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessing(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl">
        {/* Confirm Step */}
        {step === 'confirm' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">Upgrade to {plan.name} Plan?</h3>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition">
                <XIcon size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium text-foreground">{plan.name} Plan</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium text-foreground">KES {price.toLocaleString()}/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing Cycle</span>
                <span className="font-medium text-foreground capitalize">{billingCycle} (renews {nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">What you'll get immediately</p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircleIcon size={14} className="text-green-600" />
                  {plan.productLimit ? `Add up to ${plan.productLimit} products` : 'Unlimited products'}
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircleIcon size={14} className="text-green-600" />
                  Reduced transaction fee: {plan.transactionFee}%
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircleIcon size={14} className="text-green-600" />
                  {plan.features.filter(f => f.included)[2]?.text || 'Priority support'}
                </li>
              </ul>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-foreground mb-2">
                M-Pesa Phone Number
              </label>
              <div className="relative">
                <PhoneIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-3 text-sm font-semibold">
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-foreground">Total due today</span>
                <span className="text-foreground">KES {price.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={onClose} className="flex-1 px-4 py-3 border border-input rounded-lg hover:bg-muted transition font-medium text-foreground">
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={!phone.trim()}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50"
              >
                Confirm & Pay
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              By confirming, you agree to {billingCycle} auto-renewal at KES {price.toLocaleString()}/{billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
          </div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LoaderIcon size={28} className="text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Payment Prompt Sent!</h3>
            <p className="text-sm text-muted-foreground mb-1">
              📱 Check your phone ({phone}) for M-Pesa prompt
            </p>
            <p className="text-sm text-muted-foreground">
              Enter your M-Pesa PIN to complete payment of KES {price.toLocaleString()}
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={handleConfirmPayment}
                className="text-sm text-primary hover:underline font-medium"
              >
                Resend
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                onClick={() => setStep('confirm')}
                className="text-sm text-muted-foreground hover:underline"
              >
                Use different number
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              🎉 Welcome to {plan.name} Plan!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {mode === 'trial'
                ? `Your 14-day free trial has started! Enjoy all ${plan.name} features.`
                : `Your payment of KES ${price.toLocaleString()} was successful!`}
            </p>

            <div className="bg-muted/50 rounded-xl p-4 mb-5 text-left">
              <p className="text-sm font-medium text-foreground mb-2">You can now:</p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircleIcon size={14} className="text-green-600" />
                  {plan.productLimit ? `Add up to ${plan.productLimit} products` : 'Add unlimited products'}
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircleIcon size={14} className="text-green-600" />
                  Enjoy lower transaction fees ({plan.transactionFee}%)
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Start Adding Products
            </button>
          </div>
        )}

        {/* Trial Step */}
        {step === 'trial' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">Start Your 14-Day Free Trial</h3>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition">
                <XIcon size={20} />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Try {plan.name} Plan free for 14 days — no payment required now!
            </p>

            <div className="bg-muted/50 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">What you get</p>
              <ul className="space-y-1.5">
                {plan.features.filter(f => f.included).slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircleIcon size={14} className="text-green-600" />
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 mb-5 text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">After 14 days:</p>
              <ul className="list-disc ml-4 space-y-1 text-xs">
                <li>We'll send a reminder 2 days before trial ends</li>
                <li>You'll be charged KES {plan.monthlyPrice}/month if you continue</li>
                <li>Cancel anytime during trial — no charges</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleStartTrial();
                }}
                disabled={processing}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing && <LoaderIcon size={16} className="animate-spin" />}
                Start Free Trial
              </button>
              <button
                onClick={() => {
                  setStep('confirm');
                }}
                className="flex-1 px-4 py-3 border border-input text-foreground rounded-lg hover:bg-muted transition font-medium"
              >
                Skip Trial & Pay Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
