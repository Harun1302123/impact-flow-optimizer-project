
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Target, TrendingUp } from 'lucide-react';
import { Campaign, ABVariant } from '@/types/campaign';
import { campaignService } from '@/services/campaignService';
import { analyticsService } from '@/services/analyticsService';
import { toast } from '@/hooks/use-toast';

interface DonationSectionProps {
  campaign: Campaign;
  variant: ABVariant;
  onDonate: (amount: number) => void;
}

const DonationSection = ({ campaign, variant, onDonate }: DonationSectionProps) => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [microGoal, setMicroGoal] = useState<{amount: number, message: string} | null>(null);
  const [dynamicCTA, setDynamicCTA] = useState<{text: string, color: string}>({ text: 'Donate Now', color: 'blue' });

  const suggestedAmounts = [25, 50, 100, 250, 500];

  useEffect(() => {
    const loadOptimizationData = async () => {
      try {
        const optimizationData = await campaignService.getOptimizationData(campaign.id);
        setMicroGoal(optimizationData.microGoal);
        setDynamicCTA(optimizationData.dynamicCTA);
      } catch (error) {
        console.error('Failed to load optimization data:', error);
      }
    };

    loadOptimizationData();
  }, [campaign.id, campaign.currentRaised]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    
    analyticsService.trackEvent('amount_selected', {
      amount,
      type: 'suggested',
      variant_id: variant,
      campaign_id: campaign.id
    });
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleDonateClick = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }

    analyticsService.trackEvent('cta_click', {
      amount,
      variant_id: variant,
      campaign_id: campaign.id,
      cta_text: dynamicCTA.text
    });

    onDonate(amount);
    
    toast({
      title: "Thank You!",
      description: `Your donation of $${amount} has been processed successfully.`,
    });

    // Reset form
    setSelectedAmount(null);
    setCustomAmount('');
  };

  const getCTAButtonClass = () => {
    const baseClass = "w-full text-lg font-semibold py-3 transition-all duration-200 hover:scale-105";
    
    switch (dynamicCTA.color) {
      case 'green':
        return `${baseClass} bg-green-600 hover:bg-green-700 text-white`;
      case 'orange':
        return `${baseClass} bg-orange-600 hover:bg-orange-700 text-white`;
      case 'red':
        return `${baseClass} bg-red-600 hover:bg-red-700 text-white`;
      default:
        return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`;
    }
  };

  const shouldShowMicroGoal = variant === 'variant_b' || variant === 'variant_a';
  const shouldShowDynamicCTA = variant === 'variant_a' || variant === 'variant_b';

  return (
    <div className="space-y-6">
      {/* Micro-Goal Display */}
      {shouldShowMicroGoal && microGoal && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-200 rounded-full">
                <Target className="h-5 w-5 text-orange-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-orange-800">Next Milestone</p>
                <p className="text-orange-700">{microGoal.message}</p>
              </div>
              <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                ${microGoal.amount - campaign.currentRaised} to go
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Donation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Make Your Donation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Suggested Amounts */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Choose an amount
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {suggestedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className="h-12"
                  onClick={() => handleAmountSelect(amount)}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Or enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-8 h-12 text-lg"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          {/* Dynamic CTA Button */}
          <Button
            onClick={handleDonateClick}
            className={getCTAButtonClass()}
            disabled={!selectedAmount && !customAmount}
          >
            {shouldShowDynamicCTA ? dynamicCTA.text : 'Donate Now'}
            <TrendingUp className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your donation is secure and helps us reach our community goals
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationSection;
