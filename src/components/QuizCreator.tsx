
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  type: 'multiple-choice' | 'true-false';
}

interface QuizCreatorProps {
  onBack: () => void;
  onSave: (quiz: any) => void;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ onBack, onSave }) => {
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
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
              <h1 className="text-3xl font-bold text-white">Create Quiz</h1>
              <p className="text-white/80">Design your custom quiz</p>
            </div>
          </div>
          <Button 
            onClick={saveQuiz}
            className="bg-white text-purple-600 hover:bg-white/90"
            disabled={!title || !description || questions.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
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
                <Label>Answer Options</Label>
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <RadioGroupItem 
                      value={index.toString()} 
                      checked={currentQuestion.correctAnswer === index}
                      onClick={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index }))}
                    />
                    <Input
                      value={option}
                      onChange={(e) => updateCurrentOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
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
