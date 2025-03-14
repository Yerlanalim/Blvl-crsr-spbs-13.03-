import Link from 'next/link'
import { Course } from '@/types'

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={course.image_url || 'https://via.placeholder.com/300x200?text=Course'} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {course.level && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {course.level}
            </span>
          )}
          {course.duration && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {course.duration}
            </span>
          )}
        </div>
        
        <Link 
          href={`/courses/${course.id}`}
          className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Подробнее
        </Link>
      </div>
    </div>
  )
} 