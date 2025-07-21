
-- Create the quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON string of options array
  correct_answer TEXT NOT NULL,
  section TEXT,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage quiz questions
CREATE POLICY "Admins can manage quiz questions"
ON public.quiz_questions
FOR ALL
USING (public.is_admin());

-- Allow authenticated users to read quiz questions
CREATE POLICY "Authenticated users can read quiz questions"
ON public.quiz_questions
FOR SELECT
TO authenticated
USING (true);

-- Create storage bucket for quiz images
INSERT INTO storage.buckets (id, name, public)
VALUES ('quiz-images', 'quiz-images', true);

-- Allow public to read quiz images
CREATE POLICY "Public can read quiz images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'quiz-images');

-- Allow authenticated users to upload quiz images
CREATE POLICY "Authenticated users can upload quiz images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'quiz-images');
