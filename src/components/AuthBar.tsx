import { useIdentity } from '../store/StoreProvider'
import { Button } from './Button'

export function AuthBar() {
  const { email, cloudSync, signOut } = useIdentity()
  if (!email) return null

  return (
    <div className="auth-bar">
      <span className="auth-bar-email">{email}</span>
      {!cloudSync && (
        <span className="auth-bar-status" title="VITE_CLOUD_SYNC=on turns syncing on">
          Local only, no cloud sync
        </span>
      )}
      <Button variant="secondary" onClick={() => void signOut()}>
        Switch
      </Button>
    </div>
  )
}
