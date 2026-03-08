import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getMyCoursesWithProgress, enrollments } from "@/lib/api";
import type { CourseWithProgress, Enrollment } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardHome() {
  const { profile, displayName } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearestExpiry, setNearestExpiry] = useState<Date | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const coursesData = await getMyCoursesWithProgress();
      setCourses(coursesData);

      // Encontra a data de expiração mais próxima
      const expiryDates = coursesData
        .filter((c) => c.enrollment?.access_expires_at)
        .map((c) => new Date(c.enrollment!.access_expires_at!))
        .filter((d) => !isPast(d));

      if (expiryDates.length > 0) {
        setNearestExpiry(new Date(Math.min(...expiryDates.map((d) => d.getTime()))));
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const daysUntilExpiry = nearestExpiry ? differenceInDays(nearestExpiry, new Date()) : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-coral" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-display font-bold">
            Olá, {displayName.split(" ")[0] || "Aluno"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue de onde parou e aprenda no seu ritmo.
          </p>
        </div>

        {/* Expiry Warning */}
        {isExpiringSoon && nearestExpiry && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertTriangle className="w-8 h-8 text-orange-500 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-orange-800">
                  Seu acesso expira em {daysUntilExpiry} dia{daysUntilExpiry !== 1 ? "s" : ""}!
                </p>
                <p className="text-sm text-orange-700">
                  Renove agora para continuar tendo acesso a todos os cursos.
                </p>
              </div>
              <Link to="/dashboard/billing">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Renovar
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Meus Cursos</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">cursos disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.plan === "premium" ? "Premium" : "Básico"}
              </div>
              <p className="text-xs text-muted-foreground">
                {nearestExpiry
                  ? `Válido até ${format(nearestExpiry, "dd/MM/yyyy", { locale: ptBR })}`
                  : "Sem data de expiração"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.length > 0
                  ? Math.round(
                      courses.reduce((acc, c) => acc + c.progressPercent, 0) / courses.length
                    )
                  : 0}
                %
              </div>
              <Progress
                value={
                  courses.length > 0
                    ? courses.reduce((acc, c) => acc + c.progressPercent, 0) / courses.length
                    : 0
                }
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Meus Cursos</h2>
            <Link to="/dashboard/courses">
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {courses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem acesso a nenhum curso.
                </p>
                <Link to="/#comprar">
                  <Button>Ver Cursos Disponíveis</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <Link key={course.id} to={`/dashboard/courses/${course.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {course.cover_url ? (
                      <img
                        src={course.cover_url}
                        alt={course.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-muted flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{course.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>
                          {course.completedLessons}/{course.totalLessons} aulas
                        </span>
                        <span>{course.progressPercent}%</span>
                      </div>
                      <Progress value={course.progressPercent} className="h-2" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
