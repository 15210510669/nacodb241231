export const replaceUrlsWithLink = (text: string): boolean | string => {
  if (!text) {
    return false
  }

  const rawText = text.toString()
  let found = false
  const out = rawText.replace(/URI::\((.*?)\)/g, (_, url) => {
    found = true
    const a = document.createElement('a')
    a.textContent = url
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    return a.outerHTML
  })

  return found && out
}
