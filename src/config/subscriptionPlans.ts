/**
 * PayLoom Subscription Plans Configuration
 */

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: 'free' | 'growth' | 'pro';
  name: string;
  tagline: string;
  icon: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  productLimit: number | null; // null = unlimited
  transactionFee: number; // percentage
  features: PlanFeature[];
  popular?: boolean;
  bestValue?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    tagline: 'Forever',
    icon: '🆓',
    monthlyPrice: 0,
    annualPrice: 0,
    currency: 'KES',
    productLimit: 5,
    transactionFee: 5,
    features: [
      { text: '5 products', included: true },
      { text: '5% transaction fee', included: true },
      { text: 'Standard support', included: true },
      { text: 'PayLoom branding', included: true },
      { text: 'Basic analytics', included: true },
      { text: '48hr response time', included: true },
      { text: 'CSV import', included: false },
      { text: 'Custom branding', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Most Popular',
    icon: '💼',
    monthlyPrice: 500,
    annualPrice: 5000,
    currency: 'KES',
    productLimit: 25,
    transactionFee: 4,
    popular: true,
    features: [
      { text: '25 products', included: true },
      { text: '4% transaction fee', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Advanced analytics', included: true },
      { text: '24hr response time', included: true },
      { text: 'CSV import', included: true },
      { text: 'Export data', included: true },
      { text: 'API access', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Best Value',
    icon: '🚀',
    monthlyPrice: 1500,
    annualPrice: 15000,
    currency: 'KES',
    productLimit: null,
    transactionFee: 3,
    bestValue: true,
    features: [
      { text: 'Unlimited products', included: true },
      { text: '3% transaction fee', included: true },
      { text: 'Dedicated manager', included: true },
      { text: 'White-label', included: true },
      { text: 'API access', included: true },
      { text: 'Instant support', included: true },
      { text: 'Team accounts', included: true },
      { text: 'Priority payout', included: true },
      { text: 'Custom integrations', included: true },
    ],
  },
];

export function getPlanById(id: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(p => p.id === id);
}

export function getNextPlan(currentPlanId: string): SubscriptionPlan | undefined {
  const idx = SUBSCRIPTION_PLANS.findIndex(p => p.id === currentPlanId);
  if (idx < SUBSCRIPTION_PLANS.length - 1) {
    return SUBSCRIPTION_PLANS[idx + 1];
  }
  return undefined;
}

export function getAnnualSavings(plan: SubscriptionPlan): number {
  return (plan.monthlyPrice * 12) - plan.annualPrice;
}
