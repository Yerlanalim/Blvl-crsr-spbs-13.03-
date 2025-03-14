import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8">Образовательная платформа</h1>
        <div className="flex flex-col gap-4 items-center">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Войти
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </main>
  )
} 