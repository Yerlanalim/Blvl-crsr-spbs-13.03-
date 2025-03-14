import Link from 'next/link'
import { Lesson } from '@/types'

interface LessonItemProps {
  lesson: Lesson;
  courseId: string;
  isCompleted: boolean;
}

export function LessonItem({ lesson, courseId, isCompleted }: LessonItemProps) {
  return (
    <Link 
      href={`/courses/${courseId}/lessons/${lesson.id}`}
      className="block"
    >
      <div className={`p-4 border rounded-lg transition-all hover:shadow-md ${
        isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            {lesson.order_index}. {lesson.title}
          </h3>
          {isCompleted && (
            <span className="text-green-600 text-sm font-medium">
              Завершено
            </span>
          )}
        </div>
      </div>
    </Link>
  )
} 