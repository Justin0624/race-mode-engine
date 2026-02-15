import { useAuth } from '@/components/Auth/AuthProvider'
import { useNavigate } from 'react-router-dom'

// This will import the full chat coach component
// For now, placeholder that shows auth is working
export default function CoachPage() {
  const { user, displayName, avatarUrl, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col bg-race-bg max-w-lg mx-auto">
      {/* Header with user info */}
      <div className="flex items-center justify-between px-4 py-3 bg-race-chat border-b border-race-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-lg">
            🏁
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Race Mode Coach</div>
            <div className="text-xs text-gray-500">
              {user ? `Hey ${displayName}` : 'Guest Mode'}
            </div>
          </div>
        </div>

        {user ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-race-accent/20 flex items-center justify-center text-xs text-race-accent font-bold">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="text-xs text-race-accent hover:text-blue-400"
          >
            Sign in
          </button>
        )}
      </div>

      {/* Chat area — this is where the full coach component goes */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🏁</div>
          <h2 className="text-xl font-bold text-white mb-2">Race Mode Engine v0.1</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            The full coach UI connects here. For now, check out the prototype artifacts 
            to see the conversational experience.
          </p>
          {!user && (
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-race-accent rounded-full text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Sign in to save your setups
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
