import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Optimized Skeleton Component
 * - Implements will-change to offload pulse animation to GPU.
 * - Added aria-hidden to prevent hydration noise for screen readers.
 * - Used React.forwardRef for consistent component architecture.
 */
const Skeleton = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        aria-hidden="true"
        className={cn(
          "bg-muted/50 animate-pulse rounded-md", 
          "will-change-opacity", // Performance optimization
          className
        )}
        {...props}
      />
    )
  }
)

Skeleton.displayName = "Skeleton"

export { Skeleton }