'use client'

import React from 'react'
import { TableCell } from '@/components/ui/table'

import { cn } from '@/lib/utils'

interface StickyShadowCellProps {
  children: React.ReactNode
  showShadow: boolean
}

const StickyShadowCell: React.FC<StickyShadowCellProps> = ({
  children,
  showShadow,
}) => {
  return (
    <TableCell className={`sticky right-0 p-0 overflow-hidden bg-transparent`}>
      {/* This inner div is crucial for the clipped shadow effect. 
          It gets the padding and the shadow. The shadow is applied to an element
          that is slightly taller than its clipping parent (TableCell), so the 
          top and bottom parts of the shadow are cut off by TableCell's overflow:hidden.
          It also has a margin-left so that the shadow is not cut off by the table cell.
      */}
      <div
        className={cn(
          'transition-shadow duration-200 ease-in-out -my-1 py-1 ml-1',
          showShadow && 'shadow-[-5px_0_5px_-5px_rgba(0,0,0,0.1)]'
        )}
      >
        {/* The actual content is placed inside another div to ensure padding applies correctly 
            relative to the shadow-casting div's new internal height, not just the children. */}
        <div className="flex items-center justify-end bg-white">{children}</div>
      </div>
    </TableCell>
  )
}

export default StickyShadowCell
