import React, { useEffect, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from './contexts/AppContext'
import { Sidebar } from './components/Sidebar'
import { LinkCard } from './components/LinkCard'
import { AddLinkModal } from './components/AddLinkModal'
import { WelcomeDialog } from './components/WelcomeDialog'
import { LinkItem } from './types'
import { correctUrl, getFaviconUrl } from './utils/urlUtils'
import { getDisplayVersion } from './utils/version'

export default function App() {
  const { state, dispatch } = useApp()
  const { links, searchQuery, selectedFilter, isDarkMode, isCompactView, isLoading, error } = state
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  // Check for first launch and show welcome dialog
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('meowlink-welcome-shown')
    if (!hasSeenWelcome) {
      // Show welcome dialog after a short delay to let the app settle
      const timer = setTimeout(() => {
        setShowWelcome(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      let linksData: LinkItem[] = []
      
      if (window.electronAPI) {
        linksData = await window.electronAPI.getAllLinks()
      } else {
        const savedLinks = localStorage.getItem('meowlink-links')
        linksData = savedLinks ? JSON.parse(savedLinks) : []
      }

      dispatch({ type: 'SET_LINKS', payload: linksData })
    } catch (error) {
      console.error('Failed to load data:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load links from database' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Filter links based on search and category
  const filteredLinks = links.filter(link => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      
      // Check if it's a hashtag search (starts with #)
      if (query.startsWith('#')) {
        const tagQuery = query.slice(1) // Remove the # prefix
        const matchesTags = link.tags.some(tag => tag.toLowerCase().includes(tagQuery))
        if (!matchesTags) {
          return false
        }
      } else {
        // Regular search across all fields
        const matchesTitle = link.title.toLowerCase().includes(query)
        const matchesMemo = link.memo?.toLowerCase().includes(query)
        const matchesTags = link.tags.some(tag => tag.toLowerCase().includes(query))
        const matchesUrl = link.url.toLowerCase().includes(query)
        
        if (!matchesTitle && !matchesMemo && !matchesTags && !matchesUrl) {
          return false
        }
      }
    }

    // Category filter
    switch (selectedFilter) {
      case 'favorites':
        return link.is_favorite
      default:
        return true
    }
  })

  const handleAddLink = () => {
    setEditingLink(null)
    setIsAddModalOpen(true)
  }

  const handleEditLink = (link: LinkItem) => {
    setEditingLink(link)
    setIsAddModalOpen(true)
  }

  const handleCloseWelcome = () => {
    setShowWelcome(false)
    localStorage.setItem('meowlink-welcome-shown', 'true')
  }

  const handleShowWelcome = () => {
    setShowWelcome(true)
  }

  const handleSaveLink = async (linkData: any) => {
    try {
      const correctedUrl = correctUrl(linkData.url)
      const urlObj = new URL(correctedUrl)
      
      // For editing: always use the user's title (even if empty)
      // For adding: use user's title if provided, otherwise auto-fetch
      let finalTitle = linkData.title
      if (!editingLink && (!linkData.title || linkData.title.trim() === '')) {
        // Only auto-generate title for NEW links when user didn't provide one
        finalTitle = `Loading... ${urlObj.hostname}`
      }
      
      const newLinkData = {
        ...linkData,
        url: correctedUrl,
        title: finalTitle,
        domain: urlObj.hostname,
        favicon: getFaviconUrl(urlObj.hostname, correctedUrl),
        tags: linkData.tags || [],
      }

      if (editingLink) {
        // Update existing link
        if (window.electronAPI) {
          await window.electronAPI.updateLink(editingLink.id, newLinkData)
        }
        dispatch({ type: 'UPDATE_LINK', payload: { id: editingLink.id, updates: newLinkData } })
      } else {
        // Add new link
        let savedLink: LinkItem
        
        if (window.electronAPI) {
          savedLink = await window.electronAPI.saveLink({
            ...newLinkData,
            is_favorite: false,
          })
        } else {
          savedLink = {
            id: Date.now(),
            created_at: new Date().toISOString().split('T')[0],
            is_favorite: false,
            ...newLinkData,
          }
          
          const updatedLinks = [...links, savedLink]
          localStorage.setItem('meowlink-links', JSON.stringify(updatedLinks))
        }
        
        dispatch({ type: 'ADD_LINK', payload: savedLink })
      }

      setIsAddModalOpen(false)
      setEditingLink(null)
    } catch (error) {
      console.error('Failed to save link:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save link' })
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Loading MeowLink</h3>
            <p className="text-sm text-muted-foreground">Getting your bookmarks ready...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Custom Electron Titlebar */}
      <div 
        className="h-10 bg-background border-b border-border/50 flex items-center justify-center px-4 relative z-50"
        style={{ 
          WebkitAppRegion: 'drag',
          WebkitUserSelect: 'none'
        } as React.CSSProperties}
      >
        <div 
          className="flex items-center gap-2 text-sm font-medium text-foreground/80"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-sm hover:bg-muted transition-colors"
            title="Toggle Sidebar"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
            </svg>
          </button>
          <div className="w-5 h-5 bg-brand-orange rounded-sm flex items-center justify-center shadow-sm">
            <img 
              src="../assets/meowlink-icon.png" 
              alt="MeowLink" 
              className="w-4 h-4"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
          MeowLink - {getDisplayVersion()}
        </div>
      </div>

      {/* Main Application Layout */}
      <div className="flex h-[calc(100vh-2.5rem)]">
        {/* Collapsible Sidebar */}
        <div className={`
          ${sidebarOpen ? 'w-72' : 'w-0'} 
          transition-all duration-300 ease-in-out 
          border-r border-border bg-background
          overflow-hidden
        `}>
          <Sidebar onShowWelcome={handleShowWelcome} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookmarks... (use #tag for hashtag-only search)"
                  value={searchQuery}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                  className="pl-9 w-80 bg-card border-border/50 focus:bg-card focus:border-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Fold Toggle Switch */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">Fold</span>
                <div 
                  onClick={() => dispatch({ type: 'TOGGLE_COMPACT_VIEW' })}
                  className={`
                    relative w-10 h-5 rounded-full transition-all duration-300 shadow-inner border cursor-pointer
                    ${isCompactView 
                      ? 'bg-brand-orange border-brand-orange shadow-brand-orange/10' 
                      : 'bg-muted border-border shadow-border/10'
                    }
                  `}
                  role="switch"
                  aria-checked={isCompactView}
                  title={isCompactView ? "Switch to full view" : "Switch to compact view"}
                >
                  <div className={`
                    w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300 shadow-md border
                    ${isCompactView 
                      ? 'translate-x-5 bg-brand-orange-foreground border-brand-orange-foreground/20' 
                      : 'translate-x-0.5 bg-foreground border-foreground/20'
                    }
                  `} />
                  
                  {/* Visual indicator dots */}
                  <div className="absolute inset-0 flex items-center justify-between px-1">
                    <div className={`w-1 h-1 rounded-full transition-opacity ${isCompactView ? 'opacity-0' : 'opacity-40 bg-foreground'}`} />
                    <div className={`w-1 h-1 rounded-full transition-opacity ${isCompactView ? 'opacity-40 bg-brand-orange-foreground' : 'opacity-0'}`} />
                  </div>
                </div>
              </div>

              {/* Add Link Button */}
              <Button 
                onClick={handleAddLink} 
                className="gap-2 bg-brand-orange hover:bg-brand-orange-dark text-brand-orange-foreground shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Add Link
              </Button>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto bg-content">
            <div className="p-6">
              {error ? (
                // Error State
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                      <div className="text-2xl">⚠️</div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                    <Button onClick={loadData} variant="outline" className="gap-2">
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : filteredLinks.length === 0 ? (
                // Empty State
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                      <img 
                        src="../assets/meowlink-icon.png" 
                        alt="MeowLink" 
                        className="w-10 h-10 opacity-40"
                        onError={(e) => {
                          (e.target as HTMLImageElement).innerHTML = '🔗'
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {searchQuery ? 'No bookmarks found' : 'Welcome to MeowLink'}
                      </h3>
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? `No results for "${searchQuery}". Try a different search term.`
                          : 'Start building your bookmark collection by adding your first link!'
                        }
                      </p>
                    </div>
                    {!searchQuery && (
                      <Button onClick={handleAddLink} size="lg" className="gap-2">
                        <Plus className="h-5 w-5" />
                        Add Your First Bookmark
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                // Links Grid
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {selectedFilter === 'all' ? 'All Bookmarks' : 'Favorites'}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {filteredLinks.length} bookmark{filteredLinks.length !== 1 ? 's' : ''}
                        {searchQuery && ` matching "${searchQuery}"`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, 415px)', justifyContent: 'center' }}>
                    {filteredLinks.map(link => (
                      <LinkCard
                        key={link.id}
                        link={link}
                        onEdit={handleEditLink}
                        isCompact={isCompactView}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add/Edit Link Modal */}
      {isAddModalOpen && (
        <AddLinkModal
          link={editingLink}
          onSave={handleSaveLink}
          onClose={() => {
            setIsAddModalOpen(false)
            setEditingLink(null)
          }}
        />
      )}

      {/* Welcome Dialog */}
      <WelcomeDialog
        isOpen={showWelcome}
        onClose={handleCloseWelcome}
      />
    </div>
  )
}