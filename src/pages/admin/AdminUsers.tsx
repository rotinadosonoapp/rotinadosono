import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { profiles, enrollments, courses, admin } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Profile, Enrollment, Course } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Pencil, Key, Calendar, BookOpen, XCircle, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coursesDialogUser, setCoursesDialogUser] = useState<Profile | null>(null);
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [grantCourseId, setGrantCourseId] = useState("");
  const [coursesDialogLoading, setCoursesDialogLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createCourseIds, setCreateCourseIds] = useState<string[]>([]);
  const [allCoursesForCreate, setAllCoursesForCreate] = useState<Course[]>([]);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState<"admin" | "aluno">("aluno");
  const [formPlan, setFormPlan] = useState<"basic" | "premium">("basic");

  const loadUsers = async () => {
    setLoading(true);
    const data = await profiles.getAllProfiles();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const students = users.filter((u) => u.role === "aluno");
  const filteredStudents = search.trim()
    ? students.filter(
        (u) =>
          (u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()))
      )
    : students;

  const openCoursesDialog = async (user: Profile) => {
    setCoursesDialogUser(user);
    setGrantCourseId("");
    setCoursesDialogLoading(true);
    const [enrolls, coursesList] = await Promise.all([
      enrollments.getByUser(user.id),
      courses.getAll(),
    ]);
    setUserEnrollments(enrolls);
    setAllCourses(coursesList);
    setCoursesDialogLoading(false);
  };

  const handleGrantCourse = async () => {
    if (!coursesDialogUser || !grantCourseId) return;
    setSaving(true);
    const { error } = await enrollments.grantCourse(coursesDialogUser.id, grantCourseId);
    if (error) {
      toast.error("Erro ao liberar curso");
    } else {
      toast.success("Curso liberado!");
      const enrolls = await enrollments.getByUser(coursesDialogUser.id);
      setUserEnrollments(enrolls);
      setGrantCourseId("");
    }
    setSaving(false);
  };

  const openCreateDialog = async () => {
    setShowCreateDialog(true);
    setCreateName("");
    setCreateEmail("");
    setCreateCourseIds([]);
    const list = await courses.getAll();
    setAllCoursesForCreate(list);
  };

  const handleCreateStudent = async () => {
    if (!createName.trim() || !createEmail.trim()) {
      toast.error("Nome e e-mail são obrigatórios");
      return;
    }
    setCreating(true);
    try {
      await admin.createStudentViaApi(createName.trim(), createEmail.trim(), createCourseIds);
      toast.success("Aluno cadastrado! Convite enviado por e-mail.");
      setShowCreateDialog(false);
      loadUsers();
    } catch (e) {
      toast.error((e as Error).message);
    }
    setCreating(false);
  };

  const toggleCreateCourse = (id: string) => {
    setCreateCourseIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleRevokeCourse = async (enrollmentId: string) => {
    if (!coursesDialogUser) return;
    setSaving(true);
    const { error } = await enrollments.revokeCourse(enrollmentId);
    if (error) {
      toast.error("Erro ao revogar curso");
    } else {
      toast.success("Curso revogado");
      const enrolls = await enrollments.getByUser(coursesDialogUser.id);
      setUserEnrollments(enrolls);
    }
    setSaving(false);
  };

  const openEditDialog = (user: Profile) => {
    setEditUser(user);
    setFormName(user.name || user.full_name || "");
    setFormRole(user.role);
    setFormPlan(user.plan);
    setShowEditDialog(true);
  };

  const handleSaveUser = async () => {
    if (!editUser) return;
    setSaving(true);

    const { error } = await profiles.updateProfile(editUser.id, {
      name: formName,
      role: formRole,
      plan: formPlan,
    });

    if (error) {
      toast.error("Erro ao salvar usuário");
    } else {
      toast.success("Usuário atualizado!");
      setShowEditDialog(false);
      loadUsers();
    }
    setSaving(false);
  };

  const handleExtendAccess = async (userId: string, days: number) => {
    // Busca as matrículas do usuário
    const userEnrollments = await enrollments.getByUser(userId);
    
    if (userEnrollments.length === 0) {
      toast.error("Usuário não tem matrículas ativas");
      return;
    }

    // Estende acesso em todas as matrículas
    for (const enrollment of userEnrollments) {
      await enrollments.extendAccess(enrollment.id, days);
    }

    toast.success(`Acesso estendido em ${days} dias!`);
  };

  const handleResetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error("Erro ao enviar e-mail de reset");
    } else {
      toast.success("E-mail de reset enviado!");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Alunos</h1>
            <p className="text-muted-foreground">Gerencie os alunos e cursos liberados</p>
          </div>
          <Button onClick={openCreateDialog}>
            <UserPlus className="w-4 h-4 mr-2" />
            Cadastrar aluno
          </Button>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-coral" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {search.trim() ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
                      </TableCell>
                    </TableRow>
                  ) : (
                  filteredStudents.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || user.full_name || "-"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.plan === "premium" ? "default" : "outline"}>
                          {user.plan === "premium" ? "Premium" : "Básico"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openCoursesDialog(user)}
                            title="Cursos liberados"
                          >
                            <BookOpen className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(user)}
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleResetPassword(user.email || "")}
                            title="Resetar Senha"
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExtendAccess(user.id, 30)}
                            title="+30 dias"
                          >
                            <Calendar className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={formRole} onValueChange={(v: "admin" | "aluno") => setFormRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Plano</Label>
                <Select value={formPlan} onValueChange={(v: "basic" | "premium") => setFormPlan(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick access buttons */}
              <div className="space-y-2">
                <Label>Estender Acesso</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editUser && handleExtendAccess(editUser.id, 30)}
                  >
                    +30 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editUser && handleExtendAccess(editUser.id, 90)}
                  >
                    +90 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editUser && handleExtendAccess(editUser.id, 365)}
                  >
                    +1 ano
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveUser} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cadastrar Aluno Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar aluno</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Cursos</Label>
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2">
                  {allCoursesForCreate.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createCourseIds.includes(c.id)}
                        onChange={() => toggleCreateCourse(c.id)}
                      />
                      <span className="text-sm">{c.title}</span>
                    </label>
                  ))}
                  {allCoursesForCreate.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhum curso cadastrado</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateStudent} disabled={creating}>
                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Cadastrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cursos do Aluno Dialog */}
        <Dialog open={!!coursesDialogUser} onOpenChange={(o) => !o && setCoursesDialogUser(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Cursos de {coursesDialogUser?.name || coursesDialogUser?.full_name || coursesDialogUser?.email}
              </DialogTitle>
            </DialogHeader>

            {coursesDialogLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-coral" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Cursos liberados</Label>
                  {userEnrollments.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">Nenhum curso liberado</p>
                  ) : (
                    <div className="space-y-2">
                      {userEnrollments.map((e) => (
                        <div
                          key={e.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-medium">{(e.course as Course)?.title || "Curso"}</p>
                            <p className="text-xs text-muted-foreground">
                              {e.status === "active" ? "Ativo" : e.status}
                              {e.access_expires_at &&
                                ` • Expira em ${format(new Date(e.access_expires_at), "dd/MM/yyyy", { locale: ptBR })}`}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeCourse(e.id)}
                            disabled={saving}
                            title="Revogar curso"
                          >
                            <XCircle className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="mb-2 block">Liberar novo curso</Label>
                  <div className="flex gap-2">
                    <Select value={grantCourseId} onValueChange={setGrantCourseId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione um curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCourses
                          .filter(
                            (c) =>
                              !userEnrollments.some(
                                (e) => e.course_id === c.id && e.status === "active"
                              )
                          )
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleGrantCourse}
                      disabled={!grantCourseId || saving}
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Liberar"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
