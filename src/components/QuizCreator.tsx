
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Users, Timer, Zap, SkipForward, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'true-false';
}

interface GameSettings {
  maxPlayers: number;
  timerPerQuestion: number;
  multiplierEnabled: boolean;
  skipAllowed: boolean;
}

interface QuizCreatorProps {
  onBack: () => void;
  onSave: (quiz: any) => void;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ onBack, onSave }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    type: 'multiple-choice'
  });
  
  // Game settings
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    maxPlayers: 4,
    timerPerQuestion: 20,
    multiplierEnabled: true,
    skipAllowed: true
  });

  const addQuestion = () => {
    if (currentQuestion.text && currentQuestion.options?.every(opt => opt.trim())) {
      setQuestions(prev => [...prev, {
        ...currentQuestion as Question,
        id: Date.now().toString()
      }]);
      setCurrentQuestion({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        type: 'multiple-choice'
      });
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateCurrentOption = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt) || []
    }));
  };

  const saveQuiz = () => {
    if (title && description && questions.length > 0) {
      onSave({
        title,
        description,
        category: category || 'General',
        difficulty,
        questions: questions.length
      });
    }
  };

  const generateGameCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Navigate to custom multiplayer with the generated code
    navigate(`/custom-quiz/${code}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Custom Quiz</h1>
              <p className="text-white/80">Design your quiz and start multiplayer game</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={saveQuiz}
              variant="outline"
              disabled={!title || !description || questions.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Quiz
            </Button>
            <Button 
              onClick={generateGameCode}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!title || !description || questions.length === 0}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Multiplayer
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quiz Details */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter quiz description"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Science, History, Sports"
                />
              </div>
              <div>
                <Label>Difficulty</Label>
                <RadioGroup value={difficulty} onValueChange={setDifficulty}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Easy" id="easy" />
                    <Label htmlFor="easy">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hard" id="hard" />
                    <Label htmlFor="hard">Hard</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Game Settings */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Multiplayer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4" />
                  Maximum Players
                </Label>
                <Select 
                  value={gameSettings.maxPlayers.toString()} 
                  onValueChange={(value) => setGameSettings(prev => ({ ...prev, maxPlayers: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Players</SelectItem>
                    <SelectItem value="3">3 Players</SelectItem>
                    <SelectItem value="4">4 Players</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4" />
                  Timer per Question
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{gameSettings.timerPerQuestion}s</span>
                  <Badge variant="outline">Fixed at 20s</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Score Multiplier
                </Label>
                <Switch
                  checked={gameSettings.multiplierEnabled}
                  onCheckedChange={(checked) => setGameSettings(prev => ({ ...prev, multiplierEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <SkipForward className="w-4 h-4" />
                  Allow Skip (Once per player)
                </Label>
                <Switch
                  checked={gameSettings.skipAllowed}
                  onCheckedChange={(checked) => setGameSettings(prev => ({ ...prev, skipAllowed: checked }))}
                />
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Only human players can join</p>
                  <p>• Host controls question timing</p>
                  <p>• Real-time competitive scoring</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Question */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question">Question Text</Label>
                <Textarea
                  id="question"
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter your question"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Answer Options (Select correct answer)</Label>
                <RadioGroup 
                  value={currentQuestion.correctAnswer?.toString() || "0"} 
                  onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: parseInt(value) }))}
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Input
                        value={option}
                        onChange={(e) => updateCurrentOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      <Label htmlFor={`option-${index}`} className="text-xs text-gray-500">
                        {index === currentQuestion.correctAnswer ? 'Correct' : ''}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button 
                onClick={addQuestion}
                className="w-full"
                disabled={!currentQuestion.text || !currentQuestion.options?.every(opt => opt.trim())}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        {questions.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle>Questions ({questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{index + 1}. {question.text}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex} 
                              className={`text-sm p-2 rounded ${
                                optIndex === question.correctAnswer 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-50'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizCreator;
