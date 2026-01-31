/**
 * Enhanced Form Validation Utilities
 * Provides real-time validation with Arabic error messages
 */

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  phone?: boolean;
  custom?: (value: any) => boolean;
  message?: string;
};

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

// Arabic error messages
const errorMessages = {
  required: "هذا الحقل مطلوب",
  minLength: (min: number) => `يجب أن يحتوي على ${min} أحرف على الأقل`,
  maxLength: (max: number) => `يجب ألا يتجاوز ${max} حرف`,
  min: (min: number) => `القيمة يجب أن تكون ${min} على الأقل`,
  max: (max: number) => `القيمة يجب ألا تتجاوز ${max}`,
  email: "البريد الإلكتروني غير صحيح",
  phone: "رقم الهاتف غير صحيح",
  pattern: "التنسيق غير صحيح",
  custom: "القيمة غير صحيحة",
};

// Validation functions
export function validateField(
  value: any,
  rules: ValidationRule,
): ValidationResult {
  // Required check
  if (rules.required && (!value || value.toString().trim() === "")) {
    return {
      isValid: false,
      error: rules.message || errorMessages.required,
    };
  }

  // If not required and empty, it's valid
  if (!value || value.toString().trim() === "") {
    return { isValid: true };
  }

  const stringValue = value.toString();

  // Min length check
  if (rules.minLength && stringValue.length < rules.minLength) {
    return {
      isValid: false,
      error: rules.message || errorMessages.minLength(rules.minLength),
    };
  }

  // Max length check
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return {
      isValid: false,
      error: rules.message || errorMessages.maxLength(rules.maxLength),
    };
  }

  // Email validation
  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(stringValue)) {
      return {
        isValid: false,
        error: rules.message || errorMessages.email,
      };
    }
  }

  // Phone validation (Egyptian format)
  if (rules.phone) {
    const phoneRegex = /^(01)[0-9]{9}$/;
    if (!phoneRegex.test(stringValue.replace(/[\s-]/g, ""))) {
      return {
        isValid: false,
        error: rules.message || errorMessages.phone,
      };
    }
  }

  // Pattern check
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return {
      isValid: false,
      error: rules.message || errorMessages.pattern,
    };
  }

  // Numeric min/max
  if (typeof value === "number" || !isNaN(Number(value))) {
    const numValue = Number(value);

    if (rules.min !== undefined && numValue < rules.min) {
      return {
        isValid: false,
        error: rules.message || errorMessages.min(rules.min),
      };
    }

    if (rules.max !== undefined && numValue > rules.max) {
      return {
        isValid: false,
        error: rules.message || errorMessages.max(rules.max),
      };
    }
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    return {
      isValid: false,
      error: rules.message || errorMessages.custom,
    };
  }

  return { isValid: true };
}

// Validate entire form
export function validateForm(
  values: Record<string, any>,
  rules: Record<string, ValidationRule>,
): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    const result = validateField(values[field], rules[field]);
    if (!result.isValid && result.error) {
      errors[field] = result.error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Real-time validation hook
export function useFormValidation(
  initialValues: Record<string, any>,
  rules: Record<string, ValidationRule>,
) {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateFieldRealtime = (field: string, value: any) => {
    const result = validateField(value, rules[field] || {});
    setErrors((prev) => ({
      ...prev,
      [field]: result.error || "",
    }));
    return result.isValid;
  };

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateFieldRealtime(field, value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateFieldRealtime(field, values[field]);
  };

  const handleSubmit = (onSubmit: (values: Record<string, any>) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(rules).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {},
      );
      setTouched(allTouched);

      // Validate all fields
      const validation = validateForm(values, rules);
      setErrors(validation.errors);

      if (validation.isValid) {
        onSubmit(values);
      }
    };
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    email: true,
    message: "البريد الإلكتروني مطلوب وغير صحيح",
  },
  password: {
    required: true,
    minLength: 8,
    message: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل",
  },
  phone: {
    required: true,
    phone: true,
    message: "رقم الهاتف مطلوب وغير صحيح",
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "الاسم مطلوب ويجب أن يكون بين 2 و 50 حرف",
  },
  grade: {
    required: true,
    custom: (value: any) => ["1", "2", "3"].includes(value),
    message: "يجب اختيار الصف الدراسي",
  },
};

// Usage example:
// import { useFormValidation, commonRules } from '@/lib/form-validation';
//
// const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormValidation(
//   { email: '', password: '' },
//   { email: commonRules.email, password: commonRules.password }
// );
//
// <form onSubmit={handleSubmit((values) => console.log(values))}>
//   <input
//     value={values.email}
//     onChange={(e) => handleChange('email', e.target.value)}
//     onBlur={() => handleBlur('email')}
//   />
//   {touched.email && errors.email && <span>{errors.email}</span>}
// </form>

import React from "react";
