import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { payments, profiles } from "@/lib/api";
import type { Payment, Profile, CreatePaymentInput } from "@/types/database";
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
import { Loader2, Plus, Check, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminPayments() {
  const [paymentList, setPaymentList] = useState<Payment[]>([]);
  const [userList, setUserList] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formUserId, setFormUserId] = useState("");
  const [formPlan, setFormPlan] = useState<"basic" | "premium">("basic");
  const [formAmount, setFormAmount] = useState("");
  const [formDays, setFormDays] = useState("30");

  const loadData = async () => {
    setLoading(true);
    const [paymentsData, usersData] = await Promise.all([
      payments.getAll(),
      profiles.getAllProfiles(),
    ]);
    setPaymentList(paymentsData);
    setUserList(usersData.filter(u => u.role !== "admin"));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormUserId("");
    setFormPlan("basic");
    setFormAmount("");
    setFormDays("30");
  };

  const handleCreatePayment = async () => {
    if (!formUserId || !formAmount) {
      toast.error("Preencha todos os campos");
      return;
    }

    setSaving(true);

    const paymentData: CreatePaymentInput = {
      user_id: formUserId,
      plan: formPlan,
      amount: parseFloat(formAmount),
      days_to_add: parseInt(formDays),
    };

    const { error } = await payments.create(paymentData);

    if (error) {
      toast.error("Erro ao criar pagamento");
    } else {
      toast.success("Pagamento criado!");
      setShowDialog(false);
      resetForm();
      loadData();
    }

    setSaving(false);
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    const { error } = await payments.markAsPaid(paymentId);

    if (error) {
      toast.error("Erro ao processar pagamento: " + error.message);
    } else {
      toast.success("Pagamento aprovado e acesso liberado!");
      loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Pago</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pendente</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Falhou</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Reembolsado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Pagamentos</h1>
            <p className="text-muted-foreground">Gerencie os pagamentos dos alunos</p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Pagamento
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-coral" />
              </div>
            ) : paymentList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum pagamento registrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Dias</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentList.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {payment.profile?.name || "Sem nome"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payment.profile?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={payment.plan === "premium" ? "default" : "outline"}>
                          {payment.plan === "premium" ? "Premium" : "Básico"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        R$ {payment.amount.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>{payment.days_to_add} dias</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {format(new Date(payment.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(payment.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Payment Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Pagamento</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Usuário *</Label>
                <Select value={formUserId} onValueChange={setFormUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {userList.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plano</Label>
                  <Select
                    value={formPlan}
                    onValueChange={(v: "basic" | "premium") => setFormPlan(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Valor (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="197.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dias de Acesso</Label>
                <Select value={formDays} onValueChange={setFormDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                    <SelectItem value="180">180 dias</SelectItem>
                    <SelectItem value="365">1 ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                O pagamento será criado como "Pendente". Clique em "Aprovar" para liberar o acesso.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePayment} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Criar Pagamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
