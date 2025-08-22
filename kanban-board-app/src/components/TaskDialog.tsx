import React from 'react'
import { Task, Priority, Status } from '../types/kanban'
import { useKanbanStore } from '../store/kanbanStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { X, Plus, ChevronDown } from 'lucide-react'

interface TaskDialogProps {
  task?: Task | null
  isOpen: boolean
  onClose: () => void
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: '高', color: 'bg-red-100 text-red-800' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'low', label: '低', color: 'bg-green-100 text-green-800' },
]

const statusOptions: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'doing', label: 'Doing' },
  { value: 'done', label: 'Done' },
]

export const TaskDialog: React.FC<TaskDialogProps> = ({ task, isOpen, onClose }) => {
  const { addTask, updateTask, getAllTags } = useKanbanStore()
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    status: 'todo' as Status,
    tags: [] as string[],
    assignee: { name: '', avatar: '' },
    dueDate: '',
  })
  const [newTag, setNewTag] = React.useState('')
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const allTags = getAllTags()
  const isEditing = !!task

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        tags: [...task.tags],
        assignee: task.assignee || { name: '', avatar: '' },
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        tags: [],
        assignee: { name: '', avatar: '' },
        dueDate: '',
      })
    }
    setErrors({})
  }, [task, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です'
    }
    
    if (formData.assignee.name && formData.assignee.name.trim().length < 2) {
      newErrors.assignee = '担当者名は2文字以上で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      status: formData.status,
      tags: formData.tags,
      assignee: formData.assignee.name.trim() ? {
        name: formData.assignee.name.trim(),
        avatar: formData.assignee.avatar
      } : undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    }

    if (isEditing && task) {
      updateTask(task.id, taskData)
    } else {
      addTask(taskData)
    }

    onClose()
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddExistingTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'タスクを編集' : '新しいタスクを作成'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="タスクのタイトルを入力"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="タスクの詳細説明（任意）"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>優先度</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Badge className={priorityOptions.find(p => p.value === formData.priority)?.color}>
                      {priorityOptions.find(p => p.value === formData.priority)?.label}
                    </Badge>
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {priorityOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, priority: option.value }))}
                  >
                    <Badge className={option.color}>
                      {option.label}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>ステータス</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {statusOptions.find(s => s.value === formData.status)?.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, status: option.value }))}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>タグ</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="新しいタグを追加"
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button type="button" size="sm" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {allTags.filter(tag => !formData.tags.includes(tag)).map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddExistingTag(tag)}
                      className="h-6 text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              )}

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(tag)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assignee">担当者</Label>
            <Input
              id="assignee"
              value={formData.assignee.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                assignee: { ...prev.assignee, name: e.target.value }
              }))}
              placeholder="担当者名（任意）"
              className={errors.assignee ? 'border-red-500' : ''}
            />
            {errors.assignee && (
              <p className="text-red-500 text-xs">{errors.assignee}</p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">期限</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">
              {isEditing ? '更新' : '作成'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}