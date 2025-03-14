import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Play, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Video {
  id: string
  title: string
  description: string | null
  url: string
  duration: number | null
  order_index: number
}

interface VideoProgress {
  completed: boolean
  completed_at: string | null
}

interface VideoTabProps {
  lessonId: string
}

export function VideoTab({ lessonId }: VideoTabProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [progress, setProgress] = useState<Record<string, VideoProgress>>({})
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data: videos, error } = await supabase
          .from('videos')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('order_index')

        if (error) throw error

        setVideos(videos)
        if (videos.length > 0) {
          setSelectedVideo(videos[0])
        }

        // Получаем прогресс для каждого видео
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('content_id, completed, completed_at')
          .eq('content_type', 'video')
          .in('content_id', videos.map(v => v.id))

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
        console.error('Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [lessonId, supabase])

  const markAsCompleted = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          content_id: videoId,
          content_type: 'video',
          completed: true,
          completed_at: new Date().toISOString()
        })

      if (error) throw error

      setProgress(prev => ({
        ...prev,
        [videoId]: {
          completed: true,
          completed_at: new Date().toISOString()
        }
      }))
    } catch (error) {
      console.error('Error marking video as completed:', error)
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        {selectedVideo && (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={selectedVideo.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
              {selectedVideo.description && (
                <p className="text-muted-foreground">{selectedVideo.description}</p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold">Список видео</h3>
        <div className="space-y-2">
          {videos.map((video) => (
            <motion.button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`w-full p-4 rounded-lg text-left transition-colors ${
                selectedVideo?.id === video.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-accent"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {progress[video.id]?.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{video.title}</p>
                  {video.duration && (
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </p>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
} 