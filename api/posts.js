import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.POSTGRES_URL);

  // ─── GET: List posts or get single post ────────────────────────────────
  if (req.method === 'GET') {
    const { slug, tag, page = 1, limit = 20 } = req.query;

    // Single post by slug
    if (slug) {
      const rows = await sql`
        SELECT * FROM posts WHERE slug = ${slug} AND published = true LIMIT 1
      `;
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      return res.status(200).json(rows[0]);
    }

    // List posts
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let rows;
    if (tag) {
      rows = await sql`
        SELECT id, slug, title, excerpt, cover_image, tag, author, featured, created_at
        FROM posts
        WHERE published = true AND tag = ${tag}
        ORDER BY featured DESC, created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `;
    } else {
      rows = await sql`
        SELECT id, slug, title, excerpt, cover_image, tag, author, featured, created_at
        FROM posts
        WHERE published = true
        ORDER BY featured DESC, created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `;
    }

    // Get total count
    const countResult = tag
      ? await sql`SELECT COUNT(*) as total FROM posts WHERE published = true AND tag = ${tag}`
      : await sql`SELECT COUNT(*) as total FROM posts WHERE published = true`;

    const total = parseInt(countResult[0].total);

    return res.status(200).json({
      posts: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  }

  res.setHeader('Allow', 'GET');
  return res.status(405).json({ error: 'Method not allowed' });
}
