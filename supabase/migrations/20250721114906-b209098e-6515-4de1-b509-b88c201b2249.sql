
-- Update the quiz_questions table to include section field
ALTER TABLE public.quiz_questions 
ADD COLUMN section TEXT;

-- Create an index for section-based queries
CREATE INDEX idx_quiz_questions_section ON public.quiz_questions(section);

-- Update the category field to use the new category names
-- (This is just for reference, you can update existing data later)
