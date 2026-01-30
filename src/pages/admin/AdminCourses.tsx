import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { courses } from "@/lib/api";
import type { Course, CreateCourseInput } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, BookOpen, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminCourses() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCoverUrl, setFormCoverUrl] = useState("");
  const [formPublished, setFormPublished] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    const data = await courses.getAll();
    setCourseList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormCoverUrl("");
    setFormPublished(false);
    setEditingCourse(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormDescription(course.description || "");
    setFormCoverUrl(course.cover_url || "");
    setFormPublished(course.is_published);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    setSaving(true);

    const courseData: CreateCourseInput = {
      title: formTitle,
      description: formDescription,
      cover_url: formCoverUrl,
      is_published: formPublished,
    };

    if (editingCourse) {
      const { error } = await courses.update(editingCourse.id, courseData);
      if (error) {
        toast.error("Erro ao atualizar curso");
      } else {
        toast.success("Curso atualizado!");
        setShowDialog(false);
        loadCourses();
      }
    } else {
      const { error } = await courses.create(courseData);
      if (error) {
        toast.error("Erro ao criar curso");
      } else {
        toast.success("Curso criado!");
        setShowDialog(false);
        loadCourses();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Tem certeza que deseja excluir este curso?")) return;

    const { error } = await courses.delete(courseId);
    if (error) {
      toast.error("Erro ao excluir curso");
    } else {
      toast.success("Curso excluído!");
      loadCourses();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Cursos</h1>
            <p className="text-muted-foreground">Gerencie os cursos da plataforma</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-coral" />
              </div>
            ) : courseList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum curso cadastrado</p>
                <Button className="mt-4" onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeiro curso
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseList.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {course.cover_url ? (
                            <img
                              src={course.cover_url}
                              alt={course.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{course.title}</p>
                            {course.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {course.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Publicado" : "Rascunho"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(course.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/admin/courses/${course.id}/lessons`}>
                            <Button variant="ghost" size="icon" title="Ver Aulas">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(course)}
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(course.id)}
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Editar Curso" : "Novo Curso"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Rotina do Sono Infantil"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva o conteúdo do curso..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>URL da Capa</Label>
                <Input
                  value={formCoverUrl}
                  onChange={(e) => setFormCoverUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Publicado</Label>
                  <p className="text-sm text-muted-foreground">
                    Curso visível para alunos
                  </p>
                </div>
                <Switch
                  checked={formPublished}
                  onCheckedChange={setFormPublished}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingCourse ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
