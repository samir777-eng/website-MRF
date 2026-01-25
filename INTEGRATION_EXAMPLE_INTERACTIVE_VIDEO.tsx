// EXAMPLE: How to integrate Interactive Video Player with lessons
// This shows how to add interactive questions to lesson videos

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InteractiveVideoPlayer } from "@/components/video/InteractiveVideoPlayer";
import type { InteractiveQuestion } from "@/types/interactive-question";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function LessonPageContent() {
  const { user } = useAuth();
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  // Mock lesson data
  const lesson = {
    id: 'lesson-1',
    title: 'الفاعل وأنواعه',
    description: 'شرح مفصل للفاعل وأنواعه مع أمثلة تطبيقية',
    videoUrl: '/videos/lesson-1.mp4',
    duration: 1800, // 30 minutes
  };

  // Interactive questions at specific timestamps
  const interactiveQuestions: InteractiveQuestion[] = [
    {
      id: 'iq-1',
      lessonId: lesson.id,
      
      // Question appears at 5:30 (330 seconds)
      timestamp: 330,
      pauseVideo: true, // Pause video when question appears
      
      // Question content
      question: 'في الجملة "جاء الطالبُ مبكراً"، ما إعراب كلمة "الطالبُ"؟',
      type: 'multiple-choice',
      difficulty: 'medium',
      
      options: [
        'فاعل مرفوع وعلامة رفعه الضمة',
        'مبتدأ مرفوع وعلامة رفعه الضمة',
        'خبر مرفوع وعلامة رفعه الضمة',
        'نائب فاعل مرفوع وعلامة رفعه الضمة',
      ],
      correctAnswer: 0,
      
      // Feedback
      correctFeedback: 'ممتاز! الطالبُ فاعل لأنه من قام بالفعل "جاء".',
      incorrectFeedback: 'راجع تعريف الفاعل. الفاعل هو من قام بالفعل.',
      explanation: 'الطالبُ فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره، لأنه جاء بعد الفعل "جاء" وهو من فعل الفعل.',
      
      // Context
      context: 'الأستاذ محمد يشرح الآن تعريف الفاعل',
      relatedTopic: 'الفاعل',
      
      // Rewards
      xpReward: 10,
      
      // Analytics
      totalAttempts: 0,
      correctAttempts: 0,
      averageResponseTime: 0,
      
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    
    {
      id: 'iq-2',
      lessonId: lesson.id,
      
      // Question appears at 12:45 (765 seconds)
      timestamp: 765,
      pauseVideo: true,
      
      question: 'هل يمكن أن يكون الفاعل جملة؟',
      type: 'true-false',
      difficulty: 'easy',
      
      options: ['نعم', 'لا'],
      correctAnswer: 0,
      
      correctFeedback: 'صحيح! الفاعل يمكن أن يكون جملة فعلية أو اسمية.',
      incorrectFeedback: 'في الواقع، الفاعل يمكن أن يكون جملة.',
      explanation: 'الفاعل يمكن أن يكون: اسماً ظاهراً، ضميراً، مصدراً مؤولاً، أو جملة (فعلية أو اسمية).',
      
      context: 'الأستاذ محمد يشرح أنواع الفاعل',
      relatedTopic: 'أنواع الفاعل',
      
      xpReward: 5,
      
      totalAttempts: 0,
      correctAttempts: 0,
      averageResponseTime: 0,
      
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    
    {
      id: 'iq-3',
      lessonId: lesson.id,
      
      // Question appears at 18:20 (1100 seconds)
      timestamp: 1100,
      pauseVideo: true,
      
      question: 'في الجملة "يسافر الطلابُ إلى المدرسة"، ما علامة رفع الفاعل؟',
      type: 'multiple-choice',
      difficulty: 'medium',
      
      options: [
        'الضمة',
        'الواو',
        'الألف',
        'ثبوت النون',
      ],
      correctAnswer: 0,
      
      correctFeedback: 'ممتاز! الطلابُ فاعل مرفوع بالضمة لأنه جمع تكسير.',
      incorrectFeedback: 'تذكر: جمع التكسير يُرفع بالضمة.',
      explanation: 'الطلابُ فاعل مرفوع وعلامة رفعه الضمة الظاهرة لأنه جمع تكسير. جمع المذكر السالم يُرفع بالواو، والمثنى يُرفع بالألف.',
      
      context: 'الأستاذ محمد يشرح علامات رفع الفاعل',
      relatedTopic: 'علامات رفع الفاعل',
      
      xpReward: 10,
      
      totalAttempts: 0,
      correctAttempts: 0,
      averageResponseTime: 0,
      
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    
    {
      id: 'iq-4',
      lessonId: lesson.id,
      
      // Question appears at 25:00 (1500 seconds)
      timestamp: 1500,
      pauseVideo: true,
      
      question: 'أي من الجمل التالية فاعلها ضمير مستتر؟',
      type: 'multiple-choice',
      difficulty: 'hard',
      
      options: [
        'جاء الطالب',
        'يذهب إلى المدرسة',
        'الطلاب يدرسون',
        'أكل الولد التفاحة',
      ],
      correctAnswer: 1,
      
      correctFeedback: 'رائع! الفاعل في "يذهب" ضمير مستتر تقديره "هو".',
      incorrectFeedback: 'ابحث عن الجملة التي لا يظهر فيها الفاعل بشكل واضح.',
      explanation: 'في جملة "يذهب إلى المدرسة"، الفاعل ضمير مستتر تقديره "هو". الفعل "يذهب" لم يأتِ بعده فاعل ظاهر، فالفاعل مستتر.',
      
      context: 'الأستاذ محمد يشرح الفاعل الضمير المستتر',
      relatedTopic: 'الضمير المستتر',
      
      xpReward: 15,
      
      totalAttempts: 0,
      correctAttempts: 0,
      averageResponseTime: 0,
      
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const handleQuestionAnswered = (attempt: any) => {
    console.log('Question answered:', attempt);
    
    // TODO: Send to backend API
    // POST /api/lessons/:lessonId/interactive-questions/:questionId/answer
    // Body: { userAnswer, isCorrect, responseTime, videoTimestamp }
  };

  const handleXpEarned = (xp: number) => {
    setTotalXpEarned(prev => prev + xp);
    
    // TODO: Update user's total XP in backend
    // POST /api/user/xp/add
    // Body: { xp, source: 'interactive-question', lessonId }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <Badge className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            الدرس الأول
          </Badge>
          <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-muted-foreground text-lg">{lesson.description}</p>
        </div>

        {/* Interactive Video Player */}
        <Card className="border-0 shadow-xl mb-6">
          <CardContent className="p-6">
            <InteractiveVideoPlayer
              videoUrl={lesson.videoUrl}
              questions={interactiveQuestions}
              lessonId={lesson.id}
              onQuestionAnswered={handleQuestionAnswered}
              onXpEarned={handleXpEarned}
            />
          </CardContent>
        </Card>

        {/* Lesson Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Interactive Questions Info */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">الأسئلة التفاعلية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">عدد الأسئلة</span>
                  <Badge>{interactiveQuestions.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">XP متاح</span>
                  <Badge className="bg-yellow-600 text-white">
                    {interactiveQuestions.reduce((sum, q) => sum + q.xpReward, 0)} XP
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">XP مكتسب</span>
                  <Badge className="bg-green-600 text-white">
                    {totalXpEarned} XP
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Timeline */}
          <Card className="border-0 shadow-xl md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">مواضع الأسئلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {interactiveQuestions.map((q, index) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm">{q.question}</p>
                        <p className="text-xs text-muted-foreground">{q.context}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {Math.floor(q.timestamp / 60)}:{(q.timestamp % 60).toString().padStart(2, '0')}
                      </Badge>
                      <Badge className="bg-yellow-600 text-white">
                        +{q.xpReward} XP
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LessonPage() {
  return (
    <ProtectedRoute requireAuth={true} requireSubscription={true}>
      <LessonPageContent />
    </ProtectedRoute>
  );
}

