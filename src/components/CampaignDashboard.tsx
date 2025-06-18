
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DonationSection from './DonationSection';
import ProgressTracker from './ProgressTracker';
import ABTestingPanel from './ABTestingPanel';
import { campaignService } from '@/services/campaignService';
import { analyticsService } from '@/services/analyticsService';
import { Campaign, ABVariant } from '@/types/campaign';

const CampaignDashboard = () => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentVariant, setCurrentVariant] = useState<ABVariant>('control');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCampaign = async () => {
      setIsLoading(true);
      try {
        // Get campaign data
        const campaignData = await campaignService.getCampaign('demo-campaign');
        setCampaign(campaignData);

        // Get A/B test variant assignment
        const userId = analyticsService.getUserId();
        const variant = await campaignService.getABVariant(userId, 'donation-optimization-v1');
        setCurrentVariant(variant);

        // Track experiment exposure
        analyticsService.trackEvent('experiment_exposure', {
          experiment_id: 'donation-optimization-v1',
          variant_id: variant,
          user_id: userId
        });
      } catch (error) {
        console.error('Failed to initialize campaign:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCampaign();
  }, []);

  const handleDonation = async (amount: number) => {
    if (!campaign) return;

    try {
      // Process donation
      const updatedCampaign = await campaignService.processDonation(campaign.id, amount);
      setCampaign(updatedCampaign);

      // Track successful donation
      analyticsService.trackEvent('donation_successful', {
        amount,
        campaign_id: campaign.id,
        variant_id: currentVariant,
        user_id: analyticsService.getUserId()
      });
    } catch (error) {
      console.error('Donation failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Failed to load campaign data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Campaign Info */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {campaign.name}
              <span className="text-sm font-normal bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Active Campaign
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressTracker 
              current={campaign.currentRaised} 
              goal={campaign.totalGoal}
              variant={currentVariant}
            />
            <DonationSection 
              campaign={campaign}
              variant={currentVariant}
              onDonate={handleDonation}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              Help us build a community center that will serve over 500 families in our neighborhood. 
              This facility will provide after-school programs, job training, and community events. 
              Every donation brings us closer to breaking ground on this vital community resource.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* A/B Testing Panel */}
      <div className="lg:col-span-1">
        <ABTestingPanel 
          currentVariant={currentVariant}
          campaign={campaign}
          onVariantChange={setCurrentVariant}
        />
      </div>
    </div>
  );
};

export default CampaignDashboard;
