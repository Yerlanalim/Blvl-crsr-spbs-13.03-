'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'

interface LessonProgressProps {
  lessonId: string
  initialCompleted: boolean
}

export function LessonProgress({ lessonId, initialCompleted }: LessonProgressProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  
  const toggleLessonCompletion = async () => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('Пользователь не авторизован')
        return
      }
      
      // Обновляем прогресс пользователя
      const newCompletedState = !isCompleted
      
      // Проверяем, существует ли запись о прогрессе
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single()
      
      if (existingProgress) {
        // Обновляем существующую запись
        await supabase
          .from('user_progress')
          .update({ 
            completed: newCompletedState,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id)
      } else {
        // Создаем новую запись
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
      }
      
      setIsCompleted(newCompletedState)
    } catch (error) {
      console.error('Ошибка при обновлении прогресса:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Button
      onClick={toggleLessonCompletion}
      disabled={isLoading}
      variant={isCompleted ? "outline" : "default"}
      className={isCompleted ? "border-green-500 text-green-600" : ""}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isCompleted ? (
        <Check className="h-4 w-4 mr-2" />
      ) : null}
      {isCompleted ? "Урок завершен" : "Отметить как завершенный"}
    </Button>
  )
} 