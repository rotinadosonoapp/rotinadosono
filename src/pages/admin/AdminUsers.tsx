import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { profiles, enrollments } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Profile, Enrollment } from "@/types/database";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, Key, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const openEditDialog = (user: Profile) => {
    setEditUser(user);
    setFormName(user.name || "");
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
            <h1 className="text-2xl font-display font-bold">Usuários</h1>
            <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
          </div>
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || "-"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? "Admin" : "Aluno"}
                        </Badge>
                      </TableCell>
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
                  ))}
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
      </div>
    </AdminLayout>
  );
}
