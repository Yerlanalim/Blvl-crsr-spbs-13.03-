import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateUserLessonProgress } from '@/lib/supabase/progress'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Получаем текущего пользователя
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Пользователь не авторизован' },
        { status: 401 }
      )
    }
    
    // Получаем данные из запроса
    const { lessonId, completed } = await request.json()
    
    if (!lessonId) {
      return NextResponse.json(
        { error: 'Не указан ID урока' },
        { status: 400 }
      )
    }
    
    // Обновляем прогресс пользователя
    const result = await updateUserLessonProgress(
      session.user.id,
      lessonId,
      completed
    )
    
    if (!result) {
      return NextResponse.json(
        { error: 'Ошибка при обновлении прогресса' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Ошибка при обновлении прогресса:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 