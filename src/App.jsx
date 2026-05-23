import { useState, useEffect } from 'react'
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/data'
import '@aws-amplify/ui-react/styles.css'
import { authTheme } from './theme'

const client = generateClient()

function AuthBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 30%, #ffa000 60%, #ffb300 100%)',
      zIndex: -1,
      overflow: 'hidden'
    }}>
      {/* Large circle top left */}
      <div style={{
        position: 'absolute',
        top: '-80px', left: '-80px',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)'
      }}/>
      {/* Medium circle bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '-60px', right: '-60px',
        width: '250px', height: '250px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)'
      }}/>
      {/* Small circle top right */}
      <div style={{
        position: 'absolute',
        top: '80px', right: '120px',
        width: '120px', height: '120px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)'
      }}/>
      {/* Tiny circle middle left */}
      <div style={{
        position: 'absolute',
        top: '45%', left: '8%',
        width: '70px', height: '70px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)'
      }}/>
      {/* Rectangle shape */}
      <div style={{
        position: 'absolute',
        bottom: '15%', left: '10%',
        width: '120px', height: '120px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.07)',
        transform: 'rotate(45deg)'
      }}/>
      {/* Triangle shape top center */}
      <div style={{
        position: 'absolute',
        top: '10%', left: '45%',
        width: '0', height: '0',
        borderLeft: '40px solid transparent',
        borderRight: '40px solid transparent',
        borderBottom: '70px solid rgba(255,255,255,0.08)'
      }}/>
      {/* Small square bottom center */}
      <div style={{
        position: 'absolute',
        bottom: '25%', right: '15%',
        width: '60px', height: '60px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.1)',
        transform: 'rotate(20deg)'
      }}/>
    </div>
  )
}

function App() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchItems() {
    const result = await client.models.BucketListItem.list()
    setItems(result.data)
  }

  async function addItem() {
    if (!newItem.trim()) return
    setLoading(true)
    await client.models.BucketListItem.create({
      title: newItem,
      completed: false
    })
    setNewItem('')
    await fetchItems()
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

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <ThemeProvider theme={authTheme}>
      <Authenticator
        components={{
          Header() {
            return (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px 10px 20px'
              }}>
                <div style={{ fontSize: '3rem' }}>🪣</div>
                <h1 style={{
                  color: '#e65100',
                  fontSize: '1.8rem',
                  margin: '10px 0 5px 0',
                  fontFamily: "'Segoe UI', sans-serif"
                }}>
                  Bucket List Tracker
                </h1>
                <p style={{
                  color: '#fb8c00',
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  Track your life goals in one place
                </p>
              </div>
            )
          }
        }}
      >
        {({ signOut, user }) => (
          <div style={{
            minHeight: '100vh',
            background: '#ffffff',
            padding: '40px 20px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}>

            {/* Header */}
            <div style={{
              maxWidth: '650px',
              margin: '0 auto 30px auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
              padding: '20px 30px',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(251, 140, 0, 0.15)',
              border: '1px solid #ffcc80'
            }}>
              <div>
                <h1 style={{
                  color: '#e65100',
                  fontSize: '2rem',
                  margin: 0
                }}>
                  🪣 My Bucket List
                </h1>
                <p style={{
                  color: '#fb8c00',
                  margin: '5px 0 0 0',
                  fontSize: '0.9rem'
                }}>
                  {user?.signInDetails?.loginId}
                </p>
              </div>
              <button
                onClick={signOut}
                style={{
                  background: 'linear-gradient(135deg, #fb8c00 0%, #e65100 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(251, 140, 0, 0.4)'
                }}
              >
                Sign Out
              </button>
            </div>

            {/* Stats */}
            <div style={{
              maxWidth: '650px',
              margin: '0 auto 25px auto',
              display: 'flex',
              gap: '15px'
            }}>
              <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #fb8c00 0%, #e65100 100%)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(251, 140, 0, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                  {items.length}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                  Total Goals
                </div>
              </div>
              <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                  {items.filter(i => i.completed).length}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                  Completed
                </div>
              </div>
              <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                  {items.filter(i => !i.completed).length}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                  Remaining
                </div>
              </div>
            </div>

            {/* Add Item Input */}
            <div style={{
              maxWidth: '650px',
              margin: '0 auto 25px auto',
              display: 'flex',
              gap: '10px',
              background: '#fff8f0',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #ffcc80',
              boxShadow: '0 4px 20px rgba(251, 140, 0, 0.08)'
            }}>
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addItem()}
                placeholder="Add a new bucket list item..."
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '2px solid #ffcc80',
                  fontSize: '1rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  background: 'white'
                }}
              />
              <button
                onClick={addItem}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #fb8c00 0%, #e65100 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 15px rgba(251, 140, 0, 0.4)'
                }}
              >
                {loading ? '...' : '+ Add Goal'}
              </button>
            </div>

            {/* Items List */}
            <div style={{
              maxWidth: '650px',
              margin: '0 auto'
            }}>
              {items.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '50px',
                  background: '#fff8f0',
                  borderRadius: '16px',
                  border: '1px solid #ffcc80',
                  color: '#fb8c00'
                }}>
                  <div style={{ fontSize: '3rem' }}>🌟</div>
                  <p style={{ fontSize: '1.1rem' }}>
                    No goals yet! Add your first bucket list item above.
                  </p>
                </div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {items.map(item => (
                    <li key={item.id} style={{
                      padding: '18px 22px',
                      margin: '12px 0',
                      background: item.completed ? '#f0fff4' : 'white',
                      borderRadius: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: item.completed
                        ? '2px solid #9ae6b4'
                        : '2px solid #ffcc80',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    }}>
                      <span style={{
                        fontSize: '1rem',
                        color: item.completed ? '#48bb78' : '#2d3748',
                        textDecoration: item.completed ? 'line-through' : 'none',
                        fontWeight: '500'
                      }}>
                        {item.completed ? '✅ ' : '🎯 '}{item.title}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => toggleComplete(item)}
                          style={{
                            background: item.completed ? 'white' : '#fb8c00',
                            color: item.completed ? '#fb8c00' : 'white',
                            border: '2px solid #fb8c00',
                            padding: '7px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}
                        >
                          {item.completed ? 'Undo' : 'Done'}
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          style={{
                            background: 'white',
                            color: '#fc8181',
                            border: '2px solid #fc8181',
                            padding: '7px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}
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
        )}
      </Authenticator>
      <AuthBackground />
    </ThemeProvider>
  )
}

export default App