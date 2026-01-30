import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { payments, enrollments } from "@/lib/api";
import type { Payment, Enrollment } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { format, isPast, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardBilling() {
  const { profile } = useAuth();
  const [paymentList, setPaymentList] = useState<Payment[]>([]);
  const [enrollmentList, setEnrollmentList] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [paymentsData, enrollmentsData] = await Promise.all([
        payments.getMyPayments(),
        enrollments.getMyEnrollments(),
      ]);
      setPaymentList(paymentsData);
      setEnrollmentList(enrollmentsData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Encontra a data de expiração mais próxima
  const activeEnrollments = enrollmentList.filter(
    (e) => e.status === "active" && e.access_expires_at
  );
  const nearestExpiry = activeEnrollments.length > 0
    ? new Date(
        Math.min(
          ...activeEnrollments.map((e) => new Date(e.access_expires_at!).getTime())
        )
      )
    : null;

  const daysRemaining = nearestExpiry ? differenceInDays(nearestExpiry, new Date()) : null;
  const isExpired = nearestExpiry ? isPast(nearestExpiry) : false;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Pago
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Falhou
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Pagamentos</h1>
          <p className="text-muted-foreground">
            Gerencie seu plano e histórico de pagamentos
          </p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seu Plano Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold">
                    Plano {profile?.plan === "premium" ? "Premium" : "Básico"}
                  </span>
                  <Badge variant={profile?.plan === "premium" ? "default" : "secondary"}>
                    {profile?.plan === "premium" ? "Premium" : "Básico"}
                  </Badge>
                </div>
                {nearestExpiry && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {isExpired ? (
                      <span className="text-red-500 font-medium">
                        Acesso expirado em {format(nearestExpiry, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Válido até {format(nearestExpiry, "dd/MM/yyyy", { locale: ptBR })}
                        {daysRemaining !== null && daysRemaining <= 30 && (
                          <span className="text-orange-500 ml-2">
                            ({daysRemaining} dias restantes)
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div>
                {/* TODO: Integrar com gateway de pagamento */}
                <Button variant="outline" disabled>
                  Renovar / Upgrade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Histórico de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentList.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum pagamento registrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentList.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium">
                          Plano {payment.plan === "premium" ? "Premium" : "Básico"}
                        </span>
                        {getStatusBadge(payment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(payment.created_at), "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                        {payment.days_to_add && ` • ${payment.days_to_add} dias de acesso`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        R$ {payment.amount.toFixed(2).replace(".", ",")}
                      </p>
                      {payment.paid_at && (
                        <p className="text-xs text-muted-foreground">
                          Pago em{" "}
                          {format(new Date(payment.paid_at), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              Para renovar ou fazer upgrade do seu plano, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@rotinadosono.com.br" className="text-coral hover:underline">
                contato@rotinadosono.com.br
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
