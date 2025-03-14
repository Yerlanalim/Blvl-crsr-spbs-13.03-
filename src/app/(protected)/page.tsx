import { getCourses } from '@/lib/supabase/utils'
import { CourseCard } from '@/components/courses/CourseCard'
import { Course } from '@/types'

export default async function HomePage() {
  // Получаем список курсов
  const courses = await getCourses()

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Доступные курсы</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}

        {courses.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Пока нет доступных курсов
          </div>
        )}
      </div>
    </div>
  )
} 