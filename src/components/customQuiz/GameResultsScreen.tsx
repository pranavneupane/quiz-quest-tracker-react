
import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomQuiz, Player } from './types';
import { useNavigate } from 'react-router-dom';

interface GameResultsScreenProps {
  quiz: CustomQuiz;
  players: Player[];
}

const GameResultsScreen: React.FC<GameResultsScreenProps> = ({ quiz, players }) => {
  const navigate = useNavigate();
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl">Final Results</CardTitle>
            <p className="text-gray-600">{quiz.title}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-100 border-2 border-yellow-300' : 
                  index === 1 ? 'bg-gray-100 border-2 border-gray-300' :
                  index === 2 ? 'bg-orange-100 border-2 border-orange-300' :
                  'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-500 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-gray-300 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{player.name}</span>
                    {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div className="text-lg font-bold">{player.score} pts</div>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3">
              <Button 
                className="w-full" 
                onClick={() => navigate('/host')}
              >
                Create Another Quiz
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameResultsScreen;
