'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import { updateUserLessonProgress } from '@/lib/supabase/progress'

interface LessonProgressButtonProps {
  lessonId: string
  initialCompleted: boolean
}

export function LessonProgressButton({ lessonId, initialCompleted }: LessonProgressButtonProps) {
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
      
      const newCompletedState = !isCompleted
      
      // Используем утилиту для обновления прогресса
      const result = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          completed: newCompletedState,
        }),
      })
      
      if (result.ok) {
        setIsCompleted(newCompletedState)
      } else {
        console.error('Ошибка при обновлении прогресса')
      }
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