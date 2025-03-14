import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForm'

export default function RegisterPage() {
  async function signUp(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    
    const supabase = createClient()
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return redirect('/auth/register?error=' + encodeURIComponent(error.message))
    }

    return redirect('/auth/login?message=Проверьте вашу почту для подтверждения регистрации')
  }

  return (
    <AuthForm
      title="Создайте аккаунт"
      action={signUp}
      submitText="Зарегистрироваться"
      fields={[
        {
          id: 'full-name',
          name: 'fullName',
          type: 'text',
          label: 'Полное имя',
          placeholder: 'Полное имя',
          required: true
        },
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
          autoComplete: 'new-password',
          required: true
        }
      ]}
      footerText="Уже есть аккаунт?"
      footerLinkText="Войти"
      footerLinkHref="/auth/login"
    />
  )
} 