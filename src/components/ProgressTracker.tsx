
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Calendar } from 'lucide-react';
import { ABVariant } from '@/types/campaign';

interface ProgressTrackerProps {
  current: number;
  goal: number;
  variant: ABVariant;
}

const ProgressTracker = ({ current, goal, variant }: ProgressTrackerProps) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);
  const daysLeft = 27; // Simulated
  const donorCount = Math.floor(current / 75); // Simulated average donation

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  const getUrgencyMessage = () => {
    if (percentage >= 90) return "🔥 Almost there! Final push needed!";
    if (percentage >= 75) return "⚡ Momentum building! Keep it going!";
    if (percentage >= 50) return "🎯 Halfway milestone reached!";
    return "🚀 Every donation makes a difference!";
  };

  return (
    <div className="space-y-4">
      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Progress to Goal</span>
          <Badge variant="outline" className="text-xs">
            {percentage.toFixed(1)}% Complete
          </Badge>
        </div>
        <Progress value={percentage} className="h-3" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            ${current.toLocaleString()}
          </div>
          <div className="text-sm text-blue-800">Raised so far</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            ${goal.toLocaleString()}
          </div>
          <div className="text-sm text-green-800">Total goal</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${remaining.toLocaleString()}
          </div>
          <div className="text-sm text-orange-800">Still needed</div>
        </div>
      </div>

      {/* Dynamic Urgency Message */}
      {(variant === 'variant_a' || variant === 'variant_b') && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <div className="text-center text-purple-800 font-medium">
            {getUrgencyMessage()}
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{donorCount} donors</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{daysLeft} days left</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span>${(current / donorCount || 0).toFixed(0)} avg</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
