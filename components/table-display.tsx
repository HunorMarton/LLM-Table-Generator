import React from "react"
import type { TableData } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Download,
  Share2,
  Archive,
  RotateCcw,
  CheckCircle,
  X,
  UserPlus,
  Copy,
  Printer,
  FileText,
  CreditCard,
  BarChart,
  MessageSquare,
  Check,
  Play,
  MessageCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Map of icon names to Lucide icons
const iconMap: Record<string, React.ReactNode> = {
  file: <FileText className="h-4 w-4 text-gray-500" />,
  payment: <CreditCard className="h-4 w-4 text-gray-500" />,
  chart: <BarChart className="h-4 w-4 text-gray-500" />,
  message: <MessageSquare className="h-4 w-4 text-gray-500" />,
  check: <Check className="h-4 w-4 text-gray-500" />,
}

// Map of action types to Lucide icons
const actionIconMap: Record<string, React.ReactNode> = {
  edit: <Edit className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  download: <Download className="h-4 w-4" />,
  share: <Share2 className="h-4 w-4" />,
  archive: <Archive className="h-4 w-4" />,
  restore: <RotateCcw className="h-4 w-4" />,
  approve: <CheckCircle className="h-4 w-4" />,
  reject: <X className="h-4 w-4" />,
  assign: <UserPlus className="h-4 w-4" />,
  complete: <Check className="h-4 w-4" />,
  duplicate: <Copy className="h-4 w-4" />,
  print: <Printer className="h-4 w-4" />,
  export: <Download className="h-4 w-4" />,
  preview: <Eye className="h-4 w-4" />,
  comment: <MessageCircle className="h-4 w-4" />,
  play: <Play className="h-4 w-4" />,
}

interface Action {
  type: string
  label: string
  primary?: boolean
}

export default function TableDisplay({ tableData }: { tableData: TableData }) {
  if (!tableData || !tableData.rows || tableData.rows.length === 0) {
    return null
  }

  // Consistent icon color for all actions
  const iconColor = "text-gray-700"

  return (
    <div className="w-full">
      {/* Table title - less prominent, outside the table */}
      <h2 className="font-medium text-sm leading-5 tracking-normal text-white/70 mb-3">{tableData.title}</h2>

      {/* Table container */}
      <div className="rounded-lg border border-white/20 bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                {tableData.columns.map((column, index) => (
                  <TableHead key={index} className={`font-medium ${column.key === "actions" ? "w-[140px]" : ""}`}>
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-gray-100">
                  {tableData.columns.map((column, colIndex) => {
                    if (column.key === "actions") {
                      // Get actions from the row or use default actions if not provided
                      const actions: Action[] = row.actions || [
                        { type: "edit", label: "Edit", primary: true },
                        { type: "delete", label: "Delete", primary: true },
                        { type: "view", label: "View", primary: false },
                      ]

                      // Separate primary and secondary actions
                      const primaryActions = actions.filter((action) => action.primary)
                      const secondaryActions = actions.filter((action) => !action.primary)

                      return (
                        <TableCell key={colIndex} className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Primary actions - visible by default */}
                            {primaryActions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-50"
                              >
                                {React.cloneElement(
                                  (actionIconMap[action.type] as React.ReactElement) || <Edit className="h-4 w-4" />,
                                  { className: `h-4 w-4 ${iconColor}` },
                                )}
                                <span className="sr-only">{action.label}</span>
                              </Button>
                            ))}

                            {/* Secondary actions in dropdown */}
                            {secondaryActions.length > 0 && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className={`h-4 w-4 ${iconColor}`} />
                                    <span className="sr-only">More actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {secondaryActions.map((action, actionIndex) => (
                                    <DropdownMenuItem key={actionIndex} className="">
                                      {React.cloneElement(
                                        (actionIconMap[action.type] as React.ReactElement) || (
                                          <Edit className="h-4 w-4" />
                                        ),
                                        { className: `mr-2 h-4 w-4 ${iconColor}` },
                                      )}
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

                    const value = row[column.key]
                    const icon = row[`${column.key}_icon`]

                    return (
                      <TableCell key={colIndex} className="">
                        <div className="flex items-center gap-2">
                          {icon && iconMap[icon] ? iconMap[icon] : null}
                          <span>{value}</span>
                        </div>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
