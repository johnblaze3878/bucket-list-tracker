import { useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser, signOut } from 'aws-amplify/auth'
import AuthPage from './AuthPage'

const client = generateClient()

export default function App() {
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(false)

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch { setUser(null) }
    setAuthChecked(true)
  }

  async function handleSignOut() {
    await signOut()
    setUser(null)
    setItems([])
  }

  async function fetchItems() {
    const result = await client.models.BucketListItem.list()
    setItems(result.data)
  }

  async function addItem() {
    if (!newItem.trim()) return
    setLoading(true)
    await client.models.BucketListItem.create({ title: newItem, completed: false })
    setNewItem('')
    await fetchItems()
    setLoading(false)
  }

  async function toggleComplete(item) {
    await client.models.BucketListItem.update({ id: item.id, completed: !item.completed })
    fetchItems()
  }

  async function deleteItem(id) {
    await client.models.BucketListItem.delete({ id })
    fetchItems()
  }

  useEffect(() => { checkUser() }, [])
  useEffect(() => { if (user) fetchItems() }, [user])

  if (!authChecked) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🪣</div>
        <p style={{ color: '#1de9b6', fontWeight: '700' }}>Loading...</p>
      </div>
    </div>
  )

  if (!user) return <AuthPage onSignIn={checkUser} />

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

      {/* Header */}
      <div style={{ maxWidth: '650px', margin: '0 auto 30px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d1b35', padding: '20px 30px', borderRadius: '20px', border: '1px solid #1a2f55' }}>
        <div>
          <h1 style={{ color: '#1de9b6', fontSize: '1.8rem', margin: 0, fontWeight: '800' }}>
            🪣 My Bucket List
          </h1>
          <p style={{ color: '#4a6fa5', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
            {user?.signInDetails?.loginId || user?.username}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          style={{ background: 'transparent', color: '#ff6b9d', border: '1px solid #ff6b9d', padding: '10px 22px', borderRadius: '25px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: '650px', margin: '0 auto 25px auto', display: 'flex', gap: '15px' }}>
        <div style={{ flex: 1, background: '#0d1b35', border: '1px solid #1a2f55', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1de9b6' }}>{items.length}</div>
          <div style={{ fontSize: '0.7rem', color: '#4a6fa5', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>Total Goals</div>
        </div>
        <div style={{ flex: 1, background: '#0d1b35', border: '1px solid #1a2f55', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ff6b9d' }}>{items.filter(i => i.completed).length}</div>
          <div style={{ fontSize: '0.7rem', color: '#4a6fa5', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>Completed</div>
        </div>
        <div style={{ flex: 1, background: '#0d1b35', border: '1px solid #1a2f55', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#a78bfa' }}>{items.filter(i => !i.completed).length}</div>
          <div style={{ fontSize: '0.7rem', color: '#4a6fa5', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>Remaining</div>
        </div>
      </div>

      {/* Add Item */}
      <div style={{ maxWidth: '650px', margin: '0 auto 25px auto', display: 'flex', gap: '10px', background: '#0d1b35', padding: '20px', borderRadius: '16px', border: '1px solid #1a2f55' }}>
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addItem()}
          placeholder="Add a new bucket list item..."
          style={{ flex: 1, padding: '14px 18px', borderRadius: '12px', border: '1px solid #1a2f55', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#071029', color: '#ffffff' }}
        />
        <button
          onClick={addItem}
          disabled={loading}
          style={{ background: '#1de9b6', color: '#0a0f1e', border: 'none', padding: '14px 24px', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: '800', whiteSpace: 'nowrap' }}
        >
          {loading ? '...' : '+ Add Goal'}
        </button>
      </div>

      {/* Items List */}
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', background: '#0d1b35', borderRadius: '16px', border: '1px solid #1a2f55' }}>
            <div style={{ fontSize: '3rem' }}>🌟</div>
            <p style={{ fontSize: '1.1rem', color: '#1de9b6', fontWeight: '700', marginTop: '12px' }}>No goals yet!</p>
            <p style={{ fontSize: '0.9rem', color: '#4a6fa5', marginTop: '6px' }}>Add your first bucket list item above</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map(item => (
              <li key={item.id} style={{
                padding: '18px 22px', margin: '12px 0',
                background: item.completed ? 'rgba(29,233,182,0.05)' : '#0d1b35',
                borderRadius: '14px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                border: item.completed ? '1px solid rgba(29,233,182,0.3)' : '1px solid #1a2f55',
              }}>
                <span style={{ fontSize: '1rem', color: item.completed ? '#1de9b6' : '#8aa4cc', textDecoration: item.completed ? 'line-through' : 'none', fontWeight: '500' }}>
                  {item.completed ? '✅ ' : '🎯 '}{item.title}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => toggleComplete(item)}
                    style={{ background: 'transparent', color: item.completed ? '#4a6fa5' : '#1de9b6', border: `1px solid ${item.completed ? '#1a2f55' : '#1de9b6'}`, padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    {item.completed ? 'Undo' : 'Done'}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    style={{ background: 'transparent', color: '#ff6b9d', border: '1px solid #ff6b9d', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}