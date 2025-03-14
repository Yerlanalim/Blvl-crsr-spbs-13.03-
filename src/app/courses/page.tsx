import Link from 'next/link'
import { getCourses } from '@/lib/supabase/utils'
import { CourseCard } from '@/components/courses/CourseCard'

export default async function CoursesPage() {
  // Получаем курсы из Supabase
  const courses = await getCourses()
  
  // Если курсы не найдены, показываем заглушку
  const coursesData = courses.length > 0 ? courses : [
    { 
      id: '00000000-0000-0000-0000-000000000001', 
      title: 'Введение в программирование', 
      description: 'Базовый курс для начинающих программистов. Вы изучите основные концепции программирования, алгоритмы и структуры данных.', 
      image_url: 'https://via.placeholder.com/800x400?text=Programming',
      level: 'Начинающий',
      duration: '4 недели'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Доступные курсы</h1>
        <p className="text-gray-600">Выберите курс для изучения</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coursesData.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
} 