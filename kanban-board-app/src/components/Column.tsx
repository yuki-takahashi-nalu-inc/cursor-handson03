import React from 'react'
import { motion } from 'framer-motion'
import { Task, Status } from '../types/kanban'
import { useKanbanStore } from '../store/kanbanStore'
import { TaskCard } from './TaskCard'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'

interface ColumnProps {
  status: Status
  title: string
  tasks: Task[]
  onTaskEdit: (task: Task) => void
  onDrop: (taskId: string, newStatus: Status) => void
}

const statusColors: Record<Status, string> = {
  todo: 'border-blue-200 bg-blue-50',
  doing: 'border-yellow-200 bg-yellow-50',
  done: 'border-green-200 bg-green-50',
}

const headerColors: Record<Status, string> = {
  todo: 'text-blue-700',
  doing: 'text-yellow-700', 
  done: 'text-green-700',
}

export const Column: React.FC<ColumnProps> = ({ 
  status, 
  title, 
  tasks, 
  onTaskEdit, 
  onDrop 
}) => {
  const { wipLimit } = useKanbanStore()
  const [isDragOver, setIsDragOver] = React.useState(false)
  
  const taskCount = tasks.length
  const showWipLimit = status === 'doing'
  const isOverLimit = showWipLimit && taskCount > wipLimit
  const wipProgress = showWipLimit ? (taskCount / wipLimit) * 100 : 0

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      onDrop(taskId, status)
    }
  }

  return (
    <div className="flex-1 min-w-80">
      <Card className={`h-full ${statusColors[status]} transition-all duration-200 ${
        isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
      }`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-sm font-semibold ${headerColors[status]}`}>
              {title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {taskCount}
            </Badge>
          </div>
          
          {/* WIP Limit Indicator for "doing" column */}
          {showWipLimit && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  WIP制限: {taskCount}/{wipLimit}
                </span>
                {isOverLimit && (
                  <span className="text-red-600 font-medium">上限超過</span>
                )}
              </div>
              <Progress 
                value={Math.min(wipProgress, 100)} 
                className={`h-1 ${isOverLimit ? '[&>div]:bg-red-500' : '[&>div]:bg-yellow-500'}`}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <motion.div
            className={`min-h-96 space-y-3 rounded-lg border-2 border-dashed p-2 transition-all duration-200 ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-200 bg-gray-50/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            layout
          >
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
                タスクをここにドロップ
              </div>
            ) : (
              <motion.div layout className="space-y-3">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('taskId', task.id)
                      e.dataTransfer.effectAllowed = 'move'
                    }}
                  >
                    <TaskCard 
                      task={task} 
                      onEdit={onTaskEdit}
                      isDragging={false}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}