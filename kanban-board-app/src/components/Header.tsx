import React from 'react'
import { Plus, RotateCcw, Settings } from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface HeaderProps {
  onNewTask: () => void
}

export const Header: React.FC<HeaderProps> = ({ onNewTask }) => {
  const { resetBoard, wipLimit, setWipLimit, getTasksByStatus } = useKanbanStore()
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [tempWipLimit, setTempWipLimit] = React.useState(wipLimit)

  const doingTasks = getTasksByStatus('doing')
  const isOverWipLimit = doingTasks.length > wipLimit

  const handleResetBoard = () => {
    if (window.confirm('ボードをリセットしますか？すべてのタスクが初期状態に戻ります。')) {
      resetBoard()
    }
  }

  const handleSaveSettings = () => {
    if (tempWipLimit > 0 && tempWipLimit <= 20) {
      setWipLimit(tempWipLimit)
      setIsSettingsOpen(false)
    }
  }

  React.useEffect(() => {
    setTempWipLimit(wipLimit)
  }, [wipLimit, isSettingsOpen])

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title and description */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                カンバンボード
              </h1>
              <Badge variant="secondary" className="text-xs">
                Cursor学習プロジェクト
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              タスクを効率的に管理し、プロジェクトの進捗を可視化しましょう
            </p>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-3">
            {/* WIP Limit Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-gray-600">Doing:</span>
              <Badge 
                variant={isOverWipLimit ? "destructive" : "secondary"}
                className="px-2 py-1"
              >
                {doingTasks.length}/{wipLimit}
              </Badge>
            </div>

            {/* Settings Dialog */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  設定
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>ボード設定</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="wip-limit">WIP制限（Doingカラム）</Label>
                    <Input
                      id="wip-limit"
                      type="number"
                      min="1"
                      max="20"
                      value={tempWipLimit}
                      onChange={(e) => setTempWipLimit(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Doingカラムに同時に配置できるタスクの最大数（1-20）
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button size="sm" onClick={handleSaveSettings}>
                      保存
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Reset Board */}
            <Button variant="outline" size="sm" onClick={handleResetBoard}>
              <RotateCcw className="h-4 w-4 mr-2" />
              リセット
            </Button>

            {/* New Task */}
            <Button size="sm" onClick={onNewTask}>
              <Plus className="h-4 w-4 mr-2" />
              新しいタスク
            </Button>
          </div>
        </div>

        {/* Mobile WIP Limit Indicator */}
        <div className="sm:hidden mt-3 flex items-center gap-2 text-sm">
          <span className="text-gray-600">Doing WIP:</span>
          <Badge 
            variant={isOverWipLimit ? "destructive" : "secondary"}
            className="px-2 py-1"
          >
            {doingTasks.length}/{wipLimit}
          </Badge>
          {isOverWipLimit && (
            <span className="text-red-600 text-xs font-medium">
              制限超過
            </span>
          )}
        </div>
      </div>
    </header>
  )
}