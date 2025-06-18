
export interface Campaign {
  id: string;
  name: string;
  totalGoal: number;
  currentRaised: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ABVariant = 'control' | 'variant_a' | 'variant_b';

export interface MicroGoal {
  amount: number;
  message: string;
}

export interface DynamicCTA {
  text: string;
  color: string;
}

export interface OptimizationData {
  microGoal: MicroGoal;
  dynamicCTA: DynamicCTA;
}

export interface AnalyticsEvent {
  eventType: string;
  data: Record<string, any>;
  timestamp: string;
  userId: string;
  variantId?: ABVariant;
  campaignId?: string;
}
