import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

const PRIORITIES = ['low', 'medium', 'high']

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [assignedTo, setAssignedTo] = useState('me')

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) =>
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    )
  }, [])

  async function addTask(e) {
    e.preventDefault()
    if (!text.trim()) return
    await addDoc(collection(db, 'tasks'), {
      text: text.trim(),
      priority,
      assignedTo: assignedTo === 'me' ? user.uid : null,
      createdBy: user.uid,
      createdByName: user.displayName,
      done: false,
      createdAt: Date.now(),
    })
    setText('')
  }

  async function toggleDone(task) {
    await updateDoc(doc(db, 'tasks', task.id), { done: !task.done })
  }

  return (
    <div className="tasks">
      <form onSubmit={addTask} className="task-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task..."
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="me">Assign to me</option>
          <option value="unassigned">Unassigned</option>
        </select>
        <button type="submit">Add</button>
      </form>
      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleDone(t)}
              />
              <span className={`priority priority-${t.priority}`}>{t.priority}</span>
              {t.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
