
import React, { useState } from 'react';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, Download } from "lucide-react";

interface ParsedQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  section: string;
  category: string;
}

const QuizAdmin = () => {
  const [bulkText, setBulkText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singleQuestion, setSingleQuestion] = useState({
    question: '',
    options: ['', '', ''],
    correct_answer: '',
    section: '',
    category: '',
    image: null as File | null
  });
  const { toast } = useToast();

  const categories = [
    { value: 'lifejackets_safety', label: 'Lifejackets and safety equipment' },
    { value: 'preparation_behavior', label: 'Preparation, behaviour and decisions' },
    { value: 'rules', label: 'Rules' },
    { value: 'navigation_marks', label: 'Navigation marks, lights & sounds' },
    { value: 'waterways_areas', label: 'Waterways and designated areas' },
    { value: 'protecting_environment', label: 'Protecting the environment' },
    { value: 'emergencies_incidents', label: 'Emergencies and incidents' }
  ];

  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const parseBulkQuestions = () => {
    const lines = bulkText.trim().split('\n');
    const questions: ParsedQuestion[] = [];
    let currentQuestion: Partial<ParsedQuestion> = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('Question:')) {
        // Save previous question if exists
        if (currentQuestion.question) {
          questions.push(currentQuestion as ParsedQuestion);
        }
        
        // Start new question
        currentQuestion = {
          question: line.replace('Question:', '').trim().replace(/^"/, '').replace(/"$/, ''),
          options: [],
          correct_answer: '',
          section: '',
          category: ''
        };
      } else if (line.startsWith('Options:')) {
        const optionsText = line.replace('Options:', '').trim();
        // Parse JSON array or bracket format
        try {
          currentQuestion.options = JSON.parse(optionsText);
        } catch (e) {
          // Fallback for other formats
          currentQuestion.options = optionsText.split(',').map(opt => opt.trim().replace(/^"/, '').replace(/"$/, ''));
        }
      } else if (line.startsWith('Correct Answer:')) {
        currentQuestion.correct_answer = line.replace('Correct Answer:', '').trim().replace(/^"/, '').replace(/"$/, '');
      } else if (line.startsWith('Section:')) {
        currentQuestion.section = line.replace('Section:', '').trim();
      } else if (line.startsWith('Category:')) {
        const categoryText = line.replace('Category:', '').trim();
        // Map category text to category value
        const category = categories.find(cat => cat.label === categoryText);
        currentQuestion.category = category ? category.value : categoryText.toLowerCase().replace(/ /g, '_');
      }
    }
    
    // Don't forget the last question
    if (currentQuestion.question) {
      questions.push(currentQuestion as ParsedQuestion);
    }
    
    setParsedQuestions(questions);
    toast({
      title: "Questions Parsed",
      description: `Successfully parsed ${questions.length} questions`
    });
  };

  const saveBulkQuestions = async () => {
    if (parsedQuestions.length === 0) {
      toast({
        title: "No Questions",
        description: "Please parse questions first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert(parsedQuestions.map(q => ({
          question: q.question,
          options: JSON.stringify(q.options),
          correct_answer: q.correct_answer,
          section: q.section,
          category: q.category
        })));

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Saved ${parsedQuestions.length} questions to database`
      });

      setBulkText('');
      setParsedQuestions([]);
    } catch (error) {
      console.error('Error saving questions:', error);
      toast({
        title: "Error",
        description: "Failed to save questions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('quiz-images')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: publicUrl } = supabase.storage
      .from('quiz-images')
      .getPublicUrl(fileName);

    return publicUrl.publicUrl;
  };

  const saveSingleQuestion = async () => {
    if (!singleQuestion.question || !singleQuestion.correct_answer) {
      toast({
        title: "Missing Information",
        description: "Please fill in question and correct answer",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = null;
      if (singleQuestion.image) {
        imageUrl = await uploadImage(singleQuestion.image);
      }

      const { error } = await supabase
        .from('quiz_questions')
        .insert({
          question: singleQuestion.question,
          options: JSON.stringify(singleQuestion.options.filter(opt => opt.trim())),
          correct_answer: singleQuestion.correct_answer,
          section: singleQuestion.section,
          category: singleQuestion.category,
          image_url: imageUrl
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Question saved successfully"
      });

      setSingleQuestion({
        question: '',
        options: ['', '', ''],
        correct_answer: '',
        section: '',
        category: '',
        image: null
      });
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-navy mb-8">Quiz Question Admin</h1>
          
          <Tabs defaultValue="bulk" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
              <TabsTrigger value="single">Single Question</TabsTrigger>
            </TabsList>

            <TabsContent value="bulk">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Bulk Question Import</h2>
                <p className="text-gray-600 mb-4">
                  Paste your questions in the format: Question: "..." Options: [...] Correct Answer: "..." Section: ... Category: ...
                </p>
                
                <div className="space-y-4">
                  <Textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Paste your questions here..."
                    className="min-h-[300px]"
                  />
                  
                  <div className="flex gap-4">
                    <Button onClick={parseBulkQuestions} disabled={!bulkText.trim()}>
                      Parse Questions
                    </Button>
                    <Button 
                      onClick={saveBulkQuestions} 
                      disabled={parsedQuestions.length === 0 || isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? 'Saving...' : `Save ${parsedQuestions.length} Questions`}
                    </Button>
                  </div>

                  {parsedQuestions.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Parsed Questions Preview:</h3>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {parsedQuestions.map((q, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded">
                            <p className="font-medium">{q.question}</p>
                            <p className="text-sm text-gray-600">
                              Section: {q.section} | Category: {q.category} | Answer: {q.correct_answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="single">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Add Single Question (with Image)</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      value={singleQuestion.question}
                      onChange={(e) => setSingleQuestion({...singleQuestion, question: e.target.value})}
                      placeholder="Enter the question..."
                    />
                  </div>

                  <div>
                    <Label>Options</Label>
                    {singleQuestion.options.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...singleQuestion.options];
                          newOptions[index] = e.target.value;
                          setSingleQuestion({...singleQuestion, options: newOptions});
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="mt-2"
                      />
                    ))}
                    <Button 
                      onClick={() => setSingleQuestion({
                        ...singleQuestion, 
                        options: [...singleQuestion.options, '']
                      })}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="correct_answer">Correct Answer</Label>
                    <Input
                      id="correct_answer"
                      value={singleQuestion.correct_answer}
                      onChange={(e) => setSingleQuestion({...singleQuestion, correct_answer: e.target.value})}
                      placeholder="Enter the correct answer..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="section">Section</Label>
                      <Select value={singleQuestion.section} onValueChange={(value) => setSingleQuestion({...singleQuestion, section: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map(section => (
                            <SelectItem key={section} value={section}>{section}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={singleQuestion.category} onValueChange={(value) => setSingleQuestion({...singleQuestion, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Image (optional)</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSingleQuestion({...singleQuestion, image: e.target.files?.[0] || null})}
                    />
                  </div>

                  <Button 
                    onClick={saveSingleQuestion} 
                    disabled={isLoading}
                    className="bg-water-blue hover:bg-water-blue/90"
                  >
                    {isLoading ? 'Saving...' : 'Save Question'}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default QuizAdmin;
