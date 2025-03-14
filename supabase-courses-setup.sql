-- Создание таблицы курсов
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  level TEXT,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Создание таблицы уроков
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Создание таблицы прогресса пользователей
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Включение Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для курсов (доступны для чтения всем)
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses FOR SELECT 
USING (true);

-- Политики безопасности для уроков (доступны для чтения всем)
CREATE POLICY "Lessons are viewable by everyone" 
ON public.lessons FOR SELECT 
USING (true);

-- Политики безопасности для прогресса пользователей
CREATE POLICY "Users can view their own progress" 
ON public.user_progress FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.user_progress FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Добавление тестовых данных
INSERT INTO public.courses (id, title, description, image_url, level, duration)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Введение в программирование', 'Базовый курс для начинающих программистов. Вы изучите основные концепции программирования, алгоритмы и структуры данных.', 'https://via.placeholder.com/800x400?text=Programming', 'Начинающий', '4 недели');

INSERT INTO public.lessons (id, course_id, title, content, video_url, order_index)
VALUES 
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Введение в мир программирования', 'Содержание первого урока...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Переменные и типы данных', 'Содержание второго урока...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Условные операторы', 'Содержание третьего урока...', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 3); 