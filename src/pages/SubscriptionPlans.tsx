import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Zap, Rocket, Users, Gift } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import {
  subscriptionsApi,
  SubscriptionPlan,
  BillingPeriod,
} from '@/services/api/subscriptions.api';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/helpers/apiErrorHandler';
import { LoadingOverlay } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { format } from 'date-fns';
import apiClient from '@/lib/axios';

interface ApiPlan {
  plan: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  limits: {
    devices: number;
    users: number;
    apiCalls: number;
    dataRetention: number;
    storage: number;
  };
  features: {
    analytics: boolean;
    automation: boolean;
    integrations: boolean;
    support: string;
    whiteLabel: boolean;
  };
}

interface CurrentSubscription {
  id: string;
  plan: string;
  status: string;
  billingPeriod: string;
  price: string;
  nextBillingDate: string;
  createdAt: string;
  limits: {
    devices: number;
    users: number;
    apiCalls: number;
    dataRetention: number;
    storage: number;
  };
  features: {
    analytics: boolean;
    automation: boolean;
    integrations: boolean;
    support: string;
    whiteLabel: boolean;
  };
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  icon: React.ReactNode;
  features: string[];
  limits: {
    devices: string;
    assets: string;
    users: string;
    apiCalls: string;
    dataRetention: string;
    ruleChains: string;
  };
  isPopular?: boolean;
  isEnterprise?: boolean;
}

const formatLimit = (value: number): string => {
  if (value === -1) return 'Unlimited';
  return value.toString();
};

const formatDataRetention = (days: number): string => {
  if (days === -1) return 'Unlimited';
  if (days >= 365)
    return `${Math.round(days / 365)} year${days >= 730 ? 's' : ''}`;
  return `${days} day${days !== 1 ? 's' : ''}`;
};

const formatApiCalls = (calls: number): string => {
  if (calls === -1) return 'Unlimited';
  if (calls >= 1000000) return `${(calls / 1000000).toFixed(1)}M`;
  if (calls >= 1000) return `${(calls / 1000).toFixed(0)}K`;
  return calls.toString();
};

const getPlanIcon = (planId: string): React.ReactNode => {
  switch (planId) {
    case 'free':
      return <Gift className="h-6 w-6" />;
    case 'starter':
      return <Users className="h-6 w-6" />;
    case 'professional':
      return <Rocket className="h-6 w-6" />;
    case 'enterprise':
      return <Zap className="h-6 w-6" />;
    default:
      return <Users className="h-6 w-6" />;
  }
};

const generateFeatures = (apiPlan: ApiPlan): string[] => {
  const features: string[] = [];

  if (apiPlan.limits.devices !== -1) {
    features.push(`Up to ${apiPlan.limits.devices} devices`);
  } else {
    features.push('Unlimited devices');
  }

  if (apiPlan.features.analytics) {
    features.push('Advanced analytics');
  }

  if (apiPlan.features.automation) {
    features.push('Automation & rule chains');
  }

  if (apiPlan.features.integrations) {
    features.push('Third-party integrations');
  }

  if (apiPlan.features.whiteLabel) {
    features.push('White-label dashboards');
  }

  features.push(`${apiPlan.features.support} support`);
  features.push(
    `${formatDataRetention(apiPlan.limits.dataRetention)} data retention`
  );

  if (apiPlan.limits.storage !== -1) {
    features.push(`${apiPlan.limits.storage}GB storage`);
  } else {
    features.push('Unlimited storage');
  }

  return features;
};

const transformApiPlanToPlan = (apiPlan: ApiPlan): Plan => {
  return {
    id: apiPlan.plan,
    name: apiPlan.name,
    description: `${apiPlan.name} plan for your business needs`,
    price: {
      monthly: apiPlan.monthlyPrice,
      yearly: apiPlan.yearlyPrice,
    },
    icon: getPlanIcon(apiPlan.plan),
    features: generateFeatures(apiPlan),
    limits: {
      devices: formatLimit(apiPlan.limits.devices),
      assets: formatLimit(apiPlan.limits.devices), // Using devices as proxy for assets
      users: formatLimit(apiPlan.limits.users),
      apiCalls: formatApiCalls(apiPlan.limits.apiCalls),
      dataRetention: formatDataRetention(apiPlan.limits.dataRetention),
      ruleChains: apiPlan.features.automation ? 'Unlimited' : '0',
    },
    isPopular: apiPlan.plan === 'professional',
    isEnterprise: apiPlan.plan === 'enterprise',
  };
};

export default function SubscriptionPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

  const {
    data: plansResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const response = await subscriptionsApi.getPlans();
      // Handle nested API response structure: { data: { data: [...] } }
      const apiResponse = response.data as unknown as
        | { data?: ApiPlan[] }
        | undefined;
      return apiResponse?.data || [];
    },
  });

  const { data: currentSubscriptionResponse } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: async () => {
      const response = await subscriptionsApi.getCurrent();
      // Handle nested API response structure: { data: { data: {...} } }
      const apiResponse = response.data as unknown as
        | { data?: CurrentSubscription }
        | undefined;
      return apiResponse?.data;
    },
  });

  // call payment method here to pay get the url and open in new tab and return the url
  const handlePayment = async (
    plan: SubscriptionPlan,
    billingPeriod: BillingPeriod
  ) => {
    const response = await apiClient.post(`/payments/create`, {
      plan,
      billingPeriod,
    });
    return response.data.data.paymentUrl;
  };

  const currentPlanId = currentSubscriptionResponse?.plan;

  const plans = useMemo(() => {
    if (!plansResponse || !Array.isArray(plansResponse)) return [];
    return plansResponse.map(transformApiPlanToPlan);
  }, [plansResponse]);

  // Map plan IDs to SubscriptionPlan enum
  const mapPlanIdToSubscriptionPlan = (planId: string): SubscriptionPlan => {
    switch (planId) {
      case 'free':
        return SubscriptionPlan.FREE;
      case 'starter':
        return SubscriptionPlan.BASIC;
      case 'professional':
        return SubscriptionPlan.PROFESSIONAL;
      case 'enterprise':
        return SubscriptionPlan.ENTERPRISE;
      default:
        return SubscriptionPlan.FREE;
    }
  };

  const handlePlanSelection = async (planId: string) => {
    // Don't allow subscribing to the current plan
    if (planId === currentPlanId) {
      toast.error('This is your current plan');
      return;
    }
    setIsSubscribing(planId);
    try {
      const plan = mapPlanIdToSubscriptionPlan(planId);
      const billing =
        billingPeriod === 'monthly'
          ? BillingPeriod.MONTHLY
          : BillingPeriod.YEARLY;

      const result = await subscriptionsApi.upgrade(plan, billing);
      const requiresPayment = result.data.data.requiresPayment;
      if (requiresPayment) {
        const paymentUrl = await handlePayment(plan, billing);
        window.location.href = paymentUrl;
      } else {
        toast.error('Successfully subscribed to plan');
      }
    } catch (error: unknown) {
      const errorMessage =
        getErrorMessage(error) || 'Failed to subscribe to plan';
      toast.error(errorMessage);
    } finally {
      setIsSubscribing(null);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingOverlay />
      </AppLayout>
    );
  }

  if (isError) {
    return (
      <AppLayout>
        <ErrorMessage
          message={
            getErrorMessage(error) || 'Failed to load subscription plans'
          }
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 border bg-[#fff6fb]/50 p-6 rounded-lg border-secondary ">
        <div className="">
          <Badge className="text-base  mb-4 font-normal px-4 py-2 bg-secondary text-white">
            Subscription
          </Badge>
          <div className="text-2xl font-semibold">
            Manage Your Subscription Plans
          </div>
          <div className="text-sm text-muted-foreground">
            Choose the perfect plan to support your business growth. Manage your
            subscriptions easily and stay in control.
          </div>
        </div>

        {/* Current Plan Card */}
        {currentSubscriptionResponse && (
          <Card className="border-secondary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Current Plan:{' '}
                    {plans.find((p) => p.id === currentPlanId)?.name ||
                      currentPlanId}
                    <Badge className="text-base px-4 bg-secondary text-white">
                      {currentSubscriptionResponse.status === 'active'
                        ? 'Active'
                        : currentSubscriptionResponse.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {currentSubscriptionResponse.nextBillingDate && (
                      <>
                        Next billing date:{' '}
                        {format(
                          new Date(currentSubscriptionResponse.nextBillingDate),
                          'MMMM d, yyyy'
                        )}
                      </>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 ">
          <Label
            htmlFor="billing"
            className={`cursor-pointer ${
              billingPeriod === 'monthly'
                ? 'font-semibold text-gray-900'
                : 'text-gray-500'
            }`}
          >
            Monthly
          </Label>
          <Switch
            id="billing"
            checked={billingPeriod === 'yearly'}
            onCheckedChange={(checked) =>
              setBillingPeriod(checked ? 'yearly' : 'monthly')
            }
          />
          <div className="flex items-center gap-2">
            <Label
              htmlFor="billing"
              className={`cursor-pointer ${
                billingPeriod === 'yearly'
                  ? 'font-semibold text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              Yearly
            </Label>
            {billingPeriod === 'yearly' && (
              <Badge className="bg-green-100 text-green-700 border-green-300">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-20">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-3xl transition-all hover:shadow-md  hover:translate-y-[-5px] duration-500 ${
                plan.isPopular
                  ? 'border-2 border-primary shadow-lg'
                  : 'border border-gray-400'
              }`}
            >
              {/* Header Section with Plan Name and Badge */}
              <div
                className={`px-6 pt-6 pb-4 ${
                  plan.isPopular ? 'bg-gray-900' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={`text-xl font-semibold ${
                      plan.isPopular ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.name} Plan
                  </h3>
                  <Badge
                    className={`${
                      plan.id === 'free'
                        ? 'bg-blue-500 text-white'
                        : plan.isPopular
                        ? 'bg-pink-500 text-white'
                        : 'bg-blue-600 text-white'
                    } px-6 py-1  font-semibold uppercase`}
                  >
                    {plan.id === 'free'
                      ? 'FREE'
                      : plan.isPopular
                      ? 'PRO'
                      : 'ADVANCE'}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      plan.isPopular ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    $
                    {billingPeriod === 'monthly'
                      ? plan.price.monthly
                      : Math.round(plan.price.yearly / 12)}
                    .00
                  </span>
                  <span
                    className={`text-sm ${
                      plan.isPopular ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    /month
                  </span>
                </div>
              </div>

              {/* Current Plan / Upgrade Button */}
              <div
                className={`px-6 py-3 ${
                  plan.isPopular ? 'bg-gray-900' : 'bg-white'
                }`}
              >
                {(() => {
                  const isCurrentPlan = plan.id === currentPlanId;
                  const currentBillingPeriod =
                    currentSubscriptionResponse?.billingPeriod?.toLowerCase();
                  const isBillingPeriodMatch =
                    (billingPeriod === 'monthly' &&
                      currentBillingPeriod === 'monthly') ||
                    (billingPeriod === 'yearly' &&
                      currentBillingPeriod === 'yearly');
                  const showCurrentPlan = isCurrentPlan && isBillingPeriodMatch;

                  if (showCurrentPlan) {
                    return (
                      <Button
                        className="w-full bg-gray-100 border border-gray-300 text-black hover:bg-gray-800 font-medium"
                        disabled
                      >
                        Current Plan
                      </Button>
                    );
                  }

                  return (
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 bg-black text-white hover:bg-black/80 font-medium"
                      onClick={() => handlePlanSelection(plan.id)}
                      disabled={isSubscribing !== null}
                      isLoading={isSubscribing === plan.id}
                    >
                      {currentPlanId &&
                      plans.findIndex((p) => p.id === plan.id) >
                        plans.findIndex((p) => p.id === currentPlanId)
                        ? 'Upgrade Plan'
                        : isCurrentPlan && !isBillingPeriodMatch
                        ? 'Upgrade Plan'
                        : 'Subscribe'}
                    </Button>
                  );
                })()}
              </div>

              {/* Features List */}
              <CardContent
                className={`flex-1 px-6 pb-6 ${
                  plan.isPopular
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <ol className="space-y-3 list-decimal list-inside">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={`text-sm ${
                        plan.isPopular ? 'text-gray-300' : 'text-gray-900'
                      }`}
                    >
                      {feature}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Feature Comparison
            </CardTitle>
            <CardDescription>
              Compare features across all plans side by side
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 pr-8 font-semibold text-gray-900">
                      Feature
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.id}
                        className={`text-center py-4 px-4 font-semibold ${
                          plan.isPopular ? 'text-primary' : 'text-gray-900'
                        }`}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Devices', key: 'devices' },
                    { feature: 'Assets', key: 'assets' },
                    { feature: 'Users', key: 'users' },
                    { feature: 'API Calls', key: 'apiCalls' },
                    { feature: 'Data Retention', key: 'dataRetention' },
                    { feature: 'Rule Chains', key: 'ruleChains' },
                  ].map((row) => (
                    <tr
                      key={row.key}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 pr-8 font-medium text-gray-900">
                        {row.feature}
                      </td>
                      {plans.map((plan) => (
                        <td
                          key={plan.id}
                          className={`text-center py-4 px-4 ${
                            plan.isPopular ? 'bg-primary/5' : ''
                          }`}
                        >
                          <span className="font-semibold text-gray-900">
                            {plan.limits[row.key as keyof typeof plan.limits]}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
