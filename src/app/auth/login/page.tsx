import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForm'

export default function LoginPage() {
  async function signIn(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/auth/login?error=' + encodeURIComponent(error.message))
    }

    return redirect('/')
  }

  return (
    <AuthForm
      title="Войдите в свой аккаунт"
      action={signIn}
      submitText="Войти"
      fields={[
        {
          id: 'email-address',
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Email',
          autoComplete: 'email',
          required: true
        },
        {
          id: 'password',
          name: 'password',
          type: 'password',
          label: 'Пароль',
          placeholder: 'Пароль',
          autoComplete: 'current-password',
          required: true
        }
      ]}
      footerText="Нет аккаунта?"
      footerLinkText="Зарегистрироваться"
      footerLinkHref="/auth/register"
    />
  )
} 