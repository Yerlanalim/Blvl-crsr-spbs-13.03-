import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { FileText, Link as LinkIcon, Download, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface Material {
  id: string
  title: string
  description: string | null
  url: string
  type: string
  order_index: number
}

interface MaterialProgress {
  completed: boolean
  completed_at: string | null
}

interface MaterialsTabProps {
  lessonId: string
}

export function MaterialsTab({ lessonId }: MaterialsTabProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [progress, setProgress] = useState<Record<string, MaterialProgress>>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const { data: materials, error } = await supabase
          .from('materials')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('order_index')

        if (error) throw error

        setMaterials(materials)

        // Получаем прогресс для каждого материала
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('content_id, completed, completed_at')
          .eq('content_type', 'material')
          .in('content_id', materials.map(m => m.id))

        if (progressData) {
          const progressMap = progressData.reduce((acc, curr) => ({
            ...acc,
            [curr.content_id]: {
              completed: curr.completed,
              completed_at: curr.completed_at
            }
          }), {})
          setProgress(progressMap)
        }
      } catch (error) {
        console.error('Error fetching materials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [lessonId, supabase])

  const markAsCompleted = async (materialId: string) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          content_id: materialId,
          content_type: 'material',
          completed: true,
          completed_at: new Date().toISOString()
        })

      if (error) throw error

      setProgress(prev => ({
        ...prev,
        [materialId]: {
          completed: true,
          completed_at: new Date().toISOString()
        }
      }))
    } catch (error) {
      console.error('Error marking material as completed:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {materials.map((material) => (
        <motion.div
          key={material.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{material.title}</h3>
              </div>
              {material.description && (
                <p className="text-muted-foreground">{material.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(material.url, '_blank')}
              >
                {material.type === 'link' ? (
                  <LinkIcon className="h-4 w-4 mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {material.type === 'link' ? 'Открыть' : 'Скачать'}
              </Button>
              {!progress[material.id]?.completed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsCompleted(material.id)}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {progress[material.id]?.completed && (
            <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>
                Изучено{" "}
                {new Date(progress[material.id].completed_at!).toLocaleDateString()}
              </span>
            </div>
          )}
        </motion.div>
      ))}
      {materials.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          Для этого урока пока нет дополнительных материалов
        </div>
      )}
    </div>
  )
} 