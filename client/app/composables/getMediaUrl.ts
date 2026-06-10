const getMediaUrl = (url?: string | null, baseUrl?: string) => {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${baseUrl}${url}`
}

export default getMediaUrl
