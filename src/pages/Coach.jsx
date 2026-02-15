import { useAuth } from '@/components/Auth/AuthProvider'
import { useNavigate } from 'react-router-dom'
import Chat from '@/components/Chat'

export default function CoachPage() {
  const { user, displayName, avatarUrl } = useAuth()
  const navigate = useNavigate()

  return (
    <Chat
      userName={displayName}
      avatarUrl={avatarUrl}
      isLoggedIn={!!user}
      onProfileClick={() => navigate('/profile')}
      onLoginClick={() => navigate('/')}
    />
}
