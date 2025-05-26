'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { TableData, TableColumn, TableRow as RowType } from '@/lib/types'
import { Table, TableBody, TableRow } from '@/components/ui/table'
import DataCell from './data-cell'
import StickyShadowCell from './sticky-shadow-cell'
import ActionsRenderer from './actions-renderer'

import { cn } from '@/lib/utils'

interface TableDisplayProps {
  tableData: TableData
  isStale?: boolean
}

export default function TableDisplay({
  tableData,
  isStale,
}: TableDisplayProps) {
  const [isScrolledToRight, setIsScrolledToRight] = useState(true)
  const scrollContainerRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const isAtRight =
        container.scrollWidth - container.scrollLeft <=
        container.clientWidth + 2
      setIsScrolledToRight(isAtRight)
    }

    handleScroll()
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [tableData])

  if (!tableData || !tableData.rows || tableData.rows.length === 0) {
    return null
  }

  return (
    <div className={cn('w-full', isStale && 'opacity-50 pointer-events-none')}>
      {tableData.title && (
        <h2 className="font-medium text-sm leading-5 tracking-normal text-black/50 mb-3">
          {tableData.title}
        </h2>
      )}
      <div className="rounded-lg border border-white/20 bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table ref={scrollContainerRef} className="bg-white">
            <TableBody>
              {tableData.rows.map((row: RowType, rowIndex: number) => (
                <TableRow
                  key={rowIndex}
                  className="h-14 border-b border-black/10 last:border-b-0 overflow-y-hidden"
                >
                  {tableData.columns.map(
                    (column: TableColumn, colIndex: number) => (
                      <DataCell
                        key={`${column.key}-${colIndex}`}
                        value={row[column.key]}
                        icon={row[`${column.key}_icon`] as string | undefined}
                      />
                    )
                  )}
                  <StickyShadowCell showShadow={!isScrolledToRight}>
                    <ActionsRenderer actions={row.actions} />
                  </StickyShadowCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
