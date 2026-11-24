import type { TuitionFormValues } from "@/lib/tuition"

export const createTuition = async (data: TuitionFormValues) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuitions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const browsJobs = async (query = "") => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuitions?${query}`);
  return res.json();

}