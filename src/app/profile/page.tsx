import { getUserProfile, getCurrentUser } from '@/lib/supabase/utils'
import ProfileForm from './ProfileForm'
import { UserProfile } from '@/types'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  // Получаем текущего пользователя
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Получаем профиль пользователя
  let profile = await getUserProfile(user.id)
  
  // Если профиль не найден, создаем заглушку
  if (!profile) {
    profile = {
      id: user.id,
      email: user.email,
      full_name: 'Пользователь',
      avatar_url: 'https://via.placeholder.com/150',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Профиль пользователя</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
              <div className="flex-shrink-0">
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name} 
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-semibold">{profile.full_name}</h2>
                <p className="text-gray-600 mb-2">{profile.email}</p>
                {profile.bio && <p className="text-gray-700">{profile.bio}</p>}
                <p className="text-sm text-gray-500 mt-2">
                  Участник с {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold mb-4">Редактировать профиль</h3>
              <ProfileForm profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 