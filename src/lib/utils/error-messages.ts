/**
 * Centralized Error Messages and Error Handling Utilities
 */

export const ERROR_MESSAGES = {
  // Network Errors
  NETWORK_ERROR: "حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت",
  TIMEOUT_ERROR: "انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى",
  SERVER_ERROR: "حدث خطأ في الخادم. يرجى المحاولة لاحقاً",

  // Authentication Errors
  INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  SESSION_EXPIRED: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً",
  UNAUTHORIZED: "غير مصرح لك بالوصول لهذه الصفحة",
  ACCOUNT_LOCKED: "تم قفل الحساب مؤقتاً. يرجى المحاولة بعد قليل",
  EMAIL_NOT_VERIFIED: "يرجى تأكيد بريدك الإلكتروني أولاً",

  // Registration Errors
  EMAIL_EXISTS: "البريد الإلكتروني مسجل مسبقاً",
  PHONE_EXISTS: "رقم الهاتف مسجل مسبقاً",
  REGISTRATION_FAILED: "فشل التسجيل. يرجى المحاولة مرة أخرى",

  // Form Validation Errors
  REQUIRED_FIELD: "هذا الحقل مطلوب",
  INVALID_EMAIL: "يرجى إدخال بريد إلكتروني صالح",
  INVALID_PHONE: "يرجى إدخال رقم هاتف صالح",
  PASSWORD_TOO_SHORT: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
  PASSWORD_MISMATCH: "كلمتا المرور غير متطابقتين",
  INVALID_OTP: "رمز التحقق غير صحيح",
  OTP_EXPIRED: "انتهت صلاحية رمز التحقق",

  // Quiz/Lesson Errors
  QUIZ_SUBMIT_FAILED: "فشل إرسال الاختبار. يرجى المحاولة مرة أخرى",
  LESSON_LOAD_FAILED: "فشل تحميل الدرس. يرجى المحاولة مرة أخرى",
  VIDEO_LOAD_FAILED: "فشل تحميل الفيديو. يرجى المحاولة مرة أخرى",
  PROGRESS_SAVE_FAILED: "فشل حفظ التقدم. سيتم المحاولة تلقائياً",

  // Payment Errors
  PAYMENT_FAILED: "فشلت عملية الدفع. يرجى المحاولة مرة أخرى",
  INVALID_CARD: "بيانات البطاقة غير صحيحة",
  INSUFFICIENT_FUNDS: "رصيد غير كافٍ",

  // General Errors
  UNKNOWN_ERROR: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
  RATE_LIMITED: "تجاوزت الحد المسموح من الطلبات. يرجى الانتظار قليلاً",
  MAINTENANCE: "الخدمة قيد الصيانة. يرجى المحاولة لاحقاً",

  // Success Messages
  LOGIN_SUCCESS: "تم تسجيل الدخول بنجاح",
  LOGOUT_SUCCESS: "تم تسجيل الخروج بنجاح",
  REGISTER_SUCCESS: "تم إنشاء الحساب بنجاح",
  PASSWORD_RESET_SENT: "تم إرسال رابط إعادة تعيين كلمة المرور",
  PASSWORD_RESET_SUCCESS: "تم تغيير كلمة المرور بنجاح",
  PROFILE_UPDATED: "تم تحديث الملف الشخصي بنجاح",
  QUIZ_SUBMITTED: "تم إرسال الاختبار بنجاح",
  LESSON_COMPLETED: "تم إكمال الدرس بنجاح",
  PROGRESS_SAVED: "تم حفظ التقدم",
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;

export interface APIError {
  code?: string;
  message?: string;
  status?: number;
  field?: string;
}

export type ErrorSeverity = "error" | "warning" | "info";

export const FIELD_ERROR_MAP: Record<string, string> = {
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  name: "الاسم",
  phone: "رقم الهاتف",
  grade: "الصف الدراسي",
  terms: "الموافقة على الشروط",
  otp: "رمز التحقق",
};

export function getLocalizedFieldName(field: string): string {
  return FIELD_ERROR_MAP[field] || field;
}

export function parseAPIError(error: unknown): string {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (typeof error === "object" && error !== null) {
    const apiError = error as APIError;

    if (apiError.code && apiError.code in ERROR_MESSAGES) {
      return ERROR_MESSAGES[apiError.code as ErrorCode];
    }

    if (apiError.status) {
      if (apiError.status === 401 || apiError.status === 403) {
        return ERROR_MESSAGES.UNAUTHORIZED;
      }
      if (apiError.status === 408) return ERROR_MESSAGES.TIMEOUT_ERROR;
      if (apiError.status === 429) return ERROR_MESSAGES.RATE_LIMITED;
      if (apiError.status >= 500) return ERROR_MESSAGES.SERVER_ERROR;
      if (apiError.message) return apiError.message;
    }

    if (apiError.message) return apiError.message;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

export function getErrorSeverity(status?: number): ErrorSeverity {
  if (!status) return "error";
  if (status >= 500) return "error";
  if (status === 429) return "warning";
  return "error";
}

export function isRetriableError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }

  if (typeof error === "object" && error !== null) {
    const apiError = error as APIError;
    if (apiError.status) {
      return (
        apiError.status >= 500 ||
        apiError.status === 429 ||
        apiError.status === 408
      );
    }
  }

  return false;
}
