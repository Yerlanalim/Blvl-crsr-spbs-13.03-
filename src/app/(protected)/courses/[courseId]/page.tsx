import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  getCourseById, 
  getLessonsByCourseId, 
  getCurrentUser, 
  getUserProgressByCourse 
} from '@/lib/supabase/utils'
import { LessonItem } from '@/components/courses/LessonItem'
import { Course, Lesson, CourseProgress } from '@/types'

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  // Получаем courseId из params
  const courseId = params.courseId
  
  // Получаем информацию о курсе
  const course = await getCourseById(courseId)
  
  if (!course) {
    notFound()
  }
  
  // Получаем уроки курса
  const lessons = await getLessonsByCourseId(courseId)
  
  // Получаем текущего пользователя
  const user = await getCurrentUser()
  
  // Получаем прогресс пользователя
  let progress: CourseProgress = { 
    progress: [], 
    completedCount: 0, 
    totalCount: lessons.length, 
    percentage: 0 
  }
  
  if (user) {
    progress = await getUserProgressByCourse(user.id, courseId)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-primary hover:underline mb-4 inline-block">
          &larr; Назад к курсам
        </Link>
        
        <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
        {course.description && (
          <p className="text-muted-foreground mt-2">{course.description}</p>
        )}
        
        {course.image_url && (
          <div className="mt-6 rounded-lg overflow-hidden max-w-3xl">
            <img 
              src={course.image_url} 
              alt={course.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Уроки курса</h2>
          <div className="text-sm text-muted-foreground">
            Прогресс: {progress.completedCount}/{progress.totalCount} ({progress.percentage}%)
          </div>
        </div>
        
        <div className="space-y-4">
          {lessons.length > 0 ? (
            lessons.map((lesson) => {
              const lessonProgress = progress.progress.find(p => p.lesson_id === lesson.id)
              const isCompleted = lessonProgress?.completed || false
              
              return (
                <LessonItem 
                  key={lesson.id}
                  lesson={lesson}
                  courseId={courseId}
                  isCompleted={isCompleted}
                />
              )
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              В этом курсе пока нет уроков
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 