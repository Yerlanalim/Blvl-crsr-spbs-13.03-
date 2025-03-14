import Link from 'next/link'
import { AuthMessage } from '@/components/AuthMessage'

interface AuthFormProps {
  title: string;
  description?: string;
  action: (formData: FormData) => Promise<void>;
  submitText: string;
  fields: {
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
  }[];
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export function AuthForm({
  title,
  description,
  action,
  submitText,
  fields,
  footerText,
  footerLinkText,
  footerLinkHref
}: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
        
        <AuthMessage />
        
        <form className="mt-8 space-y-6" action={action}>
          <div className="rounded-md shadow-sm -space-y-px">
            {fields.map((field, index) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="sr-only">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  required={field.required !== false}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                    index === 0 ? 'rounded-t-md' : ''
                  } ${
                    index === fields.length - 1 ? 'rounded-b-md' : ''
                  } focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                  placeholder={field.placeholder || field.label}
                />
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {submitText}
            </button>
          </div>
          
          {footerText && footerLinkText && footerLinkHref && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {footerText}{' '}
                <Link href={footerLinkHref} className="font-medium text-primary hover:text-primary/80">
                  {footerLinkText}
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 