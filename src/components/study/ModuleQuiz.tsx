import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  image?: string;
}

interface ModuleQuizProps {
  moduleId: string;
  moduleTitle: string;
  category: string;
  onClose: () => void;
}

type QuizState = 'intro' | 'quiz' | 'results';

interface QuizAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

const ModuleQuiz = ({ moduleId, moduleTitle, category, onClose }: ModuleQuizProps) => {
  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch questions from database based on category
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        console.log('Fetching questions for category:', category);
        
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('category', category);

        console.log('Query result:', { data, error, category });

        if (error) {
          console.error('Error fetching questions:', error);
          toast({
            title: "Error",
            description: "Failed to load quiz questions",
            variant: "destructive"
          });
          return;
        }

        console.log('Fetched questions:', data);

        // Transform database questions to match QuizQuestion interface
        const transformedQuestions: QuizQuestion[] = (data || []).map((q, index) => ({
          id: index + 1,
          question: q.question,
          options: JSON.parse(q.options),
          correctAnswer: q.correct_answer,
          image: q.image_url || undefined
        }));

        console.log('Transformed questions:', transformedQuestions);
        setQuestions(transformedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz questions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category, toast]);

  const score = answers.filter(answer => answer.isCorrect).length;
  const percentage = Math.round((score / questions.length) * 100);

  const startQuiz = () => {
    setQuizState('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    
    const newAnswer: QuizAnswer = {
      questionId: questions[currentQuestion].id,
      selectedAnswer: answer,
      isCorrect
    };

    setAnswers(prev => [...prev, newAnswer]);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizState('results');
    
    // Save results to Supabase
    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user?.id || null,
          module_id: moduleId,
          score,
          total_questions: questions.length,
          percentage,
          answers: JSON.parse(JSON.stringify(answers))
        });

      if (error) {
        console.error('Error saving quiz results:', error);
        toast({
          title: "Error",
          description: "Failed to save quiz results",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Quiz Completed!",
          description: `You scored ${score}/${questions.length} (${percentage}%)`,
        });
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  };

  const retryQuiz = () => {
    setQuizState('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const renderIntro = () => (
    <div className="p-6 text-center space-y-6 bg-gradient-to-br from-primary/5 via-water-blue/5 to-accent/5 border-2 border-dashed border-primary/20 rounded-xl">
      <h3 className="text-xl font-semibold text-navy">
        {moduleTitle} Test
      </h3>
      <p className="text-gray-700">
        You are about to attempt the {moduleTitle} Test. 
        You will be asked questions based on information in the Boating Handbook.
      </p>
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-water-blue" />
          <span className="ml-2 text-gray-600">Loading questions...</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            This quiz contains {questions.length} questions.
          </p>
          <Button 
            onClick={startQuiz}
            className="bg-water-blue hover:bg-water-blue/90 text-white px-8 py-2 rounded-full"
            disabled={questions.length === 0}
          >
            {questions.length === 0 ? 'No Questions Available' : 'Start Test'}
          </Button>
        </>
      )}
    </div>
  );

  const renderQuiz = () => {
    const question = questions[currentQuestion];
    
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-primary/5 via-water-blue/5 to-accent/5 border-2 border-dashed border-primary/20 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 ml-4">
            <div 
              className="bg-water-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {question.image && (
          <div className="max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={question.image} 
              alt="Question illustration"
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-navy">
            {question.question}
          </h4>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showFeedback && handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`w-full p-4 text-left border rounded-lg transition-all ${
                  showFeedback
                    ? option === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : option === selectedAnswer && option !== question.correctAnswer
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    : selectedAnswer === option
                      ? 'border-water-blue bg-blue-50 text-water-blue'
                      : 'border-gray-200 hover:border-water-blue hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showFeedback && option === question.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {showFeedback && option === selectedAnswer && option !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg ${
                selectedAnswer === question.correctAnswer 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {selectedAnswer === question.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    selectedAnswer === question.correctAnswer ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                {selectedAnswer !== question.correctAnswer && (
                  <p className="mt-2 text-red-700">
                    The correct answer is: <strong>{question.correctAnswer}</strong>
                  </p>
                )}
              </div>

              <Button 
                onClick={nextQuestion}
                className="mt-4 bg-water-blue hover:bg-water-blue/90 text-white"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="p-6 text-center space-y-6 bg-gradient-to-br from-primary/5 via-water-blue/5 to-accent/5 border-2 border-dashed border-primary/20 rounded-xl">
      <h3 className="text-2xl font-bold text-navy">Results</h3>
      
      <div className="space-y-4">
        <div className="text-6xl font-bold text-water-blue">
          {score}/{questions.length}
        </div>
        <div className="text-xl text-gray-700">
          {percentage}% Correct
        </div>
        
        <div className={`p-4 rounded-lg ${
          percentage >= 70 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {percentage >= 70 
            ? '🎉 Congratulations! You passed the test!' 
            : '😔 You need 70% or higher to pass. Try again!'}
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={retryQuiz}
          className="bg-water-blue hover:bg-water-blue/90 text-white w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retry Test
        </Button>
        <Button 
          onClick={onClose}
          variant="outline"
          className="w-full"
        >
          Exit
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="mt-6 overflow-hidden shadow-lg">
      {quizState === 'intro' && renderIntro()}
      {quizState === 'quiz' && !loading && questions.length > 0 && renderQuiz()}
      {quizState === 'results' && renderResults()}
    </Card>
  );
};

export default ModuleQuiz;