
import React from 'react';
import { Users, Crown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomQuiz, Player } from './types';

interface GameWaitingRoomProps {
  quiz: CustomQuiz;
  gameCode: string;
  players: Player[];
  isHost: boolean;
  onStartGame: () => void;
  onAddMockPlayer: () => void;
}

const GameWaitingRoom: React.FC<GameWaitingRoomProps> = ({
  quiz,
  gameCode,
  players,
  isHost,
  onStartGame,
  onAddMockPlayer
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <p className="text-gray-600">{quiz.description}</p>
          <p className="text-gray-600">Game Code: <span className="font-mono font-bold text-purple-600">{gameCode}</span></p>
          <div className="flex justify-center gap-4 mt-2">
            <Badge variant="outline">{quiz.questions.length} Questions</Badge>
            <Badge variant="outline">{quiz.settings.timerPerQuestion}s Timer</Badge>
            <Badge variant="outline">Max {quiz.settings.maxPlayers} Players</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Players ({players.length}/{quiz.settings.maxPlayers})</h3>
              {players.length < quiz.settings.maxPlayers && (
                <Button variant="outline" size="sm" onClick={onAddMockPlayer}>
                  Add Test Player
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {players.map((player) => (
                <div key={player.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                  <span className="font-medium">{player.name}</span>
                  {player.isHost && <Badge variant="secondary">Host</Badge>}
                </div>
              ))}
            </div>
            
            {isHost && players.length >= 2 && (
              <div className="text-center mt-6">
                <Button onClick={onStartGame} size="lg" className="w-full">
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              </div>
            )}
            
            {(!isHost || players.length < 2) && (
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  {players.length < 2 ? 'Waiting for more players to join...' : 'Waiting for host to start the game...'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameWaitingRoom;
