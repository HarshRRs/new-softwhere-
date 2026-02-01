export const extractTextFromPdf = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/profile/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()
  return data.text || ""
}
