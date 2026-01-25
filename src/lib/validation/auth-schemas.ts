import { z } from "zod";

/**
 * Strong password validation regex
 * Requires: 8+ chars, uppercase, lowercase, number, special character
 */
const SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

/**
 * Login validation schema
 * Note: Uses relaxed password validation for backwards compatibility with existing accounts
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("بريد إلكتروني غير صالح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Registration validation schema
 * Uses strong password requirements for new accounts
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "الاسم مطلوب")
      .min(2, "الاسم يجب أن يكون حرفين على الأقل")
      .max(100, "الاسم طويل جداً"),
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("بريد إلكتروني غير صالح"),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .regex(/^[0-9]{11}$/, "رقم الهاتف يجب أن يكون 11 رقماً"),
    password: z
      .string()
      .min(1, "كلمة المرور مطلوبة")
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
      .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
      .regex(
        SPECIAL_CHARS_REGEX,
        "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)"
      ),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    grade: z.string().min(1, "الصف الدراسي مطلوب"),
    terms: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("بريد إلكتروني غير صالح"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password validation schema
 * Uses strong password requirements
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "رمز إعادة التعيين مطلوب"),
    password: z
      .string()
      .min(1, "كلمة المرور مطلوبة")
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
      .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
      .regex(
        SPECIAL_CHARS_REGEX,
        "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)"
      ),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * OTP verification schema
 */
export const otpSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  otp: z
    .string()
    .length(6, "رمز التحقق يجب أن يكون 6 أرقام")
    .regex(/^[0-9]{6}$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),
});

export type OTPInput = z.infer<typeof otpSchema>;

/**
 * Change password schema (for authenticated users)
 * Uses strong password requirements
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
      .string()
      .min(1, "كلمة المرور الجديدة مطلوبة")
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
      .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
      .regex(
        SPECIAL_CHARS_REGEX,
        "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)"
      ),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
