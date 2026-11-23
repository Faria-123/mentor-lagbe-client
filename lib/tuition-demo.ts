import type { Tuition } from "@/lib/tuition"

// Placeholder rows so the tutor dashboard can be built before the tuition API
// exists. Replace with data fetched for the signed-in tutor.
export const demoTuitions: Tuition[] = [
  {
    id: "demo-tuition-1",
    title: "HSC Higher Math batch in Dhanmondi",
    subject: "Higher Mathematics",
    classLevel: "HSC",
    mode: "offline",
    location: "Dhanmondi, Dhaka",
    monthlyFee: 4000,
    daysPerWeek: 3,
    description:
      "Covers the full HSC Higher Math syllabus with weekly problem-solving drills, model tests and past-paper practice for the 2027 board exam.",
    bannerImage: "/images/hero/tutoring-session.jpg",
    approvalStatus: "approved",
    isActive: true,
    tutorId: "demo-tutor",
    createdAt: "2026-11-18T09:15:00.000Z",
  },
  {
    id: "demo-tuition-2",
    title: "Physics Olympiad preparation (online)",
    subject: "Physics",
    classLevel: "Class 9-10",
    mode: "online",
    location: "",
    monthlyFee: 2500,
    daysPerWeek: 2,
    description:
      "Small-group online sessions focused on Olympiad-style mechanics and electricity problems, with weekly assignments and doubt-clearing calls.",
    bannerImage: null,
    approvalStatus: "pending",
    isActive: true,
    tutorId: "demo-tutor",
    createdAt: "2026-11-21T11:40:00.000Z",
  },
  {
    id: "demo-tuition-3",
    title: "Class 9-10 English grammar crash course",
    subject: "English",
    classLevel: "Class 9-10",
    mode: "offline",
    location: "Mirpur, Dhaka",
    monthlyFee: 3000,
    daysPerWeek: 2,
    description:
      "A focused eight-week course on grammar, composition and unseen passages, built around the school board question patterns.",
    bannerImage: "/images/hero/tutoring-session.jpg",
    approvalStatus: "approved",
    isActive: false,
    tutorId: "demo-tutor",
    createdAt: "2026-10-30T15:05:00.000Z",
  },
  {
    id: "demo-tuition-4",
    title: "Admission test model tests — BUET/CUET",
    subject: "Mathematics & Physics",
    classLevel: "Admission test",
    mode: "both",
    location: "Farmgate, Dhaka",
    monthlyFee: 5000,
    daysPerWeek: 4,
    description:
      "Full-length admission model tests every week with written and MCQ practice, followed by one-to-one review sessions online.",
    bannerImage: null,
    approvalStatus: "rejected",
    isActive: false,
    tutorId: "demo-tutor",
    createdAt: "2026-11-10T17:30:00.000Z",
  },
]
