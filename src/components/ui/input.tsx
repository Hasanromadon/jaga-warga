import * as React from "react"

import { cn } from "@/lib/utils"


function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  // Custom file input label for Indonesian
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (type === "file" && inputRef.current) {
      // Try to set the file input button label (works in Chromium browsers)
      inputRef.current.setAttribute("data-file-button-label", "Pilih Berkas");
    }
  }, [type]);
  return (
    <input
      ref={inputRef}
      type={type}
      data-slot="input"
      className={cn(
        // File input button: blue, rounded, bold, pointer, no conflicting classes
        "file:bg-blue-50 file:text-blue-700 file:rounded-md file:px-3 file:py-1 file:border file:border-blue-200 file:font-semibold file:cursor-pointer file:text-sm placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
      // This attribute is for styling, but browsers don't support changing the label natively
      // so we style the button and use aria-label/title for accessibility
      aria-label={type === "file" ? "Pilih Berkas" : undefined}
      title={type === "file" ? "Pilih Berkas" : undefined}
    />
  )
}

export { Input }
