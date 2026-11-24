const FALLBACK_MAX_DATA_URL_LENGTH = 88_000

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Could not read the image."))
    reader.readAsDataURL(file)
  })
}

/**
 * Downscales and re-encodes the image until it is small enough to store in a
 * MongoDB document through the API's default 100kb JSON body limit.
 */
async function compressToDataUrl(file: File) {
  const source = await readAsDataUrl(file)

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image()
    element.onload = () => resolve(element)
    element.onerror = () => reject(new Error("Could not read the image."))
    element.src = source
  })

  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  if (!context) {
    return source
  }

  let maxSide = 1024
  let quality = 0.82
  let dataUrl = source

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))

    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    dataUrl = canvas.toDataURL("image/jpeg", quality)

    if (dataUrl.length <= FALLBACK_MAX_DATA_URL_LENGTH) {
      break
    }

    maxSide = Math.max(320, Math.round(maxSide * 0.8))
    quality = Math.max(0.4, quality - 0.08)
  }

  return dataUrl
}

/**
 * Sends a banner image to our `/api/upload` route, which forwards it to ImgBB
 * with the server-side key. Resolves to the public image URL.
 *
 * When ImgBB is not configured (503), the image is compressed and returned as
 * a data URL so a posted tuition still shows its banner in local development.
 */
export async function uploadBannerImage(file: File): Promise<string> {
  const body = new FormData()
  body.append("image", file)

  const response = await fetch("/api/upload", { method: "POST", body })

  if (response.status === 503) {
    return compressToDataUrl(file)
  }

  const data = (await response.json().catch(() => null)) as {
    url?: string
    error?: string
  } | null

  if (!response.ok || !data?.url) {
    throw new Error(data?.error ?? "Could not upload the image. Try again.")
  }

  return data.url
}
