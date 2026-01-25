"use client";

import { DeadlineDisplay } from "@/components/homework/deadline-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Lock,
  Play,
  Send,
  Upload,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type GradeLevel = "1" | "2" | "3";
type HomeworkStatus = "locked" | "available" | "submitted" | "graded";
type QuestionType = "essay" | "short-answer" | "file-upload";

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  instructions?: string;
  points: number;
  minWords?: number;
  maxWords?: number;
  requiresFile?: boolean;
}

interface Homework {
  id: string;
  lectureId: string;
  title: string;
  description: string;
  instructions: string;
  gradeLevel: GradeLevel;
  deadline: Date;
  allowLateSubmission: boolean;
  lateSubmissionDeadline?: Date;
  latePenalty?: number;
  questions: Question[];
  totalPoints: number;
  requiresExerciseComplete: boolean;
}

export default function HomeworkPage() {
  const params = useParams();
  const homeworkId = params.id as string;
  const userGrade: GradeLevel = "1";

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [files, setFiles] = useState<{ [key: string]: File[] }>({});
  const [submitted, setSubmitted] = useState(false);
  const [graded, setGraded] = useState(false);
  const [score, setScore] = useState(0);

  const homework: Homework = {
    id: homeworkId,
    lectureId: "5",
    title: "الواجب المنزلي - الأسبوع الخامس",
    description: "واجب شامل على محاضرة الكتابة الإبداعية",
    instructions: `# تعليمات الواجب المنزلي

## المطلوب:
1. الإجابة على جميع الأسئلة بشكل كامل ومفصل
2. استخدام اللغة العربية الفصحى
3. مراجعة الإجابات قبل التسليم
4. الالتزام بالموعد النهائي

## معايير التقييم:
- **المحتوى (40%)**: عمق الإجابة وشمولها
- **اللغة (30%)**: سلامة اللغة والأسلوب
- **التنظيم (20%)**: ترتيب الأفكار ووضوحها
- **الإبداع (10%)**: الأفكار الجديدة والمبتكرة

## ملاحظات مهمة:
- يمكنك التسليم مرة واحدة فقط
- التأخير عن الموعد يؤدي لخصم 10% من الدرجة
- يجب كتابة 200-300 كلمة لكل سؤال مقالي`,
    gradeLevel: "1",
    // Use fixed dates to avoid hydration mismatch (server/client time difference)
    deadline: new Date("2025-12-15T17:00:00"), // Fixed deadline
    allowLateSubmission: true,
    lateSubmissionDeadline: new Date("2025-12-18T17:00:00"), // Fixed late deadline
    latePenalty: 10,
    totalPoints: 100,
    requiresExerciseComplete: true,
    questions: [
      {
        id: "1",
        type: "essay",
        question: "اكتب مقالاً عن أهمية الكتابة الإبداعية في تطوير الشخصية",
        instructions: "يجب أن يتضمن المقال: مقدمة، ثلاث نقاط رئيسية، وخاتمة",
        points: 30,
        minWords: 200,
        maxWords: 300,
      },
      {
        id: "2",
        type: "essay",
        question: "قارن بين القصة القصيرة والرواية من حيث العناصر والخصائص",
        instructions: "استخدم أمثلة من الأدب العربي",
        points: 30,
        minWords: 200,
        maxWords: 300,
      },
      {
        id: "3",
        type: "short-answer",
        question:
          "اذكر خمسة من أهم الصور البلاغية المستخدمة في الشعر العربي مع أمثلة",
        points: 20,
        minWords: 100,
        maxWords: 150,
      },
      {
        id: "4",
        type: "file-upload",
        question:
          "اكتب قصة قصيرة إبداعية (500-700 كلمة) وارفعها كملف PDF أو Word",
        instructions: "يجب أن تحتوي القصة على: شخصيات، حبكة، صراع، وحل",
        points: 20,
        requiresFile: true,
      },
    ],
  };

  const exerciseCompleted = true; // MOCK
  const hasGradeAccess = homework.gradeLevel === userGrade;
  const canAccessHomework =
    hasGradeAccess && (!homework.requiresExerciseComplete || exerciseCompleted);

  // Track if submission is allowed (calculated on client to avoid hydration mismatch)
  const [canSubmit, setCanSubmit] = useState(true);

  // Store deadline timestamps as stable values
  const deadlineTime = homework.deadline.getTime();
  const lateDeadlineTime = homework.lateSubmissionDeadline?.getTime();
  const allowLate = homework.allowLateSubmission;

  // Calculate submission status only on client side
  useEffect(() => {
    const calculateSubmitStatus = () => {
      const now = new Date();
      const deadline = new Date(deadlineTime);
      const lateDeadline = lateDeadlineTime
        ? new Date(lateDeadlineTime)
        : undefined;

      const isOverdue = now > deadline;
      const isLateSubmission =
        isOverdue && allowLate && lateDeadline && now <= lateDeadline;
      setCanSubmit(!isOverdue || !!isLateSubmission);
    };

    calculateSubmitStatus();
    // Update every minute
    const interval = setInterval(calculateSubmitStatus, 60000);
    return () => clearInterval(interval);
  }, [deadlineTime, lateDeadlineTime, allowLate]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleFileChange = (questionId: string, fileList: FileList | null) => {
    if (fileList) {
      setFiles({ ...files, [questionId]: Array.from(fileList) });
    }
  };

  const handleSubmit = () => {
    // TODO: Submit to API
    setSubmitted(true);

    // MOCK: Simulate grading after 2 seconds
    setTimeout(() => {
      setScore(85);
      setGraded(true);
    }, 2000);
  };

  const answeredCount = Object.keys(answers).length + Object.keys(files).length;
  const totalQuestions = homework.questions.length;
  const progress = (answeredCount / totalQuestions) * 100;

  if (!hasGradeAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">غير مصرح بالوصول</h2>
            <p className="text-muted-foreground mb-6">
              هذا الواجب غير متاح لصفك الدراسي
            </p>
            <Link
              href="/ar/lectures"
              className="block w-full"
              style={{ minHeight: "44px" }}
            >
              <Button className="w-full h-full">العودة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canAccessHomework) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <Lock className="w-20 h-20 text-orange-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">الواجب مغلق</h2>
            <p className="text-muted-foreground mb-6">
              يجب إكمال التمرين أولاً للوصول إلى الواجب المنزلي
            </p>
            <Link
              href={`/ar/exercises/${homework.lectureId}`}
              className="block w-full"
              style={{ minHeight: "44px" }}
            >
              <Button className="w-full h-full">العودة إلى التمرين</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (graded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-8 text-center">
              <Award className="w-24 h-24 text-green-600 mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-4">تم تقييم الواجب</h1>
              <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {score}%
              </div>
              <p className="text-xl text-muted-foreground mb-8">
                أحسنت! عمل ممتاز
              </p>

              <div className="p-6 bg-background rounded-lg mb-8 text-right">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  ملاحظات المعلم:
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  عمل رائع! أظهرت فهماً عميقاً للموضوع. اللغة سليمة والأفكار
                  منظمة بشكل جيد. استمر في هذا المستوى المتميز. بعض النقاط يمكن
                  تطويرها أكثر في المستقبل.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-2xl font-bold">{score}</div>
                  <div className="text-sm text-muted-foreground">من 100</div>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-2xl font-bold">A</div>
                  <div className="text-sm text-muted-foreground">التقدير</div>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <div className="text-2xl font-bold">في الموعد</div>
                  <div className="text-sm text-muted-foreground">التسليم</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solutions Section */}
          <Card className="border-0 shadow-xl mt-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                حلول الواجب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Solution */}
              <div className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">
                    حل الواجب (فيديو)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    شرح تفصيلي لحل جميع أسئلة الواجب
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>25 دقيقة</span>
                </div>
                <Link href={`/ar/videos/homework-solution-${homeworkId}`}>
                  <Button className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    شاهد
                  </Button>
                </Link>
              </div>

              {/* PDF Solution */}
              <div className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">حل الواجب (PDF)</h4>
                  <p className="text-sm text-muted-foreground">
                    ملف PDF يحتوي على الإجابات النموذجية
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>5 صفحات</span>
                </div>
                <Button
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                >
                  <Download className="w-4 h-4 me-2" />
                  تحميل
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Link
              href={`/ar/lectures/${homework.lectureId}`}
              className="block w-full"
              style={{ minHeight: "44px" }}
            >
              <Button
                size="lg"
                className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                العودة إلى المحاضرة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold mb-4">تم التسليم بنجاح</h2>
            <p className="text-muted-foreground mb-6">
              جاري تقييم الواجب من قبل المعلم...
            </p>
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <Card className="border-0 shadow-xl mb-6">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  واجب منزلي
                </Badge>
                <CardTitle className="text-3xl">{homework.title}</CardTitle>
                <p className="text-muted-foreground mt-2">
                  {homework.description}
                </p>
              </div>
            </div>

            {/* Deadline Display - dynamically imported with SSR disabled */}
            <DeadlineDisplay
              deadline={homework.deadline}
              lateSubmissionDeadline={homework.lateSubmissionDeadline}
              allowLateSubmission={homework.allowLateSubmission}
              latePenalty={homework.latePenalty}
            />
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {homework.questions.length}
                </div>
                <div className="text-sm text-muted-foreground">أسئلة</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">{homework.totalPoints}</div>
                <div className="text-sm text-muted-foreground">نقطة</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">{answeredCount}</div>
                <div className="text-sm text-muted-foreground">مجاب</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {Math.round(progress)}%
                </div>
                <div className="text-sm text-muted-foreground">التقدم</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              التعليمات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <SafeHtmlContent html={homework.instructions} />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        {homework.questions.map((question, index) => (
          <Card key={question.id} className="border-0 shadow-lg mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge>السؤال {index + 1}</Badge>
                    <Badge variant="outline">{question.points} نقاط</Badge>
                    <Badge variant="outline">
                      {question.type === "essay"
                        ? "مقال"
                        : question.type === "short-answer"
                          ? "إجابة قصيرة"
                          : "رفع ملف"}
                    </Badge>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
                    {question.question}
                  </h3>
                  {question.instructions && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {question.instructions}
                    </p>
                  )}
                  {question.minWords && (
                    <p className="text-sm text-muted-foreground mt-1">
                      عدد الكلمات: {question.minWords} - {question.maxWords}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {question.type === "file-upload" ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id={`file-${question.id}`}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleFileChange(question.id, e.target.files)
                      }
                    />
                    <label
                      htmlFor={`file-${question.id}`}
                      className="cursor-pointer"
                    >
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium mb-2">اضغط لرفع الملف</p>
                      <p className="text-sm text-muted-foreground">
                        PDF أو Word (حد أقصى 10 MB)
                      </p>
                    </label>
                  </div>
                  {files[question.id] && files[question.id].length > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium">
                          {files[question.id][0].name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(files[question.id][0].size / 1024 / 1024).toFixed(
                            2
                          )}{" "}
                          MB
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>
              ) : (
                <Textarea
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  placeholder="اكتب إجابتك هنا..."
                  className="min-h-[200px] text-lg"
                  rows={question.type === "essay" ? 12 : 6}
                />
              )}
              {answers[question.id] && (
                <div className="mt-2 text-sm text-muted-foreground">
                  عدد الكلمات:{" "}
                  {answers[question.id].split(/\s+/).filter((w) => w).length}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Progress */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">التقدم الإجمالي</span>
              <span className="text-muted-foreground">
                {answeredCount} من {totalQuestions}
              </span>
            </div>
            <Progress value={progress} size="lg" />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <Button
              onClick={handleSubmit}
              disabled={answeredCount !== totalQuestions || !canSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg py-6"
            >
              <Send className="w-5 h-5 ms-2" />
              تسليم الواجب
            </Button>
            {answeredCount !== totalQuestions && (
              <p className="text-sm text-center text-muted-foreground mt-4">
                يجب الإجابة على جميع الأسئلة قبل التسليم
              </p>
            )}
            {!canSubmit && (
              <p className="text-sm text-center text-red-600 mt-4">
                انتهى الموعد النهائي للتسليم
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
