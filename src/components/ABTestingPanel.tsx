
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TestTube, Users, TrendingUp, Target } from 'lucide-react';
import { Campaign, ABVariant } from '@/types/campaign';
import { analyticsService } from '@/services/analyticsService';

interface ABTestingPanelProps {
  currentVariant: ABVariant;
  campaign: Campaign;
  onVariantChange: (variant: ABVariant) => void;
}

const ABTestingPanel = ({ currentVariant, campaign, onVariantChange }: ABTestingPanelProps) => {
  const variants = [
    {
      id: 'control' as ABVariant,
      name: 'Control',
      description: 'Standard donation flow',
      features: ['Basic CTA button', 'Standard progress bar', 'Traditional layout']
    },
    {
      id: 'variant_a' as ABVariant,
      name: 'Dynamic CTA',
      description: 'Adaptive call-to-action',
      features: ['Dynamic CTA text/color', 'Urgency messaging', 'Progress-based adaptation']
    },
    {
      id: 'variant_b' as ABVariant,
      name: 'Full Optimization',
      description: 'Complete psychological optimization',
      features: ['Dynamic CTAs', 'Micro-goals', 'Personalized messaging', 'Social proof elements']
    }
  ];

  const handleVariantChange = (variant: ABVariant) => {
    onVariantChange(variant);
    
    analyticsService.trackEvent('variant_manual_switch', {
      from_variant: currentVariant,
      to_variant: variant,
      campaign_id: campaign.id,
      user_id: analyticsService.getUserId()
    });
  };

  const getVariantBadgeColor = (variantId: ABVariant) => {
    switch (variantId) {
      case 'control':
        return 'bg-gray-100 text-gray-800';
      case 'variant_a':
        return 'bg-blue-100 text-blue-800';
      case 'variant_b':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Simulated performance metrics
  const getPerformanceMetrics = (variantId: ABVariant) => {
    const baseConversion = 2.3;
    const baseAvgDonation = 87;
    
    switch (variantId) {
      case 'control':
        return { conversion: baseConversion, avgDonation: baseAvgDonation, improvement: 0 };
      case 'variant_a':
        return { conversion: baseConversion * 1.15, avgDonation: baseAvgDonation * 1.08, improvement: 15 };
      case 'variant_b':
        return { conversion: baseConversion * 1.32, avgDonation: baseAvgDonation * 1.18, improvement: 32 };
      default:
        return { conversion: baseConversion, avgDonation: baseAvgDonation, improvement: 0 };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          A/B Test Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {variants.map((variant) => {
            const isActive = currentVariant === variant.id;
            const metrics = getPerformanceMetrics(variant.id);
            
            return (
              <div
                key={variant.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{variant.name}</h4>
                      <Badge className={getVariantBadgeColor(variant.id)}>
                        {variant.id.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{variant.description}</p>
                  </div>
                  {isActive && (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  {variant.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="bg-white p-2 rounded border">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Conv: {metrics.conversion.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Avg: ${metrics.avgDonation}</span>
                    </div>
                  </div>
                </div>

                {metrics.improvement > 0 && (
                  <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
                    <Target className="h-3 w-3" />
                    <span>+{metrics.improvement}% performance</span>
                  </div>
                )}

                {!isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVariantChange(variant.id)}
                    className="w-full text-xs"
                  >
                    Switch to {variant.name}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Note:</strong> This demo allows manual variant switching for testing purposes.</p>
          <p>In production, users would be automatically assigned variants based on A/B testing algorithms.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ABTestingPanel;
