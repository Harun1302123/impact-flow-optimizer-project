
import { AnalyticsEvent, ABVariant } from '@/types/campaign';

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private userId: string;

  constructor() {
    // Generate or retrieve user ID
    this.userId = this.generateUserId();
  }

  getUserId(): string {
    return this.userId;
  }

  trackEvent(eventType: string, data: Record<string, any>): void {
    const event: AnalyticsEvent = {
      eventType,
      data,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      variantId: data.variant_id,
      campaignId: data.campaign_id
    };

    this.events.push(event);
    console.log('Analytics Event:', event);
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getEventsByType(eventType: string): AnalyticsEvent[] {
    return this.events.filter(event => event.eventType === eventType);
  }

  getEventsByVariant(variantId: ABVariant): AnalyticsEvent[] {
    return this.events.filter(event => event.variantId === variantId);
  }

  // Simulate analytics data for the dashboard
  getAnalyticsData() {
    const totalEvents = this.events.length;
    const uniqueUsers = new Set(this.events.map(e => e.userId)).size;
    
    // Group events by type
    const eventTypes = this.events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group events by variant
    const variantData = this.events.reduce((acc, event) => {
      if (event.variantId) {
        if (!acc[event.variantId]) {
          acc[event.variantId] = { views: 0, donations: 0, clicks: 0 };
        }
        
        if (event.eventType === 'page_view') acc[event.variantId].views++;
        if (event.eventType === 'donation_successful') acc[event.variantId].donations++;
        if (event.eventType === 'cta_click') acc[event.variantId].clicks++;
      }
      return acc;
    }, {} as Record<string, { views: number; donations: number; clicks: number }>);

    return {
      totalEvents,
      uniqueUsers,
      eventTypes,
      variantData,
      recentEvents: this.events.slice(-10).reverse()
    };
  }

  private generateUserId(): string {
    // Check if user ID exists in localStorage
    let userId = localStorage.getItem('analytics_user_id');
    
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    
    return userId;
  }
}

export const analyticsService = new AnalyticsService();
