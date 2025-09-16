import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const assessmentQuestions = [
  {
    id: 1,
    question: "How often have you felt down, depressed, or hopeless in the past two weeks?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ]
  },
  {
    id: 2,
    question: "How often have you had trouble falling or staying asleep?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ]
  },
  {
    id: 3,
    question: "How often have you felt nervous, anxious, or on edge?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ]
  },
  {
    id: 4,
    question: "How has your academic performance been affected by stress?",
    options: [
      { value: "0", label: "No impact" },
      { value: "1", label: "Slight impact" },
      { value: "2", label: "Moderate impact" },
      { value: "3", label: "Significant impact" },
    ]
  },
  {
    id: 5,
    question: "How often do you engage in social activities or spend time with friends?",
    options: [
      { value: "3", label: "Very often" },
      { value: "2", label: "Sometimes" },
      { value: "1", label: "Rarely" },
      { value: "0", label: "Never" },
    ]
  }
];

export const SelfAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [assessmentQuestions[currentQuestion].id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeAssessment = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);
    setScore(totalScore);
    setIsComplete(true);
    toast.success("Assessment completed! Here are your personalized recommendations.");
  };

  const getRecommendations = (score: number) => {
    if (score <= 4) {
      return {
        level: "Low Risk",
        color: "text-success",
        recommendations: [
          "Continue your great self-care habits",
          "Try our mindfulness exercises to maintain balance",
          "Connect with peers in our community forums"
        ]
      };
    } else if (score <= 9) {
      return {
        level: "Moderate Risk",
        color: "text-warning",
        recommendations: [
          "Practice daily breathing exercises",
          "Consider speaking with a campus counselor",
          "Join peer support groups",
          "Establish a regular sleep routine"
        ]
      };
    } else {
      return {
        level: "Higher Risk",
        color: "text-destructive",
        recommendations: [
          "We recommend speaking with a mental health professional",
          "Use our emergency support resources if needed",
          "Practice daily mindfulness and stress relief activities",
          "Connect with trusted friends or family members"
        ]
      };
    }
  };

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
  const currentAnswer = answers[assessmentQuestions[currentQuestion]?.id];

  if (isComplete) {
    const recommendations = getRecommendations(score);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-secondary-light/10 pb-20">
        <div className="p-4 pt-8">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Assessment Complete</h1>
            <p className="text-muted-foreground">Your personalized wellness report</p>
          </div>

          <Card className="max-w-md mx-auto wellness-card">
            <CardHeader className="text-center">
              <CardTitle className={`text-xl ${recommendations.color}`}>
                {recommendations.level}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{score}/15</p>
                <p className="text-sm text-muted-foreground">Assessment Score</p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Recommended Actions:</h3>
                <ul className="space-y-2">
                  {recommendations.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => {
                  setIsComplete(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                  setScore(0);
                }}
                className="w-full"
              >
                Take Assessment Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-secondary-light/10 pb-20">
      <div className="p-4 pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            Wellness Check-In
          </h1>
          <p className="text-muted-foreground">Quick assessment to understand your current state</p>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                {assessmentQuestions[currentQuestion]?.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={currentAnswer || ""} 
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {assessmentQuestions[currentQuestion]?.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label 
                      htmlFor={option.value} 
                      className="flex-1 cursor-pointer text-foreground"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!currentAnswer}
              className="flex-1"
            >
              {currentQuestion === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};