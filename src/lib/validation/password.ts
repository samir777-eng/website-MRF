/**
 * Password Validation Utilities
 *
 * SECURITY: Implements strong password requirements to prevent weak passwords
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "good" | "strong";
  score: number; // 0-100
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

// Default strong password requirements
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

// Arabic error messages for password validation
export const PASSWORD_ERROR_MESSAGES = {
  tooShort: (min: number) => `كلمة المرور يجب أن تكون ${min} أحرف على الأقل`,
  noUppercase: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل",
  noLowercase: "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل",
  noNumber: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل",
  noSpecialChar:
    "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)",
};

/**
 * Validate a password against security requirements
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS,
): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < requirements.minLength) {
    errors.push(PASSWORD_ERROR_MESSAGES.tooShort(requirements.minLength));
  } else {
    score += 20;
    // Bonus for longer passwords
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
  }

  // Check for uppercase letters
  if (requirements.requireUppercase) {
    if (!/[A-Z]/.test(password)) {
      errors.push(PASSWORD_ERROR_MESSAGES.noUppercase);
    } else {
      score += 15;
    }
  }

  // Check for lowercase letters
  if (requirements.requireLowercase) {
    if (!/[a-z]/.test(password)) {
      errors.push(PASSWORD_ERROR_MESSAGES.noLowercase);
    } else {
      score += 15;
    }
  }

  // Check for numbers
  if (requirements.requireNumbers) {
    if (!/[0-9]/.test(password)) {
      errors.push(PASSWORD_ERROR_MESSAGES.noNumber);
    } else {
      score += 20;
    }
  }

  // Check for special characters
  if (requirements.requireSpecialChars) {
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push(PASSWORD_ERROR_MESSAGES.noSpecialChar);
    } else {
      score += 20;
    }
  }

  // Determine strength level
  let strength: "weak" | "fair" | "good" | "strong";
  if (score < 40) {
    strength = "weak";
  } else if (score < 60) {
    strength = "fair";
  } else if (score < 80) {
    strength = "good";
  } else {
    strength = "strong";
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.min(100, score),
  };
}

/**
 * Get a simple validation error message for forms
 * Returns the first error or null if valid
 */
export function getPasswordError(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS,
): string | null {
  const result = validatePassword(password, requirements);
  return result.errors[0] || null;
}

/**
 * Check if password meets minimum requirements
 * A simpler check for login forms where we just need basic validation
 */
export function isPasswordValid(
  password: string,
  minLength: number = 8,
): boolean {
  return password.length >= minLength;
}
