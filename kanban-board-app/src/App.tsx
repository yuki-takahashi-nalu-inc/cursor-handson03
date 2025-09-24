import { useState } from 'react'
import { Board } from './components/Board'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { TaskDialog } from './components/TaskDialog'

function App() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(undefined)

  const handleNewTask = () => {
    setEditingTask(undefined)
    setIsTaskDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-screen">
        <Header onNewTask={handleNewTask} />
        <div className="px-4 py-4 border-b">
          <SearchBar />
        </div>
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <Board />
        </div>
      </div>
      <TaskDialog 
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        task={editingTask}
      />
    </div>
  )
}

export default App
