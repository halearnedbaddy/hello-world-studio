import { useState } from 'react';
import { CheckIcon, XIcon } from '@/components/icons';
import { SUBSCRIPTION_PLANS, getAnnualSavings } from '@/config/subscriptionPlans';

interface PricingPlansProps {
  currentPlanId: string;
  onSelectPlan: (planId: string, billing: 'monthly' | 'annual') => void;
  onStartTrial: (planId: string) => void;
  onBack?: () => void;
}

export function PricingPlans({ currentPlanId, onSelectPlan, onStartTrial, onBack }: PricingPlansProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        {onBack && (
          <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Products
          </button>
        )}
        <h2 className="text-2xl font-bold text-foreground">PayLoom Pricing Plans</h2>
        <p className="text-muted-foreground mt-1">Choose the plan that fits your business</p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              billingCycle === 'monthly'
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              billingCycle === 'annual'
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Annual
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-bold">
              Save 2 months
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {SUBSCRIPTION_PLANS.map(plan => {
          const isCurrent = plan.id === currentPlanId;
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
          const savings = getAnnualSavings(plan);

          return (
            <div
              key={plan.id}
              className={`rounded-xl border-2 p-6 transition-all relative ${
                plan.popular
                  ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02]'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full shadow">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-5">
                <span className="text-2xl">{plan.icon}</span>
                <h3 className="text-lg font-bold text-foreground uppercase mt-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
              </div>

              <div className="text-center mb-5">
                <span className="text-3xl font-black text-foreground">
                  KES {price.toLocaleString()}
                </span>
                {plan.monthlyPrice > 0 && (
                  <span className="text-sm text-muted-foreground">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                )}
                {billingCycle === 'annual' && savings > 0 && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Save KES {savings.toLocaleString()}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-center gap-2 text-sm ${f.included ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                    {f.included ? (
                      <CheckIcon size={16} className="text-green-600 shrink-0" />
                    ) : (
                      <XIcon size={16} className="text-muted-foreground/30 shrink-0" />
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-muted text-muted-foreground rounded-lg font-medium text-sm cursor-default"
                  >
                    Current Plan
                  </button>
                ) : plan.id === 'free' ? (
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-muted text-muted-foreground rounded-lg font-medium text-sm cursor-default"
                  >
                    Free Forever
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onSelectPlan(plan.id, billingCycle)}
                      className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium text-sm"
                    >
                      Pay KES {price.toLocaleString()} →
                    </button>
                    <button
                      onClick={() => onStartTrial(plan.id)}
                      className="w-full px-4 py-2.5 border border-input text-foreground rounded-lg hover:bg-muted transition font-medium text-sm"
                    >
                      Try 14 Days Free
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        💡 Annual plans save you 2 months! Pay yearly and save KES 1,000+
      </p>
    </div>
  );
}
