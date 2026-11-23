"use client"

import * as React from "react"
import Link from "next/link"
import {
  CalendarDaysIcon,
  ImageIcon,
  InboxIcon,
  LaptopIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  PowerIcon,
  PowerOffIcon,
  Trash2Icon,
  WalletIcon,
} from "lucide-react"
import { cn } from "cn"

import { TuitionForm } from "@/components/tutor/tuition-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { demoTuitions } from "@/lib/tuition-demo"
import {
  approvalStatusLabels,
  toTuitionFormValues,
  toTuitionNumbers,
  tuitionModes,
  type Tuition,
  type TuitionApprovalStatus,
  type TuitionFormValues,
} from "@/lib/tuition"

const approvalStyles: Record<TuitionApprovalStatus, string> = {
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
  approved:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
  rejected:
    "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40",
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function modeLabel(mode: Tuition["mode"]) {
  return tuitionModes.find((option) => option.value === mode)?.label ?? mode
}

function ApprovalBadge({ status }: { status: TuitionApprovalStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full backdrop-blur-sm", approvalStyles[status])}
    >
      {approvalStatusLabels[status]}
    </Badge>
  )
}

function TuitionCard({
  tuition,
  onEdit,
  onToggle,
  onDelete,
}: {
  tuition: Tuition
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
}) {
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
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          <ApprovalBadge status={tuition.approvalStatus} />
          <Badge
            variant={tuition.isActive ? "secondary" : "outline"}
            className="rounded-full backdrop-blur-sm"
          >
            {tuition.isActive ? "Active" : "Closed"}
          </Badge>
        </div>
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
            {modeLabel(tuition.mode)}
          </li>
          <li className="flex items-center gap-2">
            <MapPinIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate">{tuition.location || "Online"}</span>
          </li>
        </ul>

        <p className="mt-auto text-xs text-muted-foreground">
          Posted {formatDate(tuition.createdAt)}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onEdit}>
          <PencilIcon />
          Edit
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onToggle}>
          {tuition.isActive ? <PowerOffIcon /> : <PowerIcon />}
          {tuition.isActive ? "Close" : "Activate"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2Icon />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

function MyTuitionsList() {
  // TODO: replace the demo rows with tuitions fetched for the signed-in tutor.
  const [tuitions, setTuitions] = React.useState<Tuition[]>(demoTuitions)
  const [editing, setEditing] = React.useState<Tuition | null>(null)
  const [deleting, setDeleting] = React.useState<Tuition | null>(null)

  const activeCount = tuitions.filter((tuition) => tuition.isActive).length

  function handleSave(values: TuitionFormValues, bannerUrl: string | null) {
    if (!editing) {
      return
    }

    const numbers = toTuitionNumbers(values)

    setTuitions((items) =>
      items.map((item) =>
        item.id === editing.id
          ? { ...item, ...numbers, bannerImage: bannerUrl }
          : item
      )
    )
    setEditing(null)

    toast.add({
      type: "success",
      title: "Tuition updated",
      description: "Your changes are visible on the listing.",
    })
  }

  function toggleActive(tuition: Tuition) {
    setTuitions((items) =>
      items.map((item) =>
        item.id === tuition.id ? { ...item, isActive: !item.isActive } : item
      )
    )

    toast.add({
      type: "success",
      title: tuition.isActive ? "Tuition closed" : "Tuition activated",
      description: tuition.isActive
        ? "Students can no longer apply to this post."
        : "Students can apply to this post again.",
    })
  }

  function handleDelete() {
    if (!deleting) {
      return
    }

    setTuitions((items) => items.filter((item) => item.id !== deleting.id))
    setDeleting(null)

    toast.add({
      type: "success",
      title: "Tuition deleted",
      description: "The post has been removed from your dashboard.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {tuitions.length} {tuitions.length === 1 ? "tuition" : "tuitions"} ·{" "}
          {activeCount} active
        </p>
        <Link
          href="/dashboard/tutor/post-tuition"
          className={buttonVariants({ size: "lg" })}
        >
          <PlusIcon />
          Post a tuition
        </Link>
      </div>

      {tuitions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <InboxIcon
              className="size-8 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="font-medium">No tuitions yet</p>
              <p className="text-sm text-muted-foreground">
                Post your first tuition and it will appear here while it waits
                for admin approval.
              </p>
            </div>
            <Link
              href="/dashboard/tutor/post-tuition"
              className={buttonVariants({ size: "lg" })}
            >
              <PlusIcon />
              Post a tuition
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tuitions.map((tuition) => (
            <TuitionCard
              key={tuition.id}
              tuition={tuition}
              onEdit={() => setEditing(tuition)}
              onToggle={() => toggleActive(tuition)}
              onDelete={() => setDeleting(tuition)}
            />
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
          }
        }}
      >
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit tuition</DialogTitle>
            <DialogDescription>
              Update the details students see. Admin approval status stays the
              same.
            </DialogDescription>
          </DialogHeader>

          {editing ? (
            <TuitionForm
              key={editing.id}
              initialValues={toTuitionFormValues(editing)}
              initialBannerUrl={editing.bannerImage}
              submitLabel="Save changes"
              onSubmit={handleSave}
              onCancel={() => setEditing(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this tuition?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.title}” will be removed permanently. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export { MyTuitionsList }
