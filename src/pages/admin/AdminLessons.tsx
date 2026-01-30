import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { courses, lessons } from "@/lib/api";
import type { Course, Lesson, CreateLessonInput, ContentType } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, ArrowLeft, GripVertical, Video, FileText, Link as LinkIcon, Type } from "lucide-react";
import { toast } from "sonner";

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: Video,
  pdf: FileText,
  text: Type,
  link: LinkIcon,
};

const contentTypeLabels: Record<ContentType, string> = {
  video: "Vídeo",
  pdf: "PDF",
  text: "Texto",
  link: "Link",
};

export default function AdminLessons() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessonList, setLessonList] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formContentType, setFormContentType] = useState<ContentType>("video");
  const [formContentUrl, setFormContentUrl] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formIsFree, setFormIsFree] = useState(false);

  const loadData = async () => {
    if (!courseId) return;
    setLoading(true);
    
    const [courseData, lessonsData] = await Promise.all([
      courses.getById(courseId),
      lessons.getByCourse(courseId),
    ]);
    
    setCourse(courseData);
    setLessonList(lessonsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormContentType("video");
    setFormContentUrl("");
    setFormDuration("");
    setFormIsFree(false);
    setEditingLesson(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const openEditDialog = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormTitle(lesson.title);
    setFormDescription(lesson.description || "");
    setFormContentType(lesson.content_type);
    setFormContentUrl(lesson.content_url || "");
    setFormDuration(lesson.duration_minutes?.toString() || "");
    setFormIsFree(lesson.is_free);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !courseId) {
      toast.error("Título é obrigatório");
      return;
    }

    setSaving(true);

    const lessonData: CreateLessonInput = {
      course_id: courseId,
      title: formTitle,
      description: formDescription,
      content_type: formContentType,
      content_url: formContentUrl,
      duration_minutes: formDuration ? parseInt(formDuration) : undefined,
      order_index: editingLesson?.order_index ?? lessonList.length,
      is_free: formIsFree,
    };

    if (editingLesson) {
      const { error } = await lessons.update(editingLesson.id, lessonData);
      if (error) {
        toast.error("Erro ao atualizar aula");
      } else {
        toast.success("Aula atualizada!");
        setShowDialog(false);
        loadData();
      }
    } else {
      const { error } = await lessons.create(lessonData);
      if (error) {
        toast.error("Erro ao criar aula");
      } else {
        toast.success("Aula criada!");
        setShowDialog(false);
        loadData();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) return;

    const { error } = await lessons.delete(lessonId);
    if (error) {
      toast.error("Erro ao excluir aula");
    } else {
      toast.success("Aula excluída!");
      loadData();
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-coral" />
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Curso não encontrado</p>
          <Link to="/admin/courses">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para cursos
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/courses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold">{course.title}</h1>
            <p className="text-muted-foreground">Gerencie as aulas deste curso</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Aula
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aulas ({lessonList.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {lessonList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Nenhuma aula cadastrada</p>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeira aula
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {lessonList.map((lesson, index) => {
                  const Icon = contentTypeIcons[lesson.content_type];
                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="text-muted-foreground">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="w-8 h-8 rounded bg-background flex items-center justify-center">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {index + 1}.
                          </span>
                          <span className="font-medium">{lesson.title}</span>
                          {lesson.is_free && (
                            <Badge variant="secondary" className="text-xs">
                              Grátis
                            </Badge>
                          )}
                        </div>
                        {lesson.duration_minutes && (
                          <p className="text-sm text-muted-foreground">
                            {lesson.duration_minutes} min
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(lesson)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(lesson.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingLesson ? "Editar Aula" : "Nova Aula"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Introdução ao método"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descrição da aula..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Conteúdo</Label>
                  <Select
                    value={formContentType}
                    onValueChange={(v: ContentType) => setFormContentType(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duração (min)</Label>
                  <Input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="Ex: 15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL do Conteúdo</Label>
                <Input
                  value={formContentUrl}
                  onChange={(e) => setFormContentUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Aula Gratuita</Label>
                  <p className="text-sm text-muted-foreground">
                    Disponível sem matrícula
                  </p>
                </div>
                <Switch
                  checked={formIsFree}
                  onCheckedChange={setFormIsFree}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingLesson ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
