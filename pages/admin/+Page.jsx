import { useState, useEffect } from 'react'
import { marked } from 'marked'

export { Page }

function Page() {
  const [key, setKey] = useState(localStorage.getItem('admin_key') || '')
  const [authed, setAuthed] = useState(false)
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null) // null = list, 'new' = new, {post} = editing
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', cover_image: '', tag: 'TECH BLOG', author: 'TechNext Team', published: false, featured: false })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [preview, setPreview] = useState(false)

  const headers = { 'Content-Type': 'application/json', 'x-admin-key': key }

  function login() {
    localStorage.setItem('admin_key', key)
    setAuthed(true)
    loadPosts()
  }

  async function loadPosts() {
    const r = await fetch('/api/admin/posts', { headers })
    if (r.status === 401) { setAuthed(false); return }
    const data = await r.json()
    setPosts(data)
  }

  async function initDB() {
    const r = await fetch('/api/admin/posts?action=init', { headers })
    const data = await r.json()
    setMsg(data.message || 'Done')
    loadPosts()
  }

  async function savePost() {
    setSaving(true)
    setMsg('')
    const method = editing === 'new' ? 'POST' : 'PUT'
    const body = editing === 'new' ? form : { ...form, id: editing.id }

    const r = await fetch('/api/admin/posts', { method, headers, body: JSON.stringify(body) })
    const data = await r.json()

    if (r.ok) {
      setMsg('\u2705 Saved!')
      setEditing(null)
      loadPosts()
    } else {
      setMsg(`\u274C ${data.error}`)
    }
    setSaving(false)
  }

  async function deletePost(id) {
    if (!confirm('Delete this post?')) return
    await fetch('/api/admin/posts', { method: 'DELETE', headers, body: JSON.stringify({ id }) })
    loadPosts()
  }

  function editPost(post) {
    // Need to fetch full content
    fetch(`/api/posts?slug=${post.slug}`).then(r => r.json()).then(full => {
      setForm({
        title: full.title || '',
        excerpt: full.excerpt || '',
        content: full.content || '',
        cover_image: full.cover_image || '',
        tag: full.tag || 'TECH BLOG',
        author: full.author || 'TechNext Team',
        published: full.published || false,
        featured: full.featured || false,
      })
      setEditing(post)
    })
  }

  function newPost() {
    setForm({ title: '', excerpt: '', content: '', cover_image: '', tag: 'TECH BLOG', author: 'TechNext Team', published: false, featured: false })
    setEditing('new')
    setPreview(false)
  }

  useEffect(() => { if (authed) loadPosts() }, [authed])

  // -- Login Screen --
  if (!authed) {
    return (
      <div className="page admin-page">
        <div className="admin-login">
          <h1>{'\u{1F510}'} Blog Admin</h1>
          <p>Enter your admin key to continue</p>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Admin Key"
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          <button onClick={login} className="btn-primary">Login</button>
        </div>
        <style>{adminStyles}</style>
      </div>
    )
  }

  // -- Editor --
  if (editing !== null) {
    return (
      <div className="page admin-page">
        <div className="admin-container">
          <div className="admin-header">
            <h1>{editing === 'new' ? '\u{270D}\u{FE0F} New Post' : '\u{270F}\u{FE0F} Edit Post'}</h1>
            <button onClick={() => setEditing(null)} className="btn-ghost">{'\u2190'} Back</button>
          </div>

          <div className="editor-layout">
            <div className="editor-form">
              <label>Title</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Post title..." />

              <label>Excerpt</label>
              <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Short description..." rows={2} />

              <label>Cover Image URL</label>
              <input value={form.cover_image} onChange={e => setForm({...form, cover_image: e.target.value})} placeholder="https://..." />

              <div className="editor-row">
                <div>
                  <label>Tag</label>
                  <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})}>
                    {['TECH BLOG', 'INSIGHTS', 'CASE STUDY', 'TECHNOLOGY', 'INDUSTRY', 'DESIGN'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Author</label>
                  <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
                </div>
              </div>

              <div className="editor-row">
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} />
                  Published
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                  Featured
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
                <label>Content (Markdown)</label>
                <button onClick={() => setPreview(!preview)} className="btn-ghost btn-sm">
                  {preview ? '\u{270F}\u{FE0F} Edit' : '\u{1F441}\u{FE0F} Preview'}
                </button>
              </div>

              {preview ? (
                <div
                  className="preview-box"
                  dangerouslySetInnerHTML={{ __html: marked.parse(form.content || '') }}
                />
              ) : (
                <textarea
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  placeholder="Write your post in Markdown..."
                  rows={20}
                  className="editor-content"
                />
              )}

              <div className="editor-actions">
                <button onClick={savePost} disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : '\u{1F4BE} Save Post'}
                </button>
                <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              </div>
              {msg && <div className="msg">{msg}</div>}
            </div>
          </div>
        </div>
        <style>{adminStyles}</style>
      </div>
    )
  }

  // -- Post List --
  return (
    <div className="page admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>{'\u{1F4DD}'} Blog Admin</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={initDB} className="btn-ghost btn-sm">{'\u{1F5C4}\u{FE0F}'} Init DB</button>
            <button onClick={newPost} className="btn-primary">+ New Post</button>
          </div>
        </div>

        {msg && <div className="msg">{msg}</div>}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tag</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
                No posts yet. Click "+ New Post" or "Init DB" first.
              </td></tr>
            ) : posts.map(p => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                  {p.featured && <span className="badge featured">{'\u2605'}</span>}
                </td>
                <td><span className="badge">{p.tag}</span></td>
                <td>
                  <span className={`status ${p.published ? 'published' : 'draft'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => editPost(p)} className="btn-ghost btn-sm">{'\u{270F}\u{FE0F}'}</button>
                    {p.published && <a href={`/blog/${p.slug}`} target="_blank" className="btn-ghost btn-sm">{'\u{1F441}\u{FE0F}'}</a>}
                    <button onClick={() => deletePost(p.id)} className="btn-ghost btn-sm btn-danger">{'\u{1F5D1}\u{FE0F}'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{adminStyles}</style>
    </div>
  )
}

const adminStyles = `
  .admin-page { min-height: 80vh; }
  .admin-login {
    max-width: 360px;
    margin: 80px auto;
    text-align: center;
    padding: var(--spacing-3xl);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xl);
  }
  .admin-login h1 { margin-bottom: var(--spacing-sm); }
  .admin-login p { color: var(--color-text-muted); margin-bottom: var(--spacing-xl); font-size: var(--font-size-sm); }
  .admin-login input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text-primary);
    font-size: 1rem;
    margin-bottom: var(--spacing-md);
  }
  .admin-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: var(--spacing-3xl) var(--spacing-xl);
  }
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }
  .admin-header h1 { font-size: var(--font-size-xl); }
  .btn-primary {
    padding: 10px 24px;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: opacity 0.2s;
  }
  .btn-primary:hover { opacity: 0.85; }
  .btn-primary:disabled { opacity: 0.5; }
  .btn-ghost {
    padding: 8px 16px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }
  .btn-ghost:hover { border-color: var(--color-primary); color: var(--color-primary); }
  .btn-sm { padding: 4px 10px; font-size: 13px; }
  .btn-danger:hover { border-color: var(--color-red, #dc3545); color: var(--color-red, #dc3545); }
  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
  }
  .admin-table th {
    text-align: left;
    padding: 12px 16px;
    border-bottom: 2px solid var(--color-border);
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .admin-table td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--color-border);
    vertical-align: middle;
  }
  .admin-table tr:hover { background: var(--color-bg-tertiary); }
  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    background: var(--color-bg-tertiary);
    color: var(--color-text-muted);
  }
  .badge.featured { background: #fef3c7; color: #d97706; margin-left: 8px; }
  .status {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 12px;
  }
  .status.published { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
  .status.draft { background: rgba(234, 179, 8, 0.1); color: #eab308; }
  .action-buttons { display: flex; gap: 4px; }
  .msg {
    padding: 12px 16px;
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-md);
    margin: var(--spacing-md) 0;
    font-size: var(--font-size-sm);
  }

  /* Editor */
  .editor-layout { max-width: 800px; }
  .editor-form label {
    display: block;
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: var(--spacing-md) 0 var(--spacing-xs);
  }
  .editor-form input, .editor-form textarea, .editor-form select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-family: inherit;
  }
  .editor-form input:focus, .editor-form textarea:focus, .editor-form select:focus {
    outline: none;
    border-color: var(--color-primary);
  }
  .editor-content {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 14px !important;
    line-height: 1.7;
    resize: vertical;
    min-height: 400px;
  }
  .editor-row {
    display: flex;
    gap: var(--spacing-lg);
    align-items: center;
  }
  .editor-row > div { flex: 1; }
  .checkbox-label {
    display: flex !important;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    text-transform: none !important;
    font-size: var(--font-size-sm) !important;
  }
  .checkbox-label input[type="checkbox"] {
    width: auto;
    cursor: pointer;
  }
  .editor-actions {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--color-border);
  }
  .preview-box {
    padding: var(--spacing-lg);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    min-height: 400px;
    line-height: 1.8;
    font-size: var(--font-size-sm);
  }
  .preview-box h2 { margin: var(--spacing-lg) 0 var(--spacing-sm); font-size: var(--font-size-lg); }
  .preview-box h3 { margin: var(--spacing-md) 0 var(--spacing-xs); }
  .preview-box p { margin-bottom: var(--spacing-md); }
  .preview-box ul, .preview-box ol { margin: var(--spacing-sm) 0 var(--spacing-md) var(--spacing-lg); }
  .preview-box blockquote {
    border-left: 3px solid var(--color-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-tertiary);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    margin: var(--spacing-md) 0;
  }
  .preview-box pre {
    background: var(--color-bg-tertiary);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    overflow-x: auto;
  }
  .preview-box code { background: var(--color-bg-tertiary); padding: 2px 6px; border-radius: 4px; }
  .preview-box pre code { background: none; padding: 0; }
`
