import React from 'react'
import { Search, X, Filter } from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'

export const SearchBar: React.FC = () => {
  const { 
    searchQuery, 
    selectedTags, 
    setSearchQuery, 
    setSelectedTags, 
    getAllTags 
  } = useKanbanStore()
  
  const [isTagFilterOpen, setIsTagFilterOpen] = React.useState(false)
  const allTags = getAllTags()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    setSelectedTags(newSelectedTags)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    setIsTagFilterOpen(false)
  }

  const hasActiveFilters = searchQuery.length > 0 || selectedTags.length > 0

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="タスクを検索..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tag Filter */}
      <Popover open={isTagFilterOpen} onOpenChange={setIsTagFilterOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`relative ${selectedTags.length > 0 ? 'bg-blue-50 border-blue-200' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            タグフィルタ
            {selectedTags.length > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-600 text-white"
              >
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="end">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">タグで絞り込み</h4>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="h-6 px-2 text-xs"
                >
                  クリア
                </Button>
              )}
            </div>
            
            {allTags.length === 0 ? (
              <p className="text-sm text-gray-500">利用可能なタグがありません</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {allTags.map((tag) => (
                  <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm">{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-gray-600 hover:text-gray-800"
        >
          <X className="h-4 w-4 mr-1" />
          フィルタをクリア
        </Button>
      )}

      {/* Active Filter Display */}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}