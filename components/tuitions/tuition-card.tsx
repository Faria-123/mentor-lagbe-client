import {
  CalendarDaysIcon,
  ImageIcon,
  LaptopIcon,
  MapPinIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  formatTuitionDate,
  tuitionModeLabel,
  type Tuition,
} from "@/lib/tuition"

function TuitionCard({ tuition }: { tuition: Tuition }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="relative">
        {tuition.bannerImage ? (
          // Banner URLs are user uploads, not build-time assets.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tuition.bannerImage}
            alt={`${tuition.title} banner`}
            className="h-40 w-full object-cover"
          />
        ) : (
          <div className="flex h-40 items-center justify-center bg-muted/40 text-muted-foreground">
            <ImageIcon className="size-6" aria-hidden="true" />
          </div>
        )}
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 rounded-full backdrop-blur-sm"
        >
          Active
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{tuition.title}</CardTitle>
        <CardDescription>
          {tuition.subject} · {tuition.classLevel}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {tuition.description}
        </p>

        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <WalletIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            ৳{tuition.monthlyFee.toLocaleString("en-US")}/month
          </li>
          <li className="flex items-center gap-2">
            <CalendarDaysIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            {tuition.daysPerWeek} days/week
          </li>
          <li className="flex items-center gap-2">
            <LaptopIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            {tuitionModeLabel(tuition.mode)}
          </li>
          <li className="flex items-center gap-2">
            <MapPinIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate">{tuition.location || "Online"}</span>
          </li>
        </ul>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        Posted {formatTuitionDate(tuition.createdAt)}
      </CardFooter>
    </Card>
  )
}

export { TuitionCard }
