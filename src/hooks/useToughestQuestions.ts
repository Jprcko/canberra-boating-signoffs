import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ToughestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  image?: string;
  incorrectCount: number;
}

export const useToughestQuestions = () => {
  const [questions, setQuestions] = useState<ToughestQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToughestQuestions = async () => {
      try {
        setLoading(true);
        
        // Get all quiz results with answers
        const { data: quizResults, error } = await supabase
          .from('quiz_results')
          .select('answers');

        if (error) {
          console.error('Error fetching quiz results:', error);
          return;
        }

        // Count incorrect answers for each question
        const questionIncorrectCount: { [key: string]: number } = {};
        
        quizResults?.forEach(result => {
          const answers = result.answers as any[];
          answers?.forEach(answer => {
            if (!answer.isCorrect) {
              const questionId = answer.questionId?.toString();
              if (questionId) {
                questionIncorrectCount[questionId] = (questionIncorrectCount[questionId] || 0) + 1;
              }
            }
          });
        });

        // Get all questions from database
        const { data: allQuestions, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*');

        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          return;
        }

        // Map questions with their incorrect counts and sort by most incorrect
        const questionsWithCounts = (allQuestions || []).map((q, index) => ({
          id: q.id,
          question: q.question,
          options: JSON.parse(q.options),
          correctAnswer: q.correct_answer,
          image: q.image_url || undefined,
          incorrectCount: questionIncorrectCount[(index + 1).toString()] || 0
        }));

        // Sort by incorrect count descending and take top 15
        const toughestQuestions = questionsWithCounts
          .sort((a, b) => b.incorrectCount - a.incorrectCount)
          .slice(0, 15);

        setQuestions(toughestQuestions);
      } catch (error) {
        console.error('Error fetching toughest questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchToughestQuestions();
  }, []);

  return { questions, loading };
};