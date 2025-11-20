import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Crown, Zap, Rocket, Users, Database, Cloud, Shield, Star } from 'lucide-react';

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
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: {
      monthly: 0,
      yearly: 0,
    },
    icon: <Crown className="h-6 w-6" />,
    features: [
      'Unlimited devices',
      'Custom solutions',
      'Dedicated support',
      'Custom data retention',
      'Advanced security',
      'On-premise deployment',
      'Custom integrations',
      'SLA guarantee',
      'Training & onboarding',
    ],
    limits: {
      devices: 'Unlimited',
      assets: 'Unlimited',
      users: 'Unlimited',
      apiCalls: 'Unlimited',
      dataRetention: 'Custom',
      ruleChains: 'Unlimited',
    },
    isEnterprise: true,
  },
];

export default function SubscriptionPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        description="Choose the perfect plan for your IoT needs"
      />

      {/* Current Plan */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan: Professional</CardTitle>
              <CardDescription>Next billing date: March 1, 2025</CardDescription>
            </div>
            <Badge className="text-base px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Active
            </Badge>
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
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Label htmlFor="billing" className={billingPeriod === 'monthly' ? 'font-semibold' : ''}>
          Monthly
        </Label>
        <Switch
          id="billing"
          checked={billingPeriod === 'yearly'}
          onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
        />
        <Label htmlFor="billing" className={billingPeriod === 'yearly' ? 'font-semibold' : ''}>
          Yearly
          <Badge variant="secondary" className="ml-2">Save 17%</Badge>
        </Label>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${plan.isPopular ? 'border-primary shadow-lg scale-105' : ''}`}
          >
            {plan.isPopular && (
              <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold rounded-t-lg">
                Most Popular
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {plan.icon}
                </div>
                {plan.isEnterprise && (
                  <Badge variant="secondary">Custom</Badge>
                )}
              </div>
              <CardTitle className="text-2xl mt-4">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="mb-6">
                {plan.isEnterprise ? (
                  <div className="text-3xl font-bold">Custom</div>
                ) : (
                  <>
                    <div className="text-4xl font-bold">
                      ${billingPeriod === 'monthly' ? plan.price.monthly : Math.round(plan.price.yearly / 12)}
                      <span className="text-base font-normal text-muted-foreground">/month</span>
                    </div>
                    {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ${plan.price.yearly}/year billed annually
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t space-y-2">
                <p className="text-xs font-semibold text-muted-foreground mb-3">LIMITS</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Devices:</span>
                    <span className="font-medium">{plan.limits.devices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Users:</span>
                    <span className="font-medium">{plan.limits.users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API Calls:</span>
                    <span className="font-medium">{plan.limits.apiCalls}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Retention:</span>
                    <span className="font-medium">{plan.limits.dataRetention}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              {plan.id === 'professional' ? (
                <Button variant="outline" className="w-full">
                  Current Plan
                </Button>
              ) : plan.isEnterprise ? (
                <Button className="w-full">
                  Contact Sales
                </Button>
              ) : (
                <Button
                  variant={plan.isPopular ? 'default' : 'outline'}
                  className="w-full"
                >
                  {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>Compare features across all plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 pr-4">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-4">
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
                  <tr key={row.key} className="border-b">
                    <td className="py-4 pr-4 font-medium">{row.feature}</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        {plan.limits[row.key as keyof typeof plan.limits]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Secure & Reliable</CardTitle>
            <CardDescription>
              Enterprise-grade security with 99.9% uptime SLA
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Cloud className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Scalable Infrastructure</CardTitle>
            <CardDescription>
              Automatically scale with your growing IoT needs
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>24/7 Support</CardTitle>
            <CardDescription>
              Dedicated support team ready to help you succeed
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}