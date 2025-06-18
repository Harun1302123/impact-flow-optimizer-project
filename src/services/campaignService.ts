
import { Campaign, ABVariant, OptimizationData } from '@/types/campaign';

class CampaignService {
  private campaigns: Map<string, Campaign> = new Map();
  private userVariants: Map<string, ABVariant> = new Map();

  constructor() {
    // Initialize with demo campaign
    const demoCampaign: Campaign = {
      id: 'demo-campaign',
      name: 'Community Center Building Fund',
      totalGoal: 50000,
      currentRaised: 17250,
      description: 'Help us build a community center for our neighborhood',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.campaigns.set('demo-campaign', demoCampaign);
  }

  async getCampaign(campaignId: string): Promise<Campaign> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }
    return campaign;
  }

  async processDonation(campaignId: string, amount: number): Promise<Campaign> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    // Update the raised amount
    campaign.currentRaised += amount;
    campaign.updatedAt = new Date();
    
    this.campaigns.set(campaignId, campaign);
    return campaign;
  }

  async getABVariant(userId: string, experimentId: string): Promise<ABVariant> {
    const key = `${userId}-${experimentId}`;
    
    // Check if user already has a variant assigned
    if (this.userVariants.has(key)) {
      return this.userVariants.get(key)!;
    }

    // Simple hash-based assignment for consistency
    const hash = this.simpleHash(key);
    const variants: ABVariant[] = ['control', 'variant_a', 'variant_b'];
    const assignedVariant = variants[hash % variants.length];
    
    this.userVariants.set(key, assignedVariant);
    return assignedVariant;
  }

  async getOptimizationData(campaignId: string): Promise<OptimizationData> {
    const campaign = await this.getCampaign(campaignId);
    const progressPercentage = (campaign.currentRaised / campaign.totalGoal) * 100;

    // Calculate micro-goal (next milestone)
    let microGoalAmount: number;
    let microGoalMessage: string;

    if (progressPercentage < 25) {
      microGoalAmount = Math.ceil(campaign.totalGoal * 0.25 / 1000) * 1000;
      microGoalMessage = `Help us reach our first milestone of $${microGoalAmount.toLocaleString()}!`;
    } else if (progressPercentage < 50) {
      microGoalAmount = Math.ceil(campaign.totalGoal * 0.5 / 1000) * 1000;
      microGoalMessage = `We're making great progress! Next stop: $${microGoalAmount.toLocaleString()}`;
    } else if (progressPercentage < 75) {
      microGoalAmount = Math.ceil(campaign.totalGoal * 0.75 / 1000) * 1000;
      microGoalMessage = `Over halfway there! Let's reach $${microGoalAmount.toLocaleString()}`;
    } else if (progressPercentage < 90) {
      microGoalAmount = Math.ceil(campaign.totalGoal * 0.9 / 1000) * 1000;
      microGoalMessage = `Almost there! Help us get to $${microGoalAmount.toLocaleString()}`;
    } else {
      microGoalAmount = campaign.totalGoal;
      microGoalMessage = `Final push! Help us reach our goal of $${microGoalAmount.toLocaleString()}`;
    }

    // Dynamic CTA based on progress
    let ctaText: string;
    let ctaColor: string;

    if (progressPercentage >= 90) {
      ctaText = '🔥 Final Push! Donate Now';
      ctaColor = 'red';
    } else if (progressPercentage >= 75) {
      ctaText = '⚡ Almost There! Contribute';
      ctaColor = 'orange';
    } else if (progressPercentage >= 50) {
      ctaText = '🎯 Keep It Going! Donate';
      ctaColor = 'green';
    } else {
      ctaText = '🚀 Support Our Mission';
      ctaColor = 'blue';
    }

    return {
      microGoal: {
        amount: microGoalAmount,
        message: microGoalMessage
      },
      dynamicCTA: {
        text: ctaText,
        color: ctaColor
      }
    };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

export const campaignService = new CampaignService();
