import React from 'react'
import { motion } from 'framer-motion'
import { Task, Status } from '../types/kanban'
import { useKanbanStore } from '../store/kanbanStore'
import { Column } from './Column'

interface BoardProps {
  onTaskEdit: (task: Task) => void
}

const columns: { status: Status; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'doing', title: 'Doing' },
  { status: 'done', title: 'Done' },
]

export const Board: React.FC<BoardProps> = ({ onTaskEdit }) => {
  const { getFilteredTasks, moveTask } = useKanbanStore()
  
  const filteredTasks = getFilteredTasks()
  
  const getTasksByStatus = (status: Status): Task[] => {
    return filteredTasks.filter(task => task.status === status)
  }

  const handleTaskDrop = (taskId: string, newStatus: Status) => {
    moveTask(taskId, newStatus)
  }

  return (
    <motion.div 
      className="flex gap-6 h-full overflow-x-auto pb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {columns.map((column) => (
        <motion.div
          key={column.status}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Column
            status={column.status}
            title={column.title}
            tasks={getTasksByStatus(column.status)}
            onTaskEdit={onTaskEdit}
            onDrop={handleTaskDrop}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}