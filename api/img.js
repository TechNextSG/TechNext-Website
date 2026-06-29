import http from 'http'

const IMAGE_SOURCE = 'http://must-job.com:8686/images'
const FALLBACK_REDIRECT = '/blog-featured.png'

export default async function handler(req, res) {
  const { name } = req.query

  if (!name || !/^[\w-]+\.(png|jpg|jpeg|webp)$/i.test(name)) {
    return res.status(400).json({ error: 'Invalid image name' })
  }

  const imageUrl = `${IMAGE_SOURCE}/${name}`

  try {
    const imageRes = await new Promise((resolve, reject) => {
      const request = http.get(imageUrl, resolve)
      request.on('error', reject)
      request.setTimeout(5000, () => {
        request.destroy()
        reject(new Error('Timeout'))
      })
    })

    if (imageRes.statusCode !== 200) {
      // Fallback to default image
      return res.redirect(302, FALLBACK_REDIRECT)
    }

    res.setHeader('Content-Type', imageRes.headers['content-type'] || 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800')
    res.setHeader('Access-Control-Allow-Origin', '*')

    imageRes.pipe(res)
  } catch (err) {
    console.error('Image proxy error:', err.message)
    // Fallback to default image instead of 500
    return res.redirect(302, FALLBACK_REDIRECT)
  }
}
