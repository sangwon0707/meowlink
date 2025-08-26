import React from 'react'
import { List, Star, Hash, Moon, Sun, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FilterType } from '../types'
import { useApp } from '../contexts/AppContext'

interface SidebarProps {
  onShowWelcome?: () => void
}

export function Sidebar({ onShowWelcome }: SidebarProps) {
  const { state, dispatch } = useApp()
  const { links, selectedFilter, isDarkMode } = state

  const handleFilterChange = (filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filter })
    // Clear search query when switching filters for better UX
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })
  }

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' })
  }

  // Filter counts calculation
  const counts = {
    all: links.length,
    favorites: links.filter(link => link.is_favorite).length,
  }

  // Popular tags calculation (top 10)
  const tagCounts = links.reduce((acc, link) => {
    link.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  const navItems = [
    { id: 'all', label: 'All Bookmarks', icon: List, count: counts.all, color: 'text-brand-orange' },
    { id: 'favorites', label: 'Favorites', icon: Star, count: counts.favorites, color: 'text-brand-orange' },
  ] as const

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg">
            <img 
              src="../assets/meowlink-icon.png" 
              alt="MeowLink" 
              className="w-15 h-15"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-sidebar-foreground">MeowLink</h1>
            </div>
            <div className="flex items-center gap-2">
              {onShowWelcome && (
                <button
                  onClick={onShowWelcome}
                  className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-muted-foreground hover:text-sidebar-accent-foreground"
                  title="Show About & Welcome Guide"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium underline">About</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map(({ id, label, icon: Icon, count, color }) => (
            <Button
              key={id}
              variant={selectedFilter === id ? "default" : "ghost"}
              onClick={() => handleFilterChange(id as FilterType)}
              className={`
                w-full justify-start gap-3 px-3 py-2.5 h-auto font-medium transition-all duration-200
                ${selectedFilter === id 
                  ? 'bg-brand-orange text-brand-orange-foreground shadow-sm' 
                  : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground'
                }
              `}
            >
              <Icon className={`h-4 w-4 ${selectedFilter === id ? 'text-brand-orange-foreground' : color}`} />
              <span className="flex-1 text-left truncate">{label}</span>
              <Badge 
                variant={selectedFilter === id ? "secondary" : "outline"}
                className={`
                  ml-auto px-2 py-0.5 text-xs font-medium rounded-full
                  ${selectedFilter === id 
                    ? 'bg-brand-orange-foreground/90 text-brand-orange border-brand-orange-foreground/90' 
                    : 'bg-sidebar-accent text-sidebar-foreground border-sidebar-border'
                  }
                `}
              >
                {count}
              </Badge>
            </Button>
          ))}
        </nav>

        {/* Popular Tags Section */}
        {popularTags.length > 0 && (
          <div className="mt-8 px-3">
            <div className="flex items-center gap-2 px-3 py-2 mb-3">
              <Hash className="h-4 w-4 text-sidebar-muted-foreground" />
              <h3 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">
                Popular Tags
              </h3>
            </div>
            <div className="space-y-1">
              {popularTags.map(([tag, count]) => (
                <Button
                  key={tag}
                  variant="ghost"
                  onClick={() => {
                    // When clicking a tag, search only within tags using # prefix
                    dispatch({ type: 'SET_FILTER', payload: 'all' })
                    dispatch({ type: 'SET_SEARCH_QUERY', payload: `#${tag}` })
                  }}
                  className="w-full justify-start gap-2 px-3 py-2 h-auto text-sm font-normal hover-hashtag text-sidebar-muted-foreground hover:text-sidebar-accent-foreground transition-colors"
                >
                  <span className="text-sidebar-muted-foreground">#</span>
                  <span className="flex-1 text-left truncate">{tag}</span>
                  <Badge variant="outline" className="ml-auto px-1.5 py-0 text-xs bg-sidebar-muted text-sidebar-muted-foreground border-sidebar-border">
                    {count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Dark Mode Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={toggleDarkMode}
          className="w-full justify-start gap-3 px-3 py-2.5 h-auto hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-200 focus:ring-2 focus:ring-brand-orange/20 focus:outline-none"
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          <div className="relative">
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-400 transition-colors" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400 transition-colors" />
            )}
          </div>
          <span className="flex-1 text-left font-medium">{isDarkMode ? 'Switch Light Mode' : 'Switch Dark Mode'}</span>
          
          {/* Enhanced Toggle Switch */}
          <div 
            className={`
              relative w-10 h-5 rounded-full transition-all duration-300 shadow-inner border
              ${isDarkMode 
                ? 'bg-brand-orange border-brand-orange shadow-brand-orange/10' 
                : 'bg-sidebar-muted border-sidebar-border shadow-sidebar-border/10'
              }
            `}
            role="switch"
            aria-checked={isDarkMode}
          >
            <div className={`
              w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300 shadow-md border
              ${isDarkMode 
                ? 'translate-x-5 bg-brand-orange-foreground border-brand-orange-foreground/20' 
                : 'translate-x-0.5 bg-sidebar-foreground border-sidebar-foreground/20'
              }
            `} />
            
            {/* Visual indicator dots */}
            <div className="absolute inset-0 flex items-center justify-between px-1">
              <div className={`w-1 h-1 rounded-full transition-opacity ${isDarkMode ? 'opacity-0' : 'opacity-40 bg-sidebar-foreground'}`} />
              <div className={`w-1 h-1 rounded-full transition-opacity ${isDarkMode ? 'opacity-40 bg-brand-orange-foreground' : 'opacity-0'}`} />
            </div>
          </div>
        </Button>
      </div>
    </div>
  )
}