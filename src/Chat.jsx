import { useEffect, useState } from 'react'
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export default function Chat({ user }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'))
    return onSnapshot(q, (snap) =>
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    )
  }, [])

  async function sendMessage(e) {
    e.preventDefault()
    if (!text.trim()) return
    await addDoc(collection(db, 'messages'), {
      text: text.trim(),
      senderUid: user.uid,
      senderName: user.displayName,
      createdAt: Date.now(),
    })
    setText('')
  }

  return (
    <div className="chat">
      <ul className="message-list">
        {messages.map((m) => (
          <li key={m.id} className={m.senderUid === user.uid ? 'mine' : ''}>
            <strong>{m.senderName}:</strong> {m.text}
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage} className="message-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
