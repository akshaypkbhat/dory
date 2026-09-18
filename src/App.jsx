import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import Login from './Login'
import Tasks from './Tasks'
import Chat from './Chat'
import './App.css'

export default function App() {
  const [user, setUser] = useState(undefined)
  const [tab, setTab] = useState('tasks')

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  if (user === undefined) return null
  if (user === null) return <Login />

  return (
    <div className="app">
      <header>
        <h1>Dory</h1>
        <div>
          <span>{user.displayName}</span>
          <button onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </header>
      <nav>
        <button className={tab === 'tasks' ? 'active' : ''} onClick={() => setTab('tasks')}>
          Tasks
        </button>
        <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>
          Chat
        </button>
      </nav>
      <main>
        {tab === 'tasks' && <Tasks user={user} />}
        {tab === 'chat' && <Chat user={user} />}
      </main>
    </div>
  )
}
