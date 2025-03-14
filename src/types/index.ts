/**
 * Тип для курса
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  level?: string;
  duration?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Тип для урока
 */
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content?: string;
  video_url?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/**
 * Тип для прогресса пользователя
 */
export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Тип для профиля пользователя
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Тип для информации о прогрессе по курсу
 */
export interface CourseProgress {
  progress: UserProgress[];
  completedCount: number;
  totalCount: number;
  percentage: number;
} 