import { useData } from 'vike-react/useData'

export default function Head() {
  const { role } = useData() || {}
  if (!role) {
    return <title>Role not found · TechNext</title>
  }
  return (
    <>
      <title>{role.name}{role.sub ? ` · ${role.sub}` : ''} — TechNext Careers</title>
      <meta name="description" content={role.short} />
      <meta property="og:title" content={`${role.name} · TechNext`} />
      <meta property="og:description" content={role.short} />
      <meta property="og:url" content={`https://technext.asia/jobs/${role.slug}`} />
    </>
  )
}
