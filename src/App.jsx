import { useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth'
import { uploadData, getUrl } from 'aws-amplify/storage'
import AuthPage from './AuthPage'

const client = generateClient()

export default function App() {
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newImage, setNewImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
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
    const itemsWithImages = await Promise.all(
      result.data.map(async (item) => {
        if (item.imageUrl) {
          try {
            const urlResult = await getUrl({
              path: item.imageUrl
            })
            return { ...item, signedImageUrl: urlResult.url.toString() }
          } catch {
            return item
          }
        }
        return item
      })
    )
    setItems(itemsWithImages)
  }

  async function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setNewImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function addItem() {
    if (!newItem.trim()) return
    setLoading(true)

    try {
      let imageUrl = null

      if (newImage) {
        const session = await fetchAuthSession()
        const identityId = session.identityId
        const cleanFileName = newImage.name.replace(/\s+/g, '-')
        const fileName = `images/${identityId}/${Date.now()}-${cleanFileName}`
        await uploadData({
          path: fileName,
          data: newImage,
          options: {
            contentType: newImage.type
          }
        }).result
        imageUrl = fileName
      }

      await client.models.BucketListItem.create({
        title: newItem,
        description: newDescription,
        imageUrl: imageUrl,
        completed: false
      })

      setNewItem('')
      setNewDescription('')
      setNewImage(null)
      setImagePreview(null)
      await fetchItems()
    } catch (err) {
      console.error('Error adding item:', err)
    }

    setLoading(false)
  }

  async function toggleComplete(item) {
    await client.models.BucketListItem.update({
      id: item.id,
      completed: !item.completed
    })
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
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌍</div>
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
            🌍 My Bucket List
          </h1>
          <p style={{ color: '#4a6fa5', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
            {user?.signInDetails?.loginId || user?.username}
          </p>
        </div>
        <button onClick={handleSignOut} style={{ background: 'transparent', color: '#ff6b9d', border: '1px solid #ff6b9d', padding: '10px 22px', borderRadius: '25px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>
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

      {/* Add Item Form */}
      <div style={{ maxWidth: '650px', margin: '0 auto 25px auto', background: '#0d1b35', padding: '24px', borderRadius: '16px', border: '1px solid #1a2f55' }}>

        <p style={{ color: '#1de9b6', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px 0' }}>Add New Goal</p>

        {/* Title Input */}
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Goal title e.g. Skydiving in Switzerland"
          style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #1a2f55', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#071029', color: '#ffffff', marginBottom: '12px', boxSizing: 'border-box' }}
        />

        {/* Description Input */}
        <textarea
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          placeholder="Describe this goal... why does it matter to you?"
          rows={3}
          style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #1a2f55', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', background: '#071029', color: '#ffffff', marginBottom: '12px', boxSizing: 'border-box', resize: 'vertical' }}
        />

        {/* Image Upload */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#1de9b6', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ color: '#8aa4cc', fontSize: '0.9rem' }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ marginTop: '12px', width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #1a2f55' }}
            />
          )}
        </div>

        {/* Add Button */}
        <button
          onClick={addItem}
          disabled={loading}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: '#1de9b6', color: '#0a0f1e', fontSize: '1rem', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Saving...' : '+ Add Goal'}
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
              <li key={item.id} style={{ margin: '16px 0', background: item.completed ? 'rgba(29,233,182,0.05)' : '#0d1b35', borderRadius: '16px', border: item.completed ? '1px solid rgba(29,233,182,0.3)' : '1px solid #1a2f55', overflow: 'hidden' }}>

                {/* Item Image */}
                {item.signedImageUrl && (
                  <img
                    src={item.signedImageUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}

                {/* Item Content */}
                <div style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1rem', color: item.completed ? '#1de9b6' : '#ffffff', textDecoration: item.completed ? 'line-through' : 'none', fontWeight: '700' }}>
                      {item.completed ? '✅ ' : '🎯 '}{item.title}
                    </span>
                  </div>

                  {item.description && (
                    <p style={{ fontSize: '0.85rem', color: '#4a6fa5', margin: '0 0 14px 0', lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleComplete(item)} style={{ background: 'transparent', color: item.completed ? '#4a6fa5' : '#1de9b6', border: `1px solid ${item.completed ? '#1a2f55' : '#1de9b6'}`, padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}>
                      {item.completed ? 'Undo' : 'Done'}
                    </button>
                    <button onClick={() => deleteItem(item.id)} style={{ background: 'transparent', color: '#ff6b9d', border: '1px solid #ff6b9d', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}>
                      Delete
                    </button>
                  </div>
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}