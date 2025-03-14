-- Создание таблицы профилей пользователей
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Создание таблицы курсов
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  level TEXT,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Создание таблицы уроков
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Создание триггера для автоматического создания профиля при регистрации пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.created_at,
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создание триггера для автоматического создания профиля
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Включение Row Level Security (RLS) для всех таблиц
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Создание политик безопасности для таблицы профилей
CREATE POLICY "Пользователи могут просматривать свои профили"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять свои профили"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Создание политик безопасности для таблицы курсов
CREATE POLICY "Курсы доступны для просмотра всем пользователям"
  ON public.courses FOR SELECT
  TO authenticated
  USING (true);

-- Создание политик безопасности для таблицы уроков
CREATE POLICY "Уроки доступны для просмотра всем пользователям"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (true);

-- Создание политик безопасности для таблицы прогресса пользователей
CREATE POLICY "Пользователи могут просматривать свой прогресс"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свой прогресс"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свой прогресс"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Примеры данных для тестирования
-- Добавление курсов
INSERT INTO public.courses (id, title, description, image_url, level, duration, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Основы JavaScript',
    'Изучите основы JavaScript с нуля. Этот курс идеально подходит для начинающих, которые хотят освоить основы программирования на JavaScript.',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'Начинающий',
    '10 часов',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'React для начинающих',
    'Научитесь создавать современные веб-приложения с помощью React. Этот курс охватывает основы React, хуки, маршрутизацию и многое другое.',
    'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'Средний',
    '15 часов',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Node.js и Express',
    'Изучите серверную разработку с помощью Node.js и Express. Создавайте API, работайте с базами данных и разрабатывайте полноценные веб-приложения.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'Продвинутый',
    '20 часов',
    now(),
    now()
  );

-- Добавление уроков для курса "Основы JavaScript"
WITH js_course AS (
  SELECT id FROM public.courses WHERE title = 'Основы JavaScript' LIMIT 1
)
INSERT INTO public.lessons (course_id, title, content, video_url, order_index, created_at, updated_at)
SELECT
  js_course.id,
  title,
  content,
  video_url,
  order_index,
  now(),
  now()
FROM
  js_course,
  (VALUES
    (
      'Введение в JavaScript',
      'JavaScript - это язык программирования, который позволяет создавать интерактивные веб-страницы. В этом уроке мы рассмотрим основы JavaScript и его роль в веб-разработке.',
      'https://www.youtube.com/embed/W6NZfCO5SIk',
      1
    ),
    (
      'Переменные и типы данных',
      'В этом уроке мы изучим переменные и основные типы данных в JavaScript: строки, числа, булевы значения, массивы и объекты.',
      'https://www.youtube.com/embed/edlFjlzxkSI',
      2
    ),
    (
      'Функции и области видимости',
      'Функции - это основные строительные блоки JavaScript. В этом уроке мы рассмотрим, как создавать и использовать функции, а также разберемся с областями видимости переменных.',
      'https://www.youtube.com/embed/xUI5Tsl2JpY',
      3
    )
  ) AS lessons(title, content, video_url, order_index);

-- Добавление уроков для курса "React для начинающих"
WITH react_course AS (
  SELECT id FROM public.courses WHERE title = 'React для начинающих' LIMIT 1
)
INSERT INTO public.lessons (course_id, title, content, video_url, order_index, created_at, updated_at)
SELECT
  react_course.id,
  title,
  content,
  video_url,
  order_index,
  now(),
  now()
FROM
  react_course,
  (VALUES
    (
      'Введение в React',
      'React - это библиотека JavaScript для создания пользовательских интерфейсов. В этом уроке мы рассмотрим основные концепции React и настроим окружение для разработки.',
      'https://www.youtube.com/embed/Ke90Tje7VS0',
      1
    ),
    (
      'Компоненты и пропсы',
      'Компоненты - это основные строительные блоки React-приложений. В этом уроке мы научимся создавать компоненты и передавать им данные через пропсы.',
      'https://www.youtube.com/embed/DLX62G4lc44',
      2
    ),
    (
      'Состояние и жизненный цикл',
      'В этом уроке мы изучим состояние компонентов и методы жизненного цикла, которые позволяют управлять поведением компонентов на разных этапах их существования.',
      'https://www.youtube.com/embed/4ORZ1GmjaMc',
      3
    ),
    (
      'Хуки в React',
      'Хуки - это новая функциональность в React, которая позволяет использовать состояние и другие возможности React без написания классов. В этом уроке мы рассмотрим основные хуки: useState, useEffect и useContext.',
      'https://www.youtube.com/embed/dpw9EHDh2bM',
      4
    )
  ) AS lessons(title, content, video_url, order_index);

-- Добавление уроков для курса "Node.js и Express"
WITH node_course AS (
  SELECT id FROM public.courses WHERE title = 'Node.js и Express' LIMIT 1
)
INSERT INTO public.lessons (course_id, title, content, video_url, order_index, created_at, updated_at)
SELECT
  node_course.id,
  title,
  content,
  video_url,
  order_index,
  now(),
  now()
FROM
  node_course,
  (VALUES
    (
      'Введение в Node.js',
      'Node.js - это среда выполнения JavaScript на стороне сервера. В этом уроке мы рассмотрим основы Node.js и настроим окружение для разработки.',
      'https://www.youtube.com/embed/TlB_eWDSMt4',
      1
    ),
    (
      'Основы Express',
      'Express - это минималистичный и гибкий веб-фреймворк для Node.js. В этом уроке мы научимся создавать простые веб-серверы с помощью Express.',
      'https://www.youtube.com/embed/L72fhGm1tfE',
      2
    ),
    (
      'Маршрутизация в Express',
      'В этом уроке мы изучим маршрутизацию в Express, которая позволяет обрабатывать различные HTTP-запросы и создавать RESTful API.',
      'https://www.youtube.com/embed/pKd0Rpw7O48',
      3
    ),
    (
      'Работа с базами данных',
      'В этом уроке мы научимся работать с базами данных в Node.js, используя MongoDB и Mongoose для создания, чтения, обновления и удаления данных.',
      'https://www.youtube.com/embed/7CqJlxBYj-M',
      4
    ),
    (
      'Аутентификация и авторизация',
      'В этом уроке мы реализуем аутентификацию и авторизацию пользователей в Node.js-приложении с использованием Passport.js и JWT.',
      'https://www.youtube.com/embed/7nafaH9SddU',
      5
    )
  ) AS lessons(title, content, video_url, order_index); 