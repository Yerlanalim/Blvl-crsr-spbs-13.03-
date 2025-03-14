import { createClient } from './server'
import { UserProgress } from '@/types'

/**
 * Получение прогресса пользователя по уроку
 */
export async function getUserLessonProgress(userId: string, lessonId: string): Promise<UserProgress | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()
  
  if (error) {
    console.error('Ошибка при получении прогресса урока:', error)
    return null
  }
  
  return data
}

/**
 * Обновление прогресса пользователя по уроку
 */
export async function updateUserLessonProgress(
  userId: string, 
  lessonId: string, 
  completed: boolean
): Promise<UserProgress | null> {
  const supabase = createClient()
  
  // Проверяем, существует ли запись о прогрессе
  const { data: existingProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()
  
  if (existingProgress) {
    // Обновляем существующую запись
    const { data, error } = await supabase
      .from('user_progress')
      .update({ 
        completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingProgress.id)
      .select()
      .single()
    
    if (error) {
      console.error('Ошибка при обновлении прогресса:', error)
      return null
    }
    
    return data
  } else {
    // Создаем новую запись
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        completed,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Ошибка при создании прогресса:', error)
      return null
    }
    
    return data
  }
} 