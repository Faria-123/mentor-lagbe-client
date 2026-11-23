import { NextResponse } from "next/server"

const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload"
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/**
 * Uploads a single image to ImgBB and returns its public URL.
 * The key stays on the server; the form posts here instead of to ImgBB directly.
 */
export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Image upload is not configured. Add IMGBB_API_KEY to .env." },
      { status: 503 }
    )
  }

  const formData = await request.formData()
  const image = formData.get("image")

  if (!(image instanceof File)) {
    return NextResponse.json(
      { error: "Choose an image to upload." },
      { status: 400 }
    )
  }

  if (!image.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed." },
      { status: 400 }
    )
  }

  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Keep the image under 5 MB." },
      { status: 400 }
    )
  }

  const body = new FormData()
  body.append("image", image)

  try {
    const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${apiKey}`, {
      method: "POST",
      body,
    })

    const data = (await response.json()) as {
      data?: { display_url?: string; url?: string }
      error?: { message?: string }
    }

    const url = data.data?.display_url ?? data.data?.url

    if (!response.ok || !url) {
      return NextResponse.json(
        { error: data.error?.message ?? "ImgBB rejected the upload." },
        { status: 502 }
      )
    }

    return NextResponse.json({ url })
  } catch {
    return NextResponse.json(
      { error: "Could not reach ImgBB. Try again." },
      { status: 502 }
    )
  }
}
