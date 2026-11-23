/**
 * Sends a banner image to our `/api/upload` route, which forwards it to ImgBB
 * with the server-side key. Resolves to the public image URL.
 */
export async function uploadBannerImage(file: File): Promise<string> {
  const body = new FormData()
  body.append("image", file)

  const response = await fetch("/api/upload", { method: "POST", body })
  const data = (await response.json().catch(() => null)) as {
    url?: string
    error?: string
  } | null

  if (!response.ok || !data?.url) {
    throw new Error(data?.error ?? "Could not upload the image. Try again.")
  }

  return data.url
}
