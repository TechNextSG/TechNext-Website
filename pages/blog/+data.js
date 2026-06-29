export async function data(pageContext) {
    const page = pageContext.urlParsed?.search?.page || 1

    const params = new URLSearchParams()
    params.set('page', page)
    params.set('limit', '12')

    try {
        const resp = await fetch(`https://technext.asia/api/posts?${params}`)
        if (!resp.ok) {
            console.error(`Blog listing API error: ${resp.status} ${resp.statusText}`)
            return { posts: [], pagination: null }
        }
        const result = await resp.json()
        return {
            posts: result.posts || [],
            pagination: result.pagination || null,
        }
    } catch (err) {
        console.error('Blog listing data loader failed:', err.message)
        return { posts: [], pagination: null }
    }
}
