import React, { useEffect, useState } from 'react'
import { Search, Plus, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from './contexts/AppContext'
import { Sidebar } from './components/Sidebar'
import { LinkCard } from './components/LinkCard'
import { AddLinkModal } from './components/AddLinkModal'
import { LinkItem } from './types'
import { correctUrl, getFaviconUrl } from './utils/urlUtils'

export default function App() {
  const { state, dispatch } = useApp()
  const { links, searchQuery, selectedFilter, isDarkMode, isLoading, error } = state
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Load data
  useEffect(() => {
    loadData()
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

  // Filter links
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
      case 'reminders':
        return link.reminder_date && !link.is_completed
      case 'completed':
        return link.is_completed
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

  const handleSaveLink = async (linkData: any) => {
    try {
      const correctedUrl = correctUrl(linkData.url)
      const urlObj = new URL(correctedUrl)
      
      const newLinkData = {
        ...linkData,
        url: correctedUrl,
        title: linkData.title || `Loading... ${urlObj.hostname}`,
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
            is_completed: false,
          })
        } else {
          savedLink = {
            id: Date.now(),
            created_at: new Date().toISOString().split('T')[0],
            is_favorite: false,
            is_completed: false,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your links...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Electron Titlebar */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-background border-b z-50 flex items-center justify-center drag-region">
        <div className="flex items-center gap-2 no-drag">
          <img 
            src="../assets/meowlink-icon.png" 
            alt="MeowLink" 
            className="w-5 h-5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <span className="text-sm font-medium">MeowLink</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex w-full pt-10">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r bg-card`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b bg-card p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search links, memos, or tags... (use #tag for hashtag-only)"
                  value={searchQuery}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                  className="pl-10"
                />
              </div>
              
              <Button onClick={handleAddLink} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-destructive mb-4">Error: {error}</p>
                  <Button onClick={loadData} variant="outline">
                    Retry
                  </Button>
                </div>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <img 
                      src="../assets/meowlink-icon.png" 
                      alt="MeowLink" 
                      className="w-8 h-8 opacity-50"
                      onError={(e) => {
                        (e.target as HTMLImageElement).textContent = '🔗'
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'No results found' : 'No links yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? `No links found for "${searchQuery}". Try a different search term.`
                      : 'Add your first link to get started with MeowLink!'
                    }
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleAddLink}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Link
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLinks.map(link => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onEdit={handleEditLink}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Link Modal */}
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
    </div>
  )
}