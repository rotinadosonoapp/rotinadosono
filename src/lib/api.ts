// API Services - Rotina do Sono
import { supabase } from "./supabase";
import type {
  Profile,
  Course,
  Lesson,
  Enrollment,
  LessonProgress,
  Payment,
  CreateCourseInput,
  CreateLessonInput,
  CreatePaymentInput,
  UpdateProfileInput,
  CreateEnrollmentInput,
  AdminStats,
  CourseWithProgress,
} from "@/types/database";

// ============================================
// AUTH
// ============================================
export const auth = {
  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },
};

// ============================================
// PROFILES
// ============================================
export const profiles = {
  async getMyProfile(): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .single();
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) return null;
    return data;
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  },

  async updateProfile(userId: string, updates: UpdateProfileInput) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  },

  async deleteProfile(userId: string) {
    // Deleta o usuário do auth (cascata deleta o profile)
    const { error } = await supabase.auth.admin.deleteUser(userId);
    return { error };
  },
};

// ============================================
// COURSES
// ============================================
export const courses = {
  async getAll(publishedOnly = false): Promise<Course[]> {
    let query = supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (publishedOnly) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;
    if (error) return [];
    return data || [];
  },

  async getById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  },

  async create(input: CreateCourseInput) {
    const { data, error } = await supabase
      .from("courses")
      .insert(input)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, updates: Partial<CreateCourseInput>) {
    const { data, error } = await supabase
      .from("courses")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    return { error };
  },
};

// ============================================
// LESSONS
// ============================================
export const lessons = {
  async getByCourse(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });
    if (error) return [];
    return data || [];
  },

  async getById(id: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  },

  async create(input: CreateLessonInput) {
    const { data, error } = await supabase
      .from("lessons")
      .insert(input)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, updates: Partial<CreateLessonInput>) {
    const { data, error } = await supabase
      .from("lessons")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    return { error };
  },

  async reorder(lessonIds: string[]) {
    const updates = lessonIds.map((id, index) => ({
      id,
      order_index: index,
    }));
    
    for (const update of updates) {
      await supabase
        .from("lessons")
        .update({ order_index: update.order_index })
        .eq("id", update.id);
    }
  },
};

// ============================================
// ENROLLMENTS
// ============================================
export const enrollments = {
  async getMyEnrollments(): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, course:courses(*)")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  },

  async getAll(): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, course:courses(*), profile:profiles(*)")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  },

  async getByUser(userId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, course:courses(*)")
      .eq("user_id", userId);
    if (error) return [];
    return data || [];
  },

  async create(input: CreateEnrollmentInput) {
    const { data, error } = await supabase
      .from("enrollments")
      .insert(input)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, updates: Partial<CreateEnrollmentInput>) {
    const { data, error } = await supabase
      .from("enrollments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    return { error };
  },

  async extendAccess(enrollmentId: string, days: number) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("access_expires_at")
      .eq("id", enrollmentId)
      .single();

    const currentExpiry = enrollment?.access_expires_at
      ? new Date(enrollment.access_expires_at)
      : new Date();
    
    const newExpiry = new Date(Math.max(currentExpiry.getTime(), Date.now()));
    newExpiry.setDate(newExpiry.getDate() + days);

    const { data, error } = await supabase
      .from("enrollments")
      .update({
        access_expires_at: newExpiry.toISOString(),
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", enrollmentId)
      .select()
      .single();

    return { data, error };
  },
};

// ============================================
// LESSON PROGRESS
// ============================================
export const progress = {
  async getMyProgress(): Promise<LessonProgress[]> {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("*");
    if (error) return [];
    return data || [];
  },

  async markComplete(lessonId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: "Not authenticated" } };

    const { data, error } = await supabase
      .from("lesson_progress")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },

  async markIncomplete(lessonId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: "Not authenticated" } };

    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);
    return { error };
  },
};

// ============================================
// PAYMENTS
// ============================================
export const payments = {
  async getMyPayments(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  },

  async getAll(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from("payments")
      .select("*, profile:profiles(*)")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  },

  async create(input: CreatePaymentInput) {
    const { data, error } = await supabase
      .from("payments")
      .insert(input)
      .select()
      .single();
    return { data, error };
  },

  async markAsPaid(paymentId: string) {
    // Usa a função do banco que processa o pagamento
    const { error } = await supabase.rpc("process_payment", {
      payment_id: paymentId,
    });
    return { error };
  },

  async update(id: string, updates: Partial<Payment>) {
    const { data, error } = await supabase
      .from("payments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },
};

// ============================================
// ADMIN STATS
// ============================================
export const admin = {
  async getStats(): Promise<AdminStats> {
    const [
      { count: totalUsers },
      { count: totalCourses },
      { count: totalEnrollments },
      { count: pendingPayments },
      { data: recentPayments },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("enrollments").select("*", { count: "exact", head: true }),
      supabase
        .from("payments")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("payments")
        .select("*, profile:profiles(*)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    return {
      totalUsers: totalUsers || 0,
      totalCourses: totalCourses || 0,
      totalEnrollments: totalEnrollments || 0,
      pendingPayments: pendingPayments || 0,
      recentPayments: recentPayments || [],
    };
  },

  async createUserWithProfile(email: string, password: string, name: string, role: "admin" | "aluno" = "aluno") {
    // Cria usuário via auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) return { data: null, error: authError };

    // Atualiza role se for admin
    if (role === "admin" && authData.user) {
      await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", authData.user.id);
    }

    return { data: authData, error: null };
  },
};

// ============================================
// HELPER: Curso com progresso
// ============================================
export async function getCourseWithProgress(courseId: string): Promise<CourseWithProgress | null> {
  const [course, courseLessons, myProgress, myEnrollments] = await Promise.all([
    courses.getById(courseId),
    lessons.getByCourse(courseId),
    progress.getMyProgress(),
    enrollments.getMyEnrollments(),
  ]);

  if (!course) return null;

  const enrollment = myEnrollments.find((e) => e.course_id === courseId);
  const completedLessonIds = new Set(myProgress.map((p) => p.lesson_id));
  const completedLessons = courseLessons.filter((l) => completedLessonIds.has(l.id)).length;

  return {
    ...course,
    lessons: courseLessons,
    enrollment,
    completedLessons,
    totalLessons: courseLessons.length,
    progressPercent: courseLessons.length > 0
      ? Math.round((completedLessons / courseLessons.length) * 100)
      : 0,
  };
}

export async function getMyCoursesWithProgress(): Promise<CourseWithProgress[]> {
  const [myEnrollments, myProgress, allCourses] = await Promise.all([
    enrollments.getMyEnrollments(),
    progress.getMyProgress(),
    courses.getAll(true),
  ]);

  const completedLessonIds = new Set(myProgress.map((p) => p.lesson_id));

  const result: CourseWithProgress[] = [];

  for (const enrollment of myEnrollments) {
    const course = allCourses.find((c) => c.id === enrollment.course_id);
    if (!course) continue;

    const courseLessons = await lessons.getByCourse(course.id);
    const completedLessons = courseLessons.filter((l) => completedLessonIds.has(l.id)).length;

    result.push({
      ...course,
      lessons: courseLessons,
      enrollment,
      completedLessons,
      totalLessons: courseLessons.length,
      progressPercent: courseLessons.length > 0
        ? Math.round((completedLessons / courseLessons.length) * 100)
        : 0,
    });
  }

  return result;
}
