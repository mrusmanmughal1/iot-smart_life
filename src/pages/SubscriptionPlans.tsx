import React, { useState } from 'react';
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
import { Zap, Rocket, Users } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import {
  subscriptionsApi,
  SubscriptionPlan,
  BillingPeriod,
} from '@/services/api/subscriptions.api';
import { toast } from 'react-hot-toast';
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

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: {
      monthly: 0,
      yearly: 0,
    },
    icon: <Users className="h-6 w-6" />,
    features: [
      'Up to 10 devices',
      'Basic dashboards',
      'Email support',
      '7 days data retention',
      'Community access',
    ],
    limits: {
      devices: '10',
      assets: '5',
      users: '2',
      apiCalls: '1,000/day',
      dataRetention: '7 days',
      ruleChains: '2',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing teams',
    price: {
      monthly: 149,
      yearly: 1490,
    },
    icon: <Rocket className="h-6 w-6" />,
    features: [
      'Up to 500 devices',
      'White-label dashboards',
      '24/7 support',
      '90 days data retention',
      'Advanced analytics',
      'Unlimited rule chains',
      'Multi-tenancy',
      'SSO integration',
    ],
    limits: {
      devices: '500',
      assets: '250',
      users: '50',
      apiCalls: '100,000/day',
      dataRetention: '90 days',
      ruleChains: 'Unlimited',
    },
    isPopular: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For small businesses',
    price: {
      monthly: 49,
      yearly: 490,
    },
    icon: <Zap className="h-6 w-6" />,
    features: [
      'Up to 100 devices',
      'Advanced dashboards',
      'Priority support',
      '30 days data retention',
      'Custom rule chains',
      'API access',
    ],
    limits: {
      devices: '100',
      assets: '50',
      users: '10',
      apiCalls: '10,000/day',
      dataRetention: '30 days',
      ruleChains: '10',
    },
  },

  // {
  //   id: 'enterprise',
  //   name: 'Enterprise',
  //   description: 'For large organizations',
  //   price: {
  //     monthly: 0,
  //     yearly: 0,
  //   },
  //   icon: <Crown className="h-6 w-6" />,
  //   features: [
  //     'Unlimited devices',
  //     'Custom solutions',
  //     'Dedicated support',
  //     'Custom data retention',
  //     'Advanced security',
  //     'On-premise deployment',
  //     'Custom integrations',
  //     'SLA guarantee',
  //     'Training & onboarding',
  //   ],
  //   limits: {
  //     devices: 'Unlimited',
  //     assets: 'Unlimited',
  //     users: 'Unlimited',
  //     apiCalls: 'Unlimited',
  //     dataRetention: 'Custom',
  //     ruleChains: 'Unlimited',
  //   },
  //   isEnterprise: true,
  // },
];

export default function SubscriptionPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

  // Map plan IDs to SubscriptionPlan enum
  const mapPlanIdToSubscriptionPlan = (planId: string): SubscriptionPlan => {
    switch (planId) {
      case 'free':
        return SubscriptionPlan.FREE;
      case 'starter':
        return SubscriptionPlan.BASIC; // Assuming starter maps to BASIC
      case 'professional':
        return SubscriptionPlan.PROFESSIONAL;
      default:
        return SubscriptionPlan.FREE;
    }
  };

  const handlePlanSelection = async (planId: string) => {
    // Don't allow subscribing to the current plan
    if (planId === 'professional') {
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

      const result = await subscriptionsApi.create(plan, billing);
      if (result.status === 201) {
        window.open(result.data.data.paymentUrl);
      }

      toast.success(
        `Successfully subscribed to ${
          plans.find((p) => p.id === planId)?.name
        } plan!`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to subscribe to plan';
      toast.error(errorMessage);
    } finally {
      setIsSubscribing(null);
    }
  };

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

        {/* Current Plan */}
        {/* <Card className="border-secondary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Current Plan: Professional{' '}
                  <Badge className="text-base px-4   bg-secondary text-white">
                    Active
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Next billing date: March 1, 2025
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Devices Used</p>
                  <p className="text-2xl font-bold">342 / 500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Users</p>
                  <p className="text-2xl font-bold">28 / 50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Cloud className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">API Calls Today</p>
                  <p className="text-2xl font-bold">45,230</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-3xl transition-all hover:shadow-xl ${
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
                    } px-6 py-1 text-md font-semibold uppercase`}
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
                {plan.id === 'professional' ? (
                  <Button
                    className="w-full bg-gray-100  border border-gray-300 text-black hover:bg-gray-800 font-medium"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-gray-300   bg-black text-white hover:bg-black/80 font-medium"
                    onClick={() => handlePlanSelection(plan.id)}
                    disabled={isSubscribing !== null}
                    isLoading={isSubscribing === plan.id}
                  >
                    Upgrade Plan
                  </Button>
                )}
              </div>

              {/* Discount Badge (if applicable) */}
              {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                <div className="px-6 pb-3">
                  <Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-semibold">
                    295 x 49
                  </Badge>
                </div>
              )}

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
