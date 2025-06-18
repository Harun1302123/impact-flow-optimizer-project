
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Activity, Target, Eye, MousePointer, DollarSign } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(analyticsService.getAnalyticsData());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(analyticsService.getAnalyticsData());
    }, 1000); // Refresh every second to show real-time updates

    return () => clearInterval(interval);
  }, [refreshKey]);

  const handleRefresh = () => {
    setAnalyticsData(analyticsService.getAnalyticsData());
    setRefreshKey(prev => prev + 1);
  };

  // Prepare chart data
  const variantChartData = Object.entries(analyticsData.variantData).map(([variant, data]) => ({
    variant: variant.toUpperCase(),
    views: data.views,
    clicks: data.clicks,
    donations: data.donations,
    conversionRate: data.views > 0 ? ((data.donations / data.views) * 100).toFixed(1) : '0'
  }));

  const eventTypeData = Object.entries(analyticsData.eventTypes).map(([type, count]) => ({
    name: type.replace('_', ' ').toUpperCase(),
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Real-time A/B testing and user engagement metrics</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{analyticsData.totalEvents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Users</p>
                <p className="text-2xl font-bold">{analyticsData.uniqueUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-2xl font-bold">{analyticsData.eventTypes.page_view || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Donations</p>
                <p className="text-2xl font-bold">{analyticsData.eventTypes.donation_successful || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Variant Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              A/B Test Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {variantChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={variantChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="variant" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" name="Views" />
                  <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                  <Bar dataKey="donations" fill="#ffc658" name="Donations" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>No variant data available yet. Start interacting with the campaign!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Event Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>No events tracked yet. Start using the application!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Variant Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Variant Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {variantChartData.length > 0 ? (
            <div className="space-y-4">
              {variantChartData.map((variant) => (
                <div key={variant.variant} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{variant.variant}</Badge>
                    <div className="grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">Views: </span>
                        <span className="font-semibold">{variant.views}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Clicks: </span>
                        <span className="font-semibold">{variant.clicks}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Donations: </span>
                        <span className="font-semibold">{variant.donations}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {variant.conversionRate}%
                    </div>
                    <div className="text-xs text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No A/B test data available. Interact with the campaign to generate analytics data.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData.recentEvents.length > 0 ? (
            <div className="space-y-2">
              {analyticsData.recentEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {event.eventType.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {event.variantId && (
                        <span className="text-blue-600 font-medium">
                          {event.variantId.toUpperCase()}
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
