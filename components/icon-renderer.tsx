'use client'

import React from 'react'
import {
  FileText,
  CreditCard,
  BarChart,
  MessageSquare,
  Check,
  Edit,
  Trash2,
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
  Play,
  Bookmark,
  MoreHorizontal,
  MessageCircle,
} from 'lucide-react'

interface IconRendererProps {
  iconName?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Data cell icons
  file: FileText,
  payment: CreditCard,
  chart: BarChart,
  message: MessageSquare,
  check: Check,
  // Action icons
  edit: Edit,
  delete: Trash2,
  view: Eye,
  download: Download,
  share: Share2,
  archive: Archive,
  restore: RotateCcw,
  approve: CheckCircle,
  reject: X,
  assign: UserPlus,
  complete: CheckCircle,
  duplicate: Copy,
  print: Printer,
  export: Download,
  preview: Eye,
  comment: MessageCircle,
  play: Play,
  more: MoreHorizontal,
  bookmark: Bookmark,
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconName }) => {
  const IconComponent = iconName ? iconMap[iconName.toLowerCase()] : undefined

  if (IconComponent) {
    return <IconComponent className="h-4 w-4 text-gray-700" />
  }
  // Returns null if iconName is undefined or not found in iconMap and no default is set.
  return null
}

export default IconRenderer
