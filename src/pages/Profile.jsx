import { useAuth } from '@/components/Auth/AuthProvider'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, displayName, avatarUrl, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="h-full flex flex-col bg-race-bg max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-race-chat border-b border-race-border shrink-0">
        <button onClick={() => navigate('/coach')} className="text-gray-400 hover:text-white">
          ← Back
        </button>
        <div className="text-sm font-semibold text-white">Profile</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* User Card */}
        <div className="bg-race-card border border-race-border rounded-xl p-5">
          <div className="flex items-center gap-4 mb-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-14 h-14 rounded-full" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-race-accent/20 flex items-center justify-center text-xl text-race-accent font-bold">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-lg font-bold text-white">{displayName}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </div>

        {/* My Cars */}
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-1">My Cars</div>
          <div className="bg-race-card border border-race-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-race-border">
              <div className="flex items-center gap-3">
                <span className="text-lg">🏎️</span>
                <div>
                  <div className="text-sm font-medium text-white">RC10B7</div>
                  <div className="text-xs text-gray-500">2WD Buggy · Kit Baseline</div>
                </div>
              </div>
              <div className="text-xs text-race-accent">Active</div>
            </div>
            <button className="w-full px-4 py-3 text-left text-sm text-gray-500 hover:text-gray-400 hover:bg-white/5 transition-colors">
              + Add another car
            </button>
          </div>
        </div>

        {/* Saved Setups */}
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-1">Saved Setups</div>
          <div className="bg-race-card border border-race-border rounded-xl p-8 text-center">
            <div className="text-gray-600 text-sm">No saved setups yet</div>
            <div className="text-gray-700 text-xs mt-1">Complete a race session to save your first setup</div>
          </div>
        </div>

        {/* Session History */}
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-1">Race Sessions</div>
          <div className="bg-race-card border border-race-border rounded-xl p-8 text-center">
            <div className="text-gray-600 text-sm">No sessions yet</div>
            <div className="text-gray-700 text-xs mt-1">Your race history will show up here</div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={async () => { await signOut(); navigate('/'); }}
          className="w-full py-3 text-center text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
