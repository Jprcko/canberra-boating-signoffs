
import React, { useState, useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, Download, Filter, Search, Trash2 } from "lucide-react";

interface ParsedQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  section: string;
  category: string;
}

interface DatabaseQuestion {
  id: string;
  question: string;
  options: string;
  correct_answer: string;
  section: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const QuizAdmin = () => {
  const [bulkText, setBulkText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bulkImageText, setBulkImageText] = useState('');
  const [parsedImageQuestions, setParsedImageQuestions] = useState<ParsedQuestion[]>([]);
  const [bulkImages, setBulkImages] = useState<File[]>([]);
  const [singleQuestion, setSingleQuestion] = useState({
    question: '',
    options: ['', '', ''],
    correct_answer: '',
    section: '',
    category: '',
    image: null as File | null
  });
  const [questions, setQuestions] = useState<DatabaseQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<DatabaseQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<DatabaseQuestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState<DatabaseQuestion | null>(null);
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

  // Fetch all questions from database
  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
      setFilteredQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive"
      });
    }
  };

  // Load questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter questions based on category and search term
  useEffect(() => {
    let filtered = questions;

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.correct_answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  }, [questions, selectedCategory, searchTerm]);

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
      
      // Refresh questions list
      fetchQuestions();
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

      // Refresh questions list
      fetchQuestions();
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

  // Parse bulk questions with images
  const parseBulkImageQuestions = () => {
    const lines = bulkImageText.trim().split('\n');
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
    
    setParsedImageQuestions(questions);
    toast({
      title: "Questions Parsed",
      description: `Successfully parsed ${questions.length} questions. You can now upload images.`
    });
  };

  // Save bulk questions with images
  const saveBulkImageQuestions = async () => {
    if (parsedImageQuestions.length === 0) {
      toast({
        title: "No Questions",
        description: "Please parse questions first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const questionsWithImages = [];

      for (let i = 0; i < parsedImageQuestions.length; i++) {
        const question = parsedImageQuestions[i];
        let imageUrl = null;

        // Check if there's a corresponding image for this question
        if (bulkImages[i]) {
          imageUrl = await uploadImage(bulkImages[i]);
        }

        questionsWithImages.push({
          question: question.question,
          options: JSON.stringify(question.options),
          correct_answer: question.correct_answer,
          section: question.section,
          category: question.category,
          image_url: imageUrl
        });
      }

      const { data, error } = await supabase
        .from('quiz_questions')
        .insert(questionsWithImages);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Saved ${parsedImageQuestions.length} questions with images to database`
      });

      setBulkImageText('');
      setParsedImageQuestions([]);
      setBulkImages([]);
      
      // Refresh questions list
      fetchQuestions();
    } catch (error) {
      console.error('Error saving questions with images:', error);
      toast({
        title: "Error",
        description: "Failed to save questions with images",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (index: number, file: File | null) => {
    const newImages = [...bulkImages];
    if (file) {
      newImages[index] = file;
    } else {
      delete newImages[index];
    }
    setBulkImages(newImages);
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Question deleted successfully"
      });

      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive"
      });
    }
  };

  const getCategoryLabel = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedQuestion(selectedQuestion);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedQuestion(null);
  };

  const handleSaveEdit = async () => {
    if (!editedQuestion) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .update({
          question: editedQuestion.question,
          options: editedQuestion.options,
          correct_answer: editedQuestion.correct_answer,
          section: editedQuestion.section,
          category: editedQuestion.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', editedQuestion.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Question updated successfully"
      });

      setIsEditing(false);
      setEditedQuestion(null);
      setSelectedQuestion(editedQuestion);
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEditedOption = (index: number, value: string) => {
    if (!editedQuestion) return;
    
    const options = JSON.parse(editedQuestion.options);
    options[index] = value;
    setEditedQuestion({
      ...editedQuestion,
      options: JSON.stringify(options)
    });
  };

  const addEditedOption = () => {
    if (!editedQuestion) return;
    
    const options = JSON.parse(editedQuestion.options);
    options.push('');
    setEditedQuestion({
      ...editedQuestion,
      options: JSON.stringify(options)
    });
  };

  const removeEditedOption = (index: number) => {
    if (!editedQuestion) return;
    
    const options = JSON.parse(editedQuestion.options);
    if (options.length > 2) {
      options.splice(index, 1);
      setEditedQuestion({
        ...editedQuestion,
        options: JSON.stringify(options)
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-navy mb-8">Quiz Question Admin</h1>
          
          <Tabs defaultValue="log" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="log">Questions Log</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
              <TabsTrigger value="bulk-image">Bulk + Images</TabsTrigger>
              <TabsTrigger value="single">Single Question</TabsTrigger>
            </TabsList>

            <TabsContent value="log">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">All Questions ({filteredQuestions.length})</h2>
                  <Button onClick={fetchQuestions} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-64">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Questions Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Correct Answer</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuestions.map((question) => (
                        <TableRow 
                          key={question.id} 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            setSelectedQuestion(question);
                            setIsModalOpen(true);
                          }}
                        >
                          <TableCell className="min-w-0">
                            <div className="whitespace-normal break-words">
                              {question.question}
                            </div>
                          </TableCell>
                          <TableCell>
                            {question.category && (
                              <Badge variant="secondary">
                                {getCategoryLabel(question.category)}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {question.section && (
                              <Badge variant="outline">{question.section}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={question.correct_answer}>
                              {question.correct_answer}
                            </div>
                          </TableCell>
                          <TableCell>
                            {question.image_url ? (
                              <img 
                                src={question.image_url} 
                                alt="Question" 
                                className="w-8 h-8 object-cover rounded cursor-pointer"
                                onClick={() => window.open(question.image_url!, '_blank')}
                              />
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(question.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteQuestion(question.id);
                              }}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredQuestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {questions.length === 0 ? 'No questions found' : 'No questions match your filters'}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

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

            <TabsContent value="bulk-image">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Bulk Import with Images</h2>
                <p className="text-gray-600 mb-4">
                  Paste your questions in the same format, then upload images for each question in order.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="bulk-image-text">Questions Text</Label>
                    <Textarea
                      id="bulk-image-text"
                      value={bulkImageText}
                      onChange={(e) => setBulkImageText(e.target.value)}
                      placeholder="Paste your questions here..."
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={parseBulkImageQuestions} disabled={!bulkImageText.trim()}>
                      Parse Questions
                    </Button>
                    <Button 
                      onClick={saveBulkImageQuestions} 
                      disabled={parsedImageQuestions.length === 0 || isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? 'Saving...' : `Save ${parsedImageQuestions.length} Questions with Images`}
                    </Button>
                  </div>

                  {parsedImageQuestions.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Questions with Image Upload:</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {parsedImageQuestions.map((q, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-sm mb-2">Question {index + 1}:</p>
                                <p className="text-sm mb-2">{q.question}</p>
                                <p className="text-xs text-gray-600">
                                  Section: {q.section} | Category: {q.category} | Answer: {q.correct_answer}
                                </p>
                              </div>
                              <div>
                                <Label htmlFor={`image-${index}`} className="text-sm">
                                  Image for Question {index + 1} (optional)
                                </Label>
                                <Input
                                  id={`image-${index}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(index, e.target.files?.[0] || null)}
                                  className="mt-1"
                                />
                                {bulkImages[index] && (
                                  <p className="text-xs text-green-600 mt-1">
                                    ✓ Image selected: {bulkImages[index].name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Question Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
          </DialogHeader>
          
          {selectedQuestion && (
            <div className="space-y-6">
              {/* Edit/Save Buttons */}
              <div className="flex justify-end gap-2">
                {!isEditing ? (
                  <Button onClick={handleEditClick} variant="outline">
                    Edit Question
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleCancelEdit} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Question */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Question</h3>
                {isEditing && editedQuestion ? (
                  <Textarea
                    value={editedQuestion.question}
                    onChange={(e) => setEditedQuestion({...editedQuestion, question: e.target.value})}
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-gray-800 leading-relaxed">{selectedQuestion.question}</p>
                )}
              </div>

              {/* Image if present */}
              {selectedQuestion.image_url && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Image</h3>
                  <img 
                    src={selectedQuestion.image_url} 
                    alt="Question Image" 
                    className="max-w-full h-auto rounded-lg border shadow-sm"
                  />
                </div>
              )}

              {/* Options */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Options</h3>
                {isEditing && editedQuestion ? (
                  <div className="space-y-2">
                    {JSON.parse(editedQuestion.options).map((option: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateEditedOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          onClick={() => removeEditedOption(index)}
                          variant="outline"
                          size="sm"
                          disabled={JSON.parse(editedQuestion.options).length <= 2}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button onClick={addEditedOption} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {JSON.parse(selectedQuestion.options).map((option: string, index: number) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border ${
                          option === selectedQuestion.correct_answer 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                        {option === selectedQuestion.correct_answer && (
                          <span className="ml-2 text-green-600 font-semibold">✓ Correct Answer</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Correct Answer */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Correct Answer</h3>
                {isEditing && editedQuestion ? (
                  <Input
                    value={editedQuestion.correct_answer}
                    onChange={(e) => setEditedQuestion({...editedQuestion, correct_answer: e.target.value})}
                    placeholder="Enter the correct answer"
                  />
                ) : (
                  <p className="text-gray-800">{selectedQuestion.correct_answer}</p>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Category</h3>
                  {isEditing && editedQuestion ? (
                    <Select 
                      value={editedQuestion.category || ''} 
                      onValueChange={(value) => setEditedQuestion({...editedQuestion, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className="text-sm">
                      {selectedQuestion.category ? getCategoryLabel(selectedQuestion.category) : 'Not specified'}
                    </Badge>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Section</h3>
                  {isEditing && editedQuestion ? (
                    <Select 
                      value={editedQuestion.section || ''} 
                      onValueChange={(value) => setEditedQuestion({...editedQuestion, section: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map(section => (
                          <SelectItem key={section} value={section}>{section}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline" className="text-sm">
                      {selectedQuestion.section || 'Not specified'}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-sm text-gray-500 border-t pt-4">
                <p>Created: {new Date(selectedQuestion.created_at).toLocaleString()}</p>
                <p>Updated: {new Date(selectedQuestion.updated_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default QuizAdmin;
