'use client'

import React from 'react'
import type { Action as ActionType } from '@/lib/types'
import { TableCell } from '@/components/ui/table'
import IconRenderer from './icon-renderer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface ActionsCellProps {
  actions: ActionType[]
  isScrolledToRight: boolean
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  actions,
  isScrolledToRight,
}) => {
  const primaryActions = actions.filter((action) => action.primary)
  const secondaryActions = actions.filter((action) => !action.primary)

  return (
    <TableCell className="sticky right-0 bg-white text-right p-0">
      <div
        className={`flex items-center justify-end gap-1 px-3 h-14 py-0 transition-shadow duration-200 ease-in-out ${
          isScrolledToRight
            ? ''
            : 'shadow-[-5px_0_2px_0px_rgba(100,100,100,0.1)]'
        }`}
      >
        {primaryActions.map((action, actionIndex) => (
          <Button
            key={`${action.type}-${actionIndex}-primary`}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title={action.label}
          >
            <IconRenderer iconName={action.type} />
            <span className="sr-only">{action.label}</span>
          </Button>
        ))}
        {secondaryActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="More actions"
              >
                <IconRenderer iconName="more" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {secondaryActions.map((action, actionIndex) => (
                <DropdownMenuItem
                  key={`${action.type}-${actionIndex}-secondary`}
                >
                  <IconRenderer iconName={action.type} />
                  <span>{action.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TableCell>
  )
}

export default ActionsCell
