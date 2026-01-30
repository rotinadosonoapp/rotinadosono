import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useHasAccessToCourse } from "@/contexts/AuthContext";
import { getCourseWithProgress, progress } from "@/lib/api";
import type { CourseWithProgress, Lesson } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  ArrowLeft,
  Video,
  FileText,
  Type,
  Link as LinkIcon,
  Lock,
  Play,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import type { ContentType } from "@/types/database";

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: Video,
  pdf: FileText,
  text: Type,
  link: LinkIcon,
};

export default function DashboardCourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseWithProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { hasAccess, expiresAt } = useHasAccessToCourse(courseId || "");
  const isExpired = expiresAt ? isPast(expiresAt) : false;

  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;
      const courseData = await getCourseWithProgress(courseId);
      setCourse(courseData);

      if (courseData) {
        // Marca as aulas já concluídas
        const completedSet = new Set<string>();
        courseData.lessons.forEach((lesson) => {
          if (courseData.completedLessons > 0) {
            // Simplificação: considera as primeiras N aulas como concluídas
          }
        });
        setCompletedIds(completedSet);

        // Seleciona a primeira aula
        if (courseData.lessons.length > 0) {
          setSelectedLesson(courseData.lessons[0]);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [courseId]);

  const handleToggleComplete = async (lessonId: string, completed: boolean) => {
    if (completed) {
      const { error } = await progress.markComplete(lessonId);
      if (!error) {
        setCompletedIds((prev) => new Set([...prev, lessonId]));
        toast.success("Aula marcada como concluída!");
      }
    } else {
      const { error } = await progress.markIncomplete(lessonId);
      if (!error) {
        setCompletedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(lessonId);
          return newSet;
        });
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-coral" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Curso não encontrado</p>
          <Link to="/dashboard/courses">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Se acesso expirado, mostra aviso
  if (!hasAccess || isExpired) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-4">Acesso Expirado</h1>
          <p className="text-muted-foreground mb-6">
            Seu acesso a este curso expirou. Renove agora para continuar aprendendo.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard/courses">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <Link to="/dashboard/billing">
              <Button className="bg-coral hover:bg-coral/90">Renovar Acesso</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const progressPercent = course.totalLessons > 0
    ? Math.round((completedIds.size / course.totalLessons) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard/courses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold">{course.title}</h1>
            {expiresAt && (
              <p className="text-sm text-muted-foreground">
                Acesso válido até {format(expiresAt, "dd/MM/yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Seu Progresso</span>
              <span className="text-sm text-muted-foreground">
                {completedIds.size} de {course.totalLessons} aulas
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <p className="text-right text-sm text-muted-foreground mt-1">
              {progressPercent}% concluído
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lesson List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Aulas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {course.lessons.map((lesson, index) => {
                  const Icon = contentTypeIcons[lesson.content_type];
                  const isCompleted = completedIds.has(lesson.id);
                  const isSelected = selectedLesson?.id === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors ${
                        isSelected ? "bg-muted" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? "bg-green-100 text-green-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm truncate ${
                            isCompleted ? "text-muted-foreground" : ""
                          }`}
                        >
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon className="w-3 h-3" />
                          {lesson.duration_minutes && <span>{lesson.duration_minutes} min</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Lesson Content */}
          <Card className="lg:col-span-2">
            {selectedLesson ? (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedLesson.title}</CardTitle>
                      {selectedLesson.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedLesson.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="completed"
                        checked={completedIds.has(selectedLesson.id)}
                        onCheckedChange={(checked) =>
                          handleToggleComplete(selectedLesson.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor="completed"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Concluída
                      </label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedLesson.content_url ? (
                    <div>
                      {selectedLesson.content_type === "video" && (
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <iframe
                            src={selectedLesson.content_url}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}

                      {selectedLesson.content_type === "pdf" && (
                        <div className="text-center py-8">
                          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <a
                            href={selectedLesson.content_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Abrir PDF
                            </Button>
                          </a>
                        </div>
                      )}

                      {selectedLesson.content_type === "link" && (
                        <div className="text-center py-8">
                          <LinkIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <a
                            href={selectedLesson.content_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Acessar Conteúdo
                            </Button>
                          </a>
                        </div>
                      )}

                      {selectedLesson.content_type === "text" && (
                        <div className="prose prose-sm max-w-none">
                          <p>{selectedLesson.content_url}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Conteúdo não disponível</p>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Selecione uma aula</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
