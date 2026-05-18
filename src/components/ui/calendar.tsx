
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "space-y-4",
        month_caption: "flex justify-center items-center pt-1 px-2 relative min-h-9",
        caption_label: "text-sm font-semibold text-slate-800",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "absolute left-2 h-7 w-7 border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "absolute right-2 h-7 w-7 border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "w-9 text-[0.8rem] font-medium text-slate-500 rounded-md",
        week: "flex w-full mt-2",
        day: "relative h-9 w-9 p-0 text-center text-sm [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "h-9 w-9 rounded-md p-0 font-normal text-slate-700 aria-selected:opacity-100 hover:bg-teal-50"
        ),
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected:
          "bg-teal-600 text-white hover:bg-teal-600 hover:text-white focus:bg-teal-600 focus:text-white",
        today: "bg-amber-50 text-amber-700 font-semibold",
        outside:
          "day-outside text-slate-300 aria-selected:bg-slate-100 aria-selected:text-slate-400",
        disabled: "text-slate-300 opacity-50",
        range_middle:
          "aria-selected:bg-teal-50 aria-selected:text-teal-700",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" {...iconProps} />
          ) : (
            <ChevronRight className="h-4 w-4" {...iconProps} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
