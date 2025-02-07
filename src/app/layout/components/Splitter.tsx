/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { cn } from "../../../utils/helper/object"

const Splitter = ({
    id = 'drag-bar',
    dir,
    isDragging,
    ...props
  }: any) => {
    const [isFocused, setIsFocused] = useState(false)
  
    return (
      <div
        id={id}
        data-testid={id}
        tabIndex={0}
        className={cn(
          'flex-shrink-0 bg-base-300 transition-colors',
          dir === 'horizontal' ? 'cursor-row-resize h-1' : 'cursor-col-resize w-1',
          (isDragging || isFocused) && 'bg-accent',
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    )
  }
  
  export default Splitter
  