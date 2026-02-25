// Authentication System Types for MRF Educational Platform
// CRITICAL: Grade Selection - Grade is IMMUTABLE after registration

import type { GradeLevel } from './lecture';

export type UserRole = 'student' | 'teacher' | 'admin';

export type SubscriptionStatus = 'active' | 'expired' | 'trial' | 'cancelled' | 'none';

export type SubscriptionPlan = 'monthly' | 'semester' | 'yearly';

export interface User {
  id: string;
  email: string;
  name: string;
  
  // CRITICAL: Grade Selection
  gradeLevel: GradeLevel; // IMMUTABLE after registration
  role: UserRole;
  
  // Profile
  phone?: string;
  avatar?: string;
  bio?: string;
  
  // Subscription
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  
  // Verification
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerified: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Settings
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  
  // Notification types
  newLecture: boolean;
  quizReminder: boolean;
  homeworkDeadline: boolean;
  gradePosted: boolean;
  teacherFeedback: boolean;
}

export interface PrivacyPreferences {
  showProfile: boolean;
  showProgress: boolean;
  allowMessages: boolean;
}

// Registration
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gradeLevel: GradeLevel; // CRITICAL: Must be selected
  phone?: string;
  acceptTerms: boolean;
}

export interface RegisterResponse {
  user: User;
  token: string;
  message: string;
  requiresEmailVerification: boolean;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: Date;
  message: string;
}

// Email Verification
export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

// Password Reset
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Profile Update
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UpdateProfileResponse {
  user: User;
  message: string;
}

// Change Password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Grade Change Request (requires admin approval)
export interface GradeChangeRequest {
  id: string;
  userId: string;
  currentGrade: GradeLevel;
  requestedGrade: GradeLevel;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // Admin ID
  reviewNotes?: string;
}

export interface RequestGradeChangeRequest {
  requestedGrade: GradeLevel;
  reason: string;
}

export interface RequestGradeChangeResponse {
  request: GradeChangeRequest;
  message: string;
}

// Session
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivityAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Auth Context (for frontend)
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  requestGradeChange: (data: RequestGradeChangeRequest) => Promise<void>;
  
  // Verification
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  
  // Password reset
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

// Subscription
export interface Subscription {
  id: string;
  userId: string;
  gradeLevel: GradeLevel;
  
  // Plan
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  
  // Dates
  startDate: Date;
  endDate: Date;
  cancelledAt?: Date;
  
  // Payment
  amount: number;
  currency: string;
  paymentMethod: string;
  
  // Auto-renewal
  autoRenew: boolean;
  nextBillingDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPricing {
  gradeLevel: GradeLevel;
  plans: {
    monthly: number;
    semester: number;
    yearly: number;
  };
  currency: string;
  features: string[];
}

// Access Control
export interface AccessControl {
  canAccessLecture: (lectureId: string, user: User) => boolean;
  canAccessQuiz: (quizId: string, user: User) => boolean;
  canAccessLesson: (lessonId: string, user: User) => boolean;
  canAccessExercise: (exerciseId: string, user: User) => boolean;
  canAccessHomework: (homeworkId: string, user: User) => boolean;
  hasActiveSubscription: (user: User) => boolean;
  isGradeMatch: (contentGrade: GradeLevel, userGrade: GradeLevel) => boolean;
}

// API Middleware Types
export interface AuthenticatedRequest {
  user: User;
  session: Session;
}

export interface RequestContext {
  userId: string;
  userGrade: GradeLevel;
  userRole: UserRole;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  hasActiveSubscription: boolean;
}

