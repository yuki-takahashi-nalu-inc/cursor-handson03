export interface Task {
  id: string
  title: string
  description?: string
  status: Status
  priority: Priority
  tags: string[]
  assignee?: {
    name: string
    avatar?: string
  }
  dueDate?: string
  createdAt: number
}

export type Status = 'todo' | 'doing' | 'done'
export type Priority = 'high' | 'medium' | 'low'

export interface Column {
  id: string
  title: string
  tasks: Task[]
  color?: string
  limit?: number
}

export interface Board {
  id: string
  name: string
  columns: Record<string, Column>
  createdAt: Date
  updatedAt: Date
}