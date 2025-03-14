import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LessonProgressButton } from '@/components/lessons/LessonProgressButton'
import { 
  getCourseById, 
  getLessonById, 
  getLessonsByCourseId, 
  getCurrentUser,
  getUserLessonProgress
} from '@/lib/supabase/utils'

interface LessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  // Получаем параметры из URL
  const courseId = params.courseId
  const lessonId = params.lessonId
  
  // Получаем информацию о курсе
  const course = await getCourseById(courseId)
  
  if (!course) {
    notFound()
  }
  
  // Получаем информацию об уроке
  const lesson = await getLessonById(lessonId, courseId)
  
  if (!lesson) {
    notFound()
  }
  
  // Получаем все уроки курса для навигации
  const lessons = await getLessonsByCourseId(courseId)
  
  // Находим предыдущий и следующий уроки
  const currentIndex = lessons.findIndex(l => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  
  // Получаем текущего пользователя и его прогресс
  const user = await getCurrentUser()
  let isCompleted = false
  
  if (user) {
    const progress = await getUserLessonProgress(user.id, lessonId)
    isCompleted = !!progress?.completed
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={`/courses/${courseId}`} className="text-primary hover:underline mb-4 inline-block">
          &larr; Назад к курсу
        </Link>
        
        <h1 className="text-3xl font-bold mt-4">{lesson.title}</h1>
        <p className="text-muted-foreground mt-1">Курс: {course.title}</p>
      </div>
      
      {lesson.video_url && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Видео</h2>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe 
              src={lesson.video_url} 
              className="w-full h-full" 
              allowFullScreen
              title={lesson.title}
            ></iframe>
          </div>
        </div>
      )}
      
      {lesson.content && (
        <div className="mb-8 prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">Материалы урока</h2>
          <div className="p-6 border rounded-lg bg-white">
            {lesson.content}
          </div>
        </div>
      )}
      
      <div className="mt-12 border-t pt-6">
        <div className="flex justify-between items-center">
          <div>
            {prevLesson && (
              <Link 
                href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                className="text-primary hover:underline"
              >
                &larr; {prevLesson.title}
              </Link>
            )}
          </div>
          
          <LessonProgressButton 
            lessonId={lessonId} 
            initialCompleted={isCompleted}
          />
          
          <div>
            {nextLesson && (
              <Link 
                href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="text-primary hover:underline"
              >
                {nextLesson.title} &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 