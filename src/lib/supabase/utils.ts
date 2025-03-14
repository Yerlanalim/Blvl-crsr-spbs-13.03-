import { createClient } from './server'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { Course, Lesson, UserProfile, CourseProgress, UserProgress } from '@/types'
import { getUserLessonProgress, updateUserLessonProgress } from './progress'

/**
 * Получение текущего пользователя
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

/**
 * Получение профиля пользователя
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Ошибка при получении профиля:', error)
    return null
  }
  
  return data
}

/**
 * Получение курсов
 */
export async function getCourses(): Promise<Course[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Ошибка при получении курсов:', error)
    return []
  }
  
  return data || []
}

/**
 * Получение курса по ID
 */
export async function getCourseById(courseId: string): Promise<Course | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()
  
  if (error) {
    console.error('Ошибка при получении курса:', error)
    return null
  }
  
  return data
}

/**
 * Получение уроков курса
 */
export async function getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })
  
  if (error) {
    console.error('Ошибка при получении уроков:', error)
    return []
  }
  
  return data || []
}

/**
 * Получение урока по ID
 */
export async function getLessonById(lessonId: string, courseId: string): Promise<Lesson | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .eq('course_id', courseId)
    .single()
  
  if (error) {
    console.error('Ошибка при получении урока:', error)
    return null
  }
  
  return data
}

/**
 * Получение прогресса пользователя по курсу
 */
export async function getUserProgressByCourse(userId: string, courseId: string): Promise<CourseProgress> {
  const supabase = createClient()
  
  // Получаем все уроки курса
  const lessons = await getLessonsByCourseId(courseId)
  
  if (!lessons.length) {
    return { progress: [], completedCount: 0, totalCount: 0, percentage: 0 }
  }
  
  // Получаем прогресс пользователя
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .in('lesson_id', lessons.map(lesson => lesson.id))
  
  if (error) {
    console.error('Ошибка при получении прогресса:', error)
    return { progress: [], completedCount: 0, totalCount: lessons.length, percentage: 0 }
  }
  
  const progress = data || []
  const completedCount = progress.filter(p => p.completed).length
  const percentage = Math.round((completedCount / lessons.length) * 100)
  
  return {
    progress,
    completedCount,
    totalCount: lessons.length,
    percentage
  }
}

// Экспортируем функции для работы с прогрессом
export { getUserLessonProgress, updateUserLessonProgress } 