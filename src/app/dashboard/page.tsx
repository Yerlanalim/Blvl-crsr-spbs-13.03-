import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Получаем курсы (заглушка, в реальном приложении здесь будет запрос к базе данных)
  const courses = [
    { id: 1, title: 'Введение в программирование', description: 'Базовый курс для начинающих', progress: 0 },
    { id: 2, title: 'JavaScript для начинающих', description: 'Изучение основ JavaScript', progress: 0 },
    { id: 3, title: 'React разработка', description: 'Создание современных веб-приложений с React', progress: 0 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {user?.email}</h1>
        <p className="text-gray-600">Ваша персональная панель управления обучением</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Прогресс обучения</h2>
          <p className="text-3xl font-bold text-primary">0%</p>
          <p className="text-gray-600 mt-2">Продолжайте обучение, чтобы увеличить свой прогресс</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Завершенные курсы</h2>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-gray-600 mt-2">Пройдите курсы полностью, чтобы получить сертификаты</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Активные курсы</h2>
          <p className="text-3xl font-bold text-primary">{courses.length}</p>
          <p className="text-gray-600 mt-2">Курсы, доступные для изучения</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Доступные курсы</h2>
          <Link 
            href="/courses" 
            className="text-primary hover:text-primary/80"
          >
            Все курсы
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{course.progress}% завершено</p>
              </div>
              
              <Link 
                href={`/courses/${course.id}`}
                className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                {course.progress > 0 ? 'Продолжить' : 'Начать'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 