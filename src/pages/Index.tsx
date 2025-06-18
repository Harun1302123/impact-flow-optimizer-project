import React, { useState, useEffect } from 'react';
import CampaignDashboard from '@/components/CampaignDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    // Initialize analytics tracking for page load
    analyticsService.trackEvent('page_view', {
      page: 'donation_optimizer',
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Intelligent Donation Flow Optimizer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Experience dynamic CTAs, personalized micro-goals, and A/B testing to maximize donation conversions. 
            This demo showcases how modern psychology and data-driven optimization can transform fundraising.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <span className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <Tabs defaultValue="campaign" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="campaign">Live Campaign</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaign" className="space-y-6">
            <CampaignDashboard />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-lg p-6">
          <h3 className="font-semibold mb-2">About This Demo</h3>
          <p className="max-w-2xl mx-auto">
            This demonstration showcases advanced donation optimization techniques including dynamic CTAs, 
            personalized micro-goals, and A/B testing frameworks. The system tracks user behavior and 
            adapts the donation experience in real-time to maximize conversion rates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
