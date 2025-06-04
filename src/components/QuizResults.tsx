
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trophy, Home, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuizResults = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
//pranav
  const mockResults = {
    playerName: 'You',
    score: 8,
    totalQuestions: 10,
    rank: 2,
    totalPlayers: 5,
    correctAnswers: [0, 1, 2, 4, 5, 6, 8, 9],
    timeSpent: 456, // seconds
    leaderboard: [
      { name: 'Alice', score: 9, time: 432 },
      { name: 'You', score: 8, time: 456 },
      { name: 'Bob', score: 7, time: 489 },
      { name: 'Charlie', score: 6, time: 501 },
      { name: 'David', score: 5, time: 523 }
    ]
  };

  const percentage = Math.round((mockResults.score / mockResults.totalQuestions) * 100);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h1>
          <p className="text-white/80 text-lg">Great job on completing the quiz</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Results */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <div className="text-6xl font-bold text-purple-600 mb-2">{percentage}%</div>
                <p className="text-gray-600 text-lg">
                  {mockResults.score} out of {mockResults.totalQuestions} correct
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">#{mockResults.rank}</div>
                  <div className="text-sm text-gray-600">Your Rank</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{Math.floor(mockResults.timeSpent / 60)}:{(mockResults.timeSpent % 60).toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/join')}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Another Quiz
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigator.share?.({
                      title: 'Check out my quiz results!',
                      text: `I scored ${percentage}% on this quiz!`,
                      url: window.location.href
                    });
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate('/')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Final Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockResults.leaderboard.map((player, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      player.name === 'You' ? 'bg-blue-100 border-2 border-blue-300' :
                      index === 0 ? 'bg-yellow-100 border border-yellow-300' :
                      'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-400 text-white' :
                        'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-gray-500">
                          {Math.floor(player.time / 60)}:{(player.time % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold">{player.score} pts</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Badges */}
        <Card className="bg-white/95 backdrop-blur-sm mt-6">
          <CardHeader>
            <CardTitle className="text-center">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {percentage >= 80 && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-medium text-sm">Quiz Master</div>
                  <div className="text-xs text-gray-600">80%+ Score</div>
                </div>
              )}
              {mockResults.rank <= 3 && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-2">🥉</div>
                  <div className="font-medium text-sm">Top 3</div>
                  <div className="text-xs text-gray-600">Finished in top 3</div>
                </div>
              )}
              {mockResults.timeSpent < 300 && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-medium text-sm">Speed Demon</div>
                  <div className="text-xs text-gray-600">Under 5 minutes</div>
                </div>
              )}
              {percentage === 100 && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-2">💯</div>
                  <div className="font-medium text-sm">Perfect Score</div>
                  <div className="text-xs text-gray-600">100% Correct</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults;
