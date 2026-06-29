export async function data(pageContext) {
    const slug = pageContext.routeParams.slug

    try {
        const resp = await fetch(`https://technext.asia/api/posts?slug=${slug}`)
        if (!resp.ok) {
            console.error(`Blog post API error for "${slug}": ${resp.status} ${resp.statusText}`)
            return { post: null }
        }
        const post = await resp.json()
        return { post }
    } catch (err) {
        console.error(`Blog post data loader failed for "${slug}":`, err.message)
        return { post: null }
    }
}
