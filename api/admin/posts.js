import { neon } from '@neondatabase/serverless';

function auth(req) {
  const key = req.headers['x-admin-key'] || req.headers['authorization']?.replace('Bearer ', '');
  if (!key || key !== process.env.ADMIN_KEY) {
    return false;
  }
  return true;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default async function handler(req, res) {
  if (!auth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const sql = neon(process.env.POSTGRES_URL);

  // ─── INIT: Create tables ───────────────────────────────────────────────
  if (req.method === 'GET' && req.query.action === 'init') {
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        excerpt TEXT,
        content TEXT,
        cover_image VARCHAR(500),
        tag VARCHAR(100) DEFAULT 'TECH BLOG',
        author VARCHAR(200) DEFAULT 'TechNext Team',
        published BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    return res.status(200).json({ message: 'Tables created successfully' });
  }

  // ─── GET: List all posts (including drafts) ────────────────────────────
  if (req.method === 'GET') {
    const rows = await sql`
      SELECT id, slug, title, excerpt, tag, author, published, featured, created_at, updated_at
      FROM posts ORDER BY created_at DESC
    `;
    return res.status(200).json(rows);
  }

  // ─── POST: Create post ────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { title, excerpt, content, cover_image, tag, author, published, featured } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (title.length > 500) {
      return res.status(400).json({ error: 'Title too long (max 500 chars)' });
    }

    if (content.length > 100000) {
      return res.status(400).json({ error: 'Content too long (max 100,000 chars)' });
    }

    const slug = slugify(title);

    const rows = await sql`
      INSERT INTO posts (slug, title, excerpt, content, cover_image, tag, author, published, featured)
      VALUES (${slug}, ${title}, ${excerpt || ''}, ${content}, ${cover_image || ''}, ${tag || 'TECH BLOG'}, ${author || 'TechNext Team'}, ${published || false}, ${featured || false})
      RETURNING *
    `;

    return res.status(201).json(rows[0]);
  }

  // ─── PUT: Update post ─────────────────────────────────────────────────
  if (req.method === 'PUT') {
    const { id, title, excerpt, content, cover_image, tag, author, published, featured } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    if (title && title.length > 500) {
      return res.status(400).json({ error: 'Title too long (max 500 chars)' });
    }

    if (content && content.length > 100000) {
      return res.status(400).json({ error: 'Content too long (max 100,000 chars)' });
    }

    const slug = title ? slugify(title) : undefined;

    const rows = await sql`
      UPDATE posts SET
        title = COALESCE(${title}, title),
        slug = COALESCE(${slug}, slug),
        excerpt = COALESCE(${excerpt}, excerpt),
        content = COALESCE(${content}, content),
        cover_image = COALESCE(${cover_image}, cover_image),
        tag = COALESCE(${tag}, tag),
        author = COALESCE(${author}, author),
        published = COALESCE(${published}, published),
        featured = COALESCE(${featured}, featured),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.status(200).json(rows[0]);
  }

  // ─── DELETE: Delete post ──────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const { id } = req.body || req.query;

    if (!id) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    await sql`DELETE FROM posts WHERE id = ${parseInt(id)}`;
    return res.status(200).json({ message: 'Post deleted' });
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
