
import React from 'react';
import { Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface QuizLoadingErrorProps {
  loading: boolean;
  error: string | null;
  onBackToSelection: () => void;
}

const QuizLoadingError: React.FC<QuizLoadingErrorProps> = ({
  loading,
  error,
  onBackToSelection
}) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Quiz...</h2>
            <p className="text-gray-600">Fetching unique questions for you</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={onBackToSelection}>
              Back to Quiz Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default QuizLoadingError;
