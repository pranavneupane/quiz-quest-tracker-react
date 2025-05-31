
import React from 'react';
import { BarChart3, Users, Play, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  created: string;
  plays: number;
}

interface HostDashboardStatsProps {
  quizzes: Quiz[];
}

const HostDashboardStats = ({ quizzes }: HostDashboardStatsProps) => {
  const totalPlays = quizzes.reduce((sum, quiz) => sum + quiz.plays, 0);
  const totalCategories = new Set(quizzes.map(q => q.category)).size;

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Plays</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlays}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Play className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostDashboardStats;
