-- Создаем enum для типов контента
CREATE TYPE content_type AS ENUM ('video', 'material', 'task', 'quiz');

-- Создаем таблицу для курсов
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Создаем таблицу для уроков
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(course_id, order_index)
);

-- Создаем таблицу для видео-контента
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  duration INTEGER, -- длительность в секундах
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(lesson_id, order_index)
);

-- Создаем таблицу для материалов
CREATE TABLE materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- тип файла или ресурса
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(lesson_id, order_index)
);

-- Создаем таблицу для заданий
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(lesson_id, order_index)
);

-- Создаем таблицу для тестов
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER NOT NULL,
  attempts_allowed INTEGER DEFAULT -1, -- -1 для неограниченного количества попыток
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Создаем таблицу для вопросов теста
CREATE TABLE quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(quiz_id, order_index)
);

-- Создаем таблицу для вариантов ответов
CREATE TABLE quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(question_id, order_index)
);

-- Создаем таблицу для отслеживания прогресса пользователя
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL, -- ID видео, материала, задания или теста
  content_type content_type NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, content_id)
);

-- Создаем таблицу для результатов тестов
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  attempt_number INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, quiz_id, attempt_number)
);

-- Создаем RLS политики
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Политики для чтения контента (доступно всем аутентифицированным пользователям)
CREATE POLICY "Enable read access for authenticated users" ON courses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON lessons
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON videos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON materials
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON quizzes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON quiz_questions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON quiz_answers
  FOR SELECT TO authenticated USING (true);

-- Политики для прогресса пользователя (пользователь может видеть и изменять только свой прогресс)
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Политики для результатов тестов
CREATE POLICY "Users can view own quiz results" ON quiz_results
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results" ON quiz_results
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Создаем индексы для оптимизации запросов
CREATE INDEX lessons_course_id_idx ON lessons(course_id);
CREATE INDEX videos_lesson_id_idx ON videos(lesson_id);
CREATE INDEX materials_lesson_id_idx ON materials(lesson_id);
CREATE INDEX tasks_lesson_id_idx ON tasks(lesson_id);
CREATE INDEX quiz_questions_quiz_id_idx ON quiz_questions(quiz_id);
CREATE INDEX quiz_answers_question_id_idx ON quiz_answers(question_id);
CREATE INDEX user_progress_user_id_idx ON user_progress(user_id);
CREATE INDEX user_progress_content_id_idx ON user_progress(content_id);
CREATE INDEX quiz_results_user_id_idx ON quiz_results(user_id);
CREATE INDEX quiz_results_quiz_id_idx ON quiz_results(quiz_id); 