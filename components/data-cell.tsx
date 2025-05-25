'use client'

import React from 'react'
import { TableCell } from '@/components/ui/table'
import IconRenderer from './icon-renderer'

interface DataCellProps {
  value: string | number | boolean | undefined | null | object
  icon: string | undefined
}

const DataCell: React.FC<DataCellProps> = ({ value, icon }) => {
  let displayValue: React.ReactNode
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    displayValue = String(value)
  } else if (value === null || value === undefined) {
    displayValue = '-'
  } else {
    displayValue = '[...]' // Placeholder for arrays/objects not meant for direct display
  }

  return (
    <TableCell className="p-3 whitespace-nowrap text-sm text-gray-800 bg-white">
      <div className="flex items-center gap-2">
        {icon && <IconRenderer iconName={icon} />}
        <span>{displayValue}</span>
      </div>
    </TableCell>
  )
}

export default DataCell
