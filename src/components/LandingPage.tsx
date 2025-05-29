
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, User, Trophy, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-16 h-16 text-blue-600" />
            <h1 className="text-6xl font-bold text-blue-800">QuizMaster</h1>
          </div>
          <p className="text-xl text-blue-700 mb-4">
            The ultimate quiz platform for solo challenges and multiplayer battles
          </p>
          <p className="text-sm text-blue-600 mb-8">
            Built by <span className="font-semibold">Pranav Neupane</span>
          </p>
          <div className="flex items-center justify-center gap-6 text-blue-600">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Real-time Multiplayer</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span>Live Leaderboards</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              <span>Smart Analytics</span>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Player Card */}
          <Card className="bg-white border-2 border-blue-200 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer hover:shadow-2xl"
                onClick={() => navigate('/join')}>
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-800">Play Quiz</CardTitle>
              <CardDescription className="text-blue-600">
                Join solo challenges or multiplayer battles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Solo mode with instant results</span>
                </div>
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Join live multiplayer sessions</span>
                </div>
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
                  <span>Compete on real-time leaderboards</span>
                </div>
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                Start Playing
              </Button>
            </CardContent>
          </Card>

          {/* Host Card */}
          <Card className="bg-white border-2 border-blue-200 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer hover:shadow-2xl"
                onClick={() => navigate('/host')}>
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-800">Host Quiz</CardTitle>
              <CardDescription className="text-blue-600">
                Create and manage quiz sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Create custom quizzes</span>
                </div>
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
                  <span>Manage live sessions</span>
                </div>
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                  <span>View detailed analytics</span>
                </div>
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                Start Hosting
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center text-blue-700">
          <h3 className="text-2xl font-semibold mb-8">Why Choose QuizMaster?</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <Zap className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h4 className="font-semibold mb-2 text-blue-800">Lightning Fast</h4>
              <p className="text-sm text-blue-600">Real-time synchronization for seamless gameplay</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <Trophy className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h4 className="font-semibold mb-2 text-blue-800">Competitive</h4>
              <p className="text-sm text-blue-600">Live leaderboards and scoring systems</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <Brain className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h4 className="font-semibold mb-2 text-blue-800">Smart</h4>
              <p className="text-sm text-blue-600">Advanced analytics and insights</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h4 className="font-semibold mb-2 text-blue-800">Social</h4>
              <p className="text-sm text-blue-600">Multiplayer battles with friends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
