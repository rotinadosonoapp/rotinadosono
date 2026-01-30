import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { getMyCoursesWithProgress } from "@/lib/api";
import type { CourseWithProgress } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Lock } from "lucide-react";
import { isPast } from "date-fns";

export default function DashboardCourses() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const coursesData = await getMyCoursesWithProgress();
      setCourses(coursesData);
      setLoading(false);
    };

    loadData();
  }, []);

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
        <div>
          <h1 className="text-2xl font-display font-bold">Meus Cursos</h1>
          <p className="text-muted-foreground">
            Todos os cursos disponíveis para você
          </p>
        </div>

        {courses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum curso disponível</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Você ainda não tem acesso a nenhum curso. Adquira um plano para começar a aprender.
              </p>
              <Link to="/#comprar">
                <Button>Ver Planos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const isExpired = course.enrollment?.access_expires_at
                ? isPast(new Date(course.enrollment.access_expires_at))
                : false;

              return (
                <Card
                  key={course.id}
                  className={`overflow-hidden ${isExpired ? "opacity-75" : ""}`}
                >
                  <div className="relative">
                    {course.cover_url ? (
                      <img
                        src={course.cover_url}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-muted flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    {isExpired && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">Acesso Expirado</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                      {course.progressPercent === 100 && (
                        <Badge className="bg-green-100 text-green-700 shrink-0 ml-2">
                          Concluído
                        </Badge>
                      )}
                    </div>

                    {course.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {course.completedLessons} de {course.totalLessons} aulas
                        </span>
                        <span className="font-medium">{course.progressPercent}%</span>
                      </div>
                      <Progress value={course.progressPercent} className="h-2" />
                    </div>

                    <div className="mt-4">
                      {isExpired ? (
                        <Link to="/dashboard/billing" className="w-full">
                          <Button variant="outline" className="w-full">
                            Renovar Acesso
                          </Button>
                        </Link>
                      ) : (
                        <Link to={`/dashboard/courses/${course.id}`} className="w-full">
                          <Button className="w-full bg-coral hover:bg-coral/90">
                            {course.progressPercent > 0 ? "Continuar" : "Começar"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
