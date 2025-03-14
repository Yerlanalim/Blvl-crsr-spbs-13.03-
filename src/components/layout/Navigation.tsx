import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export async function Navigation() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  async function handleSignOut() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Обучение
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <form action={handleSignOut}>
                  <Button variant="ghost" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Войти
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 