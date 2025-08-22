import React from 'react'
import { motion } from 'framer-motion'
import { MoreVertical, GripVertical, Calendar, User } from 'lucide-react'
import { Task, Priority } from '../types/kanban'
import { useKanbanStore } from '../store/kanbanStore'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  isDragging?: boolean
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
}

const priorityLabels: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, isDragging = false }) => {
  const { deleteTask } = useKanbanStore()

  const handleDelete = () => {
    deleteTask(task.id)
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, rotate: 2 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'z-50' : 'z-10'}`}
    >
      <Card className={`transition-all duration-200 hover:shadow-md ${isDragging ? 'shadow-xl opacity-80' : ''}`}>
        <CardHeader className="p-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
              <h3 className="font-medium text-sm leading-tight flex-1">
                {truncateText(task.title, 50)}
              </h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  編集
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {task.description && (
            <p className="text-xs text-gray-600 mt-1">
              {truncateText(task.description, 100)}
            </p>
          )}
        </CardHeader>

        <CardContent className="p-3 pt-0 space-y-3">
          {/* Priority and Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {priorityLabels[task.priority]}
            </Badge>
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Bottom section with assignee and due date */}
          <div className="flex items-center justify-between">
            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                    {task.assignee.name.charAt(0)}
                  </div>
                </Avatar>
                <span className="text-xs text-gray-600 truncate max-w-[80px]">
                  {task.assignee.name}
                </span>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs ${
                isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
              }`}>
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}