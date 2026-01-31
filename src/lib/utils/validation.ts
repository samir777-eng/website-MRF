/**
 * Form Validation Utilities
 * Real-time validation functions for form fields
 */

// Email validation
export function validateEmail(email: string): string | undefined {
  if (!email) {
    return "البريد الإلكتروني مطلوب";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "البريد الإلكتروني غير صحيح";
  }

  return undefined;
}

// Phone validation (Egyptian format)
export function validatePhone(phone: string): string | undefined {
  if (!phone) {
    return "رقم الهاتف مطلوب";
  }

  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, "");

  // Egyptian phone: 01xxxxxxxxx (11 digits starting with 01)
  const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return "رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01 ويتكون من 11 رقم)";
  }

  return undefined;
}

// Email or Phone validation
export function validateEmailOrPhone(value: string): string | undefined {
  if (!value) {
    return "البريد الإلكتروني أو رقم الهاتف مطلوب";
  }

  // Check if it looks like an email
  if (value.includes("@")) {
    return validateEmail(value);
  }

  // Otherwise treat as phone
  return validatePhone(value);
}

// Password validation - Strong requirements
export function validatePassword(password: string): string | undefined {
  if (!password) {
    return "كلمة المرور مطلوبة";
  }

  if (password.length < 8) {
    return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  }

  if (!/[A-Z]/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل";
  }

  if (!/[a-z]/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل";
  }

  if (!/[0-9]/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)";
  }

  return undefined;
}

// Simple password validation for login (existing accounts may have old passwords)
export function validateLoginPassword(password: string): string | undefined {
  if (!password) {
    return "كلمة المرور مطلوبة";
  }

  if (password.length < 6) {
    return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  }

  return undefined;
}

// Password strength validation (stricter)
export function validatePasswordStrength(password: string): string | undefined {
  if (!password) {
    return "كلمة المرور مطلوبة";
  }

  if (password.length < 8) {
    return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  }

  if (!/[a-z]/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل";
  }

  if (!/[A-Z]/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل";
  }

  if (!/[0-9]/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
  }

  return undefined;
}

// Confirm password validation
export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) {
    return "تأكيد كلمة المرور مطلوب";
  }

  if (password !== confirmPassword) {
    return "كلمة المرور غير متطابقة";
  }

  return undefined;
}

// Full name validation
export function validateFullName(name: string): string | undefined {
  if (!name) {
    return "الاسم الكامل مطلوب";
  }

  if (name.trim().length < 3) {
    return "الاسم يجب أن يكون 3 أحرف على الأقل";
  }

  // Check if name has at least 2 words (first and last name)
  const words = name.trim().split(/\s+/);
  if (words.length < 2) {
    return "يرجى إدخال الاسم الأول والأخير";
  }

  return undefined;
}

// Username validation
export function validateUsername(username: string): string | undefined {
  if (!username) {
    return "اسم المستخدم مطلوب";
  }

  if (username.length < 3) {
    return "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
  }

  if (username.length > 20) {
    return "اسم المستخدم يجب أن يكون 20 حرف كحد أقصى";
  }

  // Only letters, numbers, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return "اسم المستخدم يجب أن يحتوي على حروف وأرقام فقط";
  }

  return undefined;
}

// Required field validation
export function validateRequired(
  value: string,
  fieldName: string = "هذا الحقل",
): string | undefined {
  if (!value || value.trim().length === 0) {
    return `${fieldName} مطلوب`;
  }

  return undefined;
}

// Min length validation
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string = "هذا الحقل",
): string | undefined {
  if (!value) {
    return `${fieldName} مطلوب`;
  }

  if (value.length < minLength) {
    return `${fieldName} يجب أن يكون ${minLength} أحرف على الأقل`;
  }

  return undefined;
}

// Max length validation
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string = "هذا الحقل",
): string | undefined {
  if (value && value.length > maxLength) {
    return `${fieldName} يجب أن يكون ${maxLength} حرف كحد أقصى`;
  }

  return undefined;
}

// URL validation
export function validateUrl(url: string): string | undefined {
  if (!url) {
    return "الرابط مطلوب";
  }

  try {
    new URL(url);
    return undefined;
  } catch {
    return "الرابط غير صحيح";
  }
}

// Number validation
export function validateNumber(
  value: string,
  fieldName: string = "هذا الحقل",
): string | undefined {
  if (!value) {
    return `${fieldName} مطلوب`;
  }

  if (isNaN(Number(value))) {
    return `${fieldName} يجب أن يكون رقم`;
  }

  return undefined;
}

// Number range validation
export function validateNumberRange(
  value: string,
  min: number,
  max: number,
  fieldName: string = "هذا الحقل",
): string | undefined {
  const numberError = validateNumber(value, fieldName);
  if (numberError) return numberError;

  const num = Number(value);
  if (num < min || num > max) {
    return `${fieldName} يجب أن يكون بين ${min} و ${max}`;
  }

  return undefined;
}

// Age validation (for students)
export function validateAge(age: string): string | undefined {
  const numberError = validateNumber(age, "العمر");
  if (numberError) return numberError;

  const ageNum = Number(age);
  if (ageNum < 13 || ageNum > 25) {
    return "العمر يجب أن يكون بين 13 و 25 سنة";
  }

  return undefined;
}

// Grade validation (Egyptian secondary school)
export function validateGrade(grade: string): string | undefined {
  if (!grade) {
    return "الصف الدراسي مطلوب";
  }

  const validGrades = ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"];
  if (!validGrades.includes(grade)) {
    return "الصف الدراسي غير صحيح";
  }

  return undefined;
}

// Terms acceptance validation
export function validateTermsAcceptance(accepted: boolean): string | undefined {
  if (!accepted) {
    return "يجب الموافقة على الشروط والأحكام";
  }

  return undefined;
}

// Compose multiple validators
export function composeValidators(
  ...validators: Array<(value: any) => string | undefined>
) {
  return (value: any): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  };
}
