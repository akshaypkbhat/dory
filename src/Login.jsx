import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

export default function Login() {
  return (
    <div className="login">
      <h1>Dory</h1>
      <p>Your personal work assistant.</p>
      <button onClick={() => signInWithPopup(auth, googleProvider)}>
        Sign in with Google
      </button>
    </div>
  )
}
