# Образовательная платформа

Современная образовательная платформа для онлайн-обучения, разработанная с использованием Next.js, Supabase и Tailwind CSS.

## Возможности

- 🔐 Аутентификация пользователей (регистрация, вход, восстановление пароля)
- 👤 Профили пользователей с возможностью редактирования
- 📚 Каталог курсов с подробной информацией
- 📝 Уроки с видео и текстовым содержимым
- ✅ Отслеживание прогресса обучения
- 🎨 Современный и адаптивный интерфейс

## Технологии

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Стилизация**: Tailwind CSS, Shadcn UI
- **Деплой**: Vercel (Frontend), Supabase (Backend)

## Начало работы

### Предварительные требования

- Node.js 18+ и npm
- Аккаунт Supabase

### Установка

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/yourusername/education-platform.git
   cd education-platform
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте проект в Supabase и настройте переменные окружения:
   - Создайте файл `.env.local` в корне проекта
   - Добавьте следующие переменные:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. Настройте базу данных Supabase:
   - Откройте SQL Editor в панели управления Supabase
   - Выполните SQL-скрипт из файла `supabase-schema.sql`

5. Запустите проект в режиме разработки:
   ```bash
   npm run dev
   ```

6. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Настройка базы данных

Есть два способа настроить базу данных Supabase:

#### Способ 1: Через SQL Editor в Supabase Dashboard

1. Откройте [Supabase Dashboard](https://app.supabase.io/)
2. Выберите ваш проект
3. Перейдите в раздел SQL Editor
4. Скопируйте содержимое файла `supabase-schema.sql`
5. Вставьте в SQL Editor и выполните запрос

#### Способ 2: Через скрипт настройки

1. Создайте файл `.env.local` на основе `.env.local.example`
2. Добавьте ваш сервисный ключ Supabase в переменную `SUPABASE_SERVICE_KEY`
   (Сервисный ключ можно найти в настройках проекта Supabase в разделе API)
3. Установите зависимости:
   ```bash
   npm install
   ```
4. Запустите скрипт настройки:
   ```bash
   npm run setup-db
   ```

## Структура проекта

```
src/
├── app/                  # Маршруты и страницы приложения
│   ├── (auth)/           # Страницы аутентификации
│   ├── (protected)/      # Защищенные страницы (требуют авторизации)
│   ├── api/              # API маршруты
│   └── profile/          # Страница профиля
├── components/           # React компоненты
│   ├── auth/             # Компоненты аутентификации
│   ├── courses/          # Компоненты для курсов
│   ├── lessons/          # Компоненты для уроков
│   └── ui/               # UI компоненты
├── lib/                  # Утилиты и библиотеки
│   └── supabase/         # Утилиты для работы с Supabase
└── types/                # TypeScript типы
```

## Настройка аутентификации

1. В панели управления Supabase перейдите в раздел Authentication
2. Настройте провайдеры аутентификации (Email, Google, GitHub и т.д.)
3. Добавьте URL перенаправления для аутентификации:
   - http://localhost:3000/auth/callback (для разработки)
   - https://your-production-domain.com/auth/callback (для продакшена)

## Деплой

### Frontend (Vercel)

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения в Vercel:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

### Backend (Supabase)

Supabase уже развернут в облаке, дополнительных действий не требуется.

## Лицензия

MIT