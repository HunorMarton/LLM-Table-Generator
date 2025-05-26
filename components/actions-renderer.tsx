'use client'

import React from 'react'
import type { Action as ActionType } from '@/lib/types'
import IconRenderer from './icon-renderer' // Assuming IconRenderer is in the same directory
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface ActionsRendererProps {
  actions: ActionType[]
}

const ActionsRenderer: React.FC<ActionsRendererProps> = ({ actions }) => {
  const primaryActions = actions.filter((action) => action.primary)
  const secondaryActions = actions.filter((action) => !action.primary)

  return (
    <div className="flex items-center justify-end gap-1 px-3 h-14 py-0">
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
              <DropdownMenuItem key={`${action.type}-${actionIndex}-secondary`}>
                <IconRenderer iconName={action.type} />
                <span className="ml-2">{action.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default ActionsRenderer
