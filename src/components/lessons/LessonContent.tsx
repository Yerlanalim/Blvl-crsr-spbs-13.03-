import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoTab } from "./tabs/VideoTab"
import { MaterialsTab } from "./tabs/MaterialsTab"
import { TasksTab } from "./tabs/TasksTab"
import { QuizTab } from "./tabs/QuizTab"

interface LessonContentProps {
  lessonId: string
}

export function LessonContent({ lessonId }: LessonContentProps) {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="video" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="video">Видео</TabsTrigger>
          <TabsTrigger value="materials">Материалы</TabsTrigger>
          <TabsTrigger value="tasks">Задания</TabsTrigger>
          <TabsTrigger value="quiz">Тест</TabsTrigger>
        </TabsList>
        <TabsContent value="video">
          <VideoTab lessonId={lessonId} />
        </TabsContent>
        <TabsContent value="materials">
          <MaterialsTab lessonId={lessonId} />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksTab lessonId={lessonId} />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizTab lessonId={lessonId} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 