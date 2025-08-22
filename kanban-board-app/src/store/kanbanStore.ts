import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, Status, Priority } from '../types/kanban'

interface KanbanStore {
  tasks: Task[]
  searchQuery: string
  selectedTags: string[]
  wipLimit: number
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStatus: Status) => void
  setSearchQuery: (query: string) => void
  setSelectedTags: (tags: string[]) => void
  setWipLimit: (limit: number) => void
  resetBoard: () => void
  
  // Computed
  getTasksByStatus: (status: Status) => Task[]
  getFilteredTasks: () => Task[]
  getAllTags: () => string[]
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'プロジェクトキックオフ',
    description: 'プロジェクトの目標と範囲を定義する',
    status: 'todo',
    priority: 'high',
    tags: ['planning', 'important'],
    assignee: { name: '田中太郎' },
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'UIデザインの作成',
    description: 'ワイヤーフレームとモックアップを作成',
    status: 'doing',
    priority: 'medium',
    tags: ['design', 'ui'],
    assignee: { name: '鈴木花子' },
    createdAt: Date.now()
  },
  {
    id: '3',
    title: '要件定義書の作成',
    description: '機能要件と非機能要件をまとめる',
    status: 'done',
    priority: 'high',
    tags: ['documentation'],
    assignee: { name: '佐藤次郎' },
    createdAt: Date.now()
  }
]

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      searchQuery: '',
      selectedTags: [],
      wipLimit: 3,
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: Date.now()
        }
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }))
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          )
        }))
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }))
      },
      
      moveTask: (taskId, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        }))
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },
      
      setSelectedTags: (tags) => {
        set({ selectedTags: tags })
      },
      
      setWipLimit: (limit) => {
        set({ wipLimit: limit })
      },
      
      resetBoard: () => {
        set({ tasks: initialTasks, searchQuery: '', selectedTags: [] })
      },
      
      getTasksByStatus: (status) => {
        const { tasks } = get()
        return tasks.filter((task) => task.status === status)
      },
      
      getFilteredTasks: () => {
        const { tasks, searchQuery, selectedTags } = get()
        
        return tasks.filter((task) => {
          const matchesSearch = searchQuery === '' || 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          
          const matchesTags = selectedTags.length === 0 ||
            selectedTags.every(tag => task.tags.includes(tag))
          
          return matchesSearch && matchesTags
        })
      },
      
      getAllTags: () => {
        const { tasks } = get()
        const tagsSet = new Set<string>()
        tasks.forEach((task) => {
          task.tags.forEach((tag) => tagsSet.add(tag))
        })
        return Array.from(tagsSet)
      }
    }),
    {
      name: 'kanban-storage'
    }
  )
)