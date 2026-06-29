import { ROLES } from '../../../src/data/careers'

export async function data(pageContext) {
  const slug = pageContext.routeParams.slug
  const role = ROLES.find((r) => r.slug === slug) || null
  return { role }
}
