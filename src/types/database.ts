// Tipos do banco de dados Supabase - Rotina do Sono

export type UserRole = "admin" | "aluno";
export type UserPlan = "basic" | "premium";
export type ContentType = "video" | "pdf" | "text" | "link";
export type EnrollmentStatus = "active" | "expired" | "revoked";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentProvider = "manual" | "stripe" | "mercadopago";

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  plan: UserPlan;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  content_type: ContentType;
  content_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  access_expires_at: string | null;
  status: EnrollmentStatus;
  created_at: string;
  updated_at: string;
  // Joins
  course?: Course;
  profile?: Profile;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  provider: PaymentProvider;
  plan: UserPlan;
  amount: number;
  status: PaymentStatus;
  reference_id: string | null;
  days_to_add: number;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  profile?: Profile;
}

// Tipos para formulários
export interface CreateCourseInput {
  title: string;
  description?: string;
  cover_url?: string;
  is_published?: boolean;
}

export interface CreateLessonInput {
  course_id: string;
  title: string;
  description?: string;
  content_type: ContentType;
  content_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_free?: boolean;
}

export interface CreatePaymentInput {
  user_id: string;
  provider?: PaymentProvider;
  plan: UserPlan;
  amount: number;
  days_to_add?: number;
}

export interface UpdateProfileInput {
  name?: string;
  role?: UserRole;
  plan?: UserPlan;
  avatar_url?: string;
}

export interface CreateEnrollmentInput {
  user_id: string;
  course_id: string;
  access_expires_at?: string;
  status?: EnrollmentStatus;
}

// Tipos para estatísticas do admin
export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  pendingPayments: number;
  recentPayments: Payment[];
}

// Tipo para progresso do curso
export interface CourseWithProgress extends Course {
  lessons: Lesson[];
  enrollment?: Enrollment;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
}
