import React, { useState } from "react"
import { Star, Edit, Trash2, Globe, Check, X } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LinkItem } from '../types'
import { useApp } from '../contexts/AppContext'
import { getFaviconUrl } from '../utils/urlUtils'

interface LinkCardProps {
  link: LinkItem
  onEdit: (link: LinkItem) => void
  isCompact?: boolean
}

export function LinkCard({ link, onEdit, isCompact = false }: LinkCardProps) {
  const [imageError, setImageError] = useState(false)
  const [faviconUrl, setFaviconUrl] = useState(link.favicon || getFaviconUrl(link.domain, link.url))
  const [isEditingMemo, setIsEditingMemo] = useState(false)
  const [memoValue, setMemoValue] = useState(link.memo || '')

  const { dispatch } = useApp()

  const handleToggleFavorite = async () => {
    try {
      const updates = { is_favorite: !link.is_favorite }
      
      if (window.electronAPI) {
        await window.electronAPI.updateLink(link.id, updates)
      }
      
      dispatch({ type: 'UPDATE_LINK', payload: { id: link.id, updates } })
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  const handleDelete = async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.deleteLink(link.id)
      }
      
      dispatch({ type: 'DELETE_LINK', payload: link.id })
    } catch (error) {
      console.error("Failed to delete link:", error)
    }
  }

  const handleOpenLink = async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.openExternal(link.url)
      } else {
        window.open(link.url, "_blank")
      }
    } catch (error) {
      console.error("Failed to open link:", error)
    }
  }

  const handleImageError = () => {
    const fallbackUrl = `https://www.google.com/s2/favicons?domain=${link.domain}&sz=128`
    if (faviconUrl !== fallbackUrl) {
      setFaviconUrl(fallbackUrl)
    } else {
      setImageError(true)
    }
  }


  const handleStartMemoEdit = () => {
    setIsEditingMemo(true)
    setMemoValue(link.memo || '')
  }

  const handleCancelMemoEdit = () => {
    setIsEditingMemo(false)
    setMemoValue(link.memo || '')
  }

  const handleSaveMemo = async () => {
    try {
      const updates = { memo: memoValue.trim() }
      
      if (window.electronAPI) {
        await window.electronAPI.updateLink(link.id, updates)
      }
      
      dispatch({ type: 'UPDATE_LINK', payload: { id: link.id, updates } })
      setIsEditingMemo(false)
    } catch (error) {
      console.error("Failed to update memo:", error)
    }
  }


  // Compact View
  if (isCompact) {
    return (
      <TooltipProvider>
        <Card className="group relative bg-card border border-border hover:border-border/80 transition-all duration-200 hover:shadow-sm w-[415px] min-w-[415px] max-w-[415px] flex-shrink-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              {/* Favicon and Link Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                  <Avatar className="h-8 w-8 border border-border shadow-sm bg-card">
                    {!imageError ? (
                      <AvatarImage
                        src={faviconUrl || "/placeholder.svg"}
                        alt={`${link.domain} favicon`}
                        onError={handleImageError}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <Globe className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {link.is_favorite && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="h-2 w-2 text-white dark:text-yellow-900 fill-current" />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleOpenLink}
                  className="flex-1 min-w-0 text-left group/link hover:bg-primary/5 hover:text-primary transition-all duration-200 rounded-md p-1 -m-1"
                >
                  <h3 className="font-semibold text-sm leading-tight mb-0.5 group-hover/link:text-primary transition-colors truncate">
                    {link.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover/link:text-primary/80">
                    <Globe className="h-3 w-3" />
                    <span className="truncate">{link.domain}</span>
                  </div>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Favorite Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleFavorite}
                      className={`h-7 w-7 rounded-md transition-colors ${
                        link.is_favorite 
                          ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 dark:text-yellow-400 dark:hover:text-yellow-300" 
                          : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-400"
                      } shadow-sm border border-border`}
                    >
                      <Star className={`h-3 w-3 ${link.is_favorite ? "fill-current" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{link.is_favorite ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
                </Tooltip>

                {/* Edit Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(link)}
                      className="h-7 w-7 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 shadow-sm border border-border transition-colors"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit bookmark</TooltipContent>
                </Tooltip>

                {/* Delete Button */}
                <Tooltip>
                  <AlertDialog>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 shadow-sm border border-border transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Delete bookmark</TooltipContent>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{link.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Tooltip>
              </div>
            </div>

            {/* Tags in compact view */}
            {link.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/50">
                {link.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-primary/10 text-primary hover-hashtag transition-colors border border-primary/20 font-medium"
                  >
                    #{tag}
                  </Badge>
                ))}
                {link.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 font-medium">
                    +{link.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TooltipProvider>
    )
  }

  // Full View
  return (
    <TooltipProvider>
      <Card className="group relative bg-card border border-border hover:border-border/80 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 dark:hover:shadow-primary/5 w-[415px]">
        
        <CardContent className="relative p-6 h-52">
          {/* Header with Favicon and Actions */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-border shadow-sm bg-card">
                  {!imageError ? (
                    <AvatarImage
                      src={faviconUrl || "/placeholder.svg"}
                      alt={`${link.domain} favicon`}
                      onError={handleImageError}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <Globe className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                {link.is_favorite && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <Star className="h-3 w-3 text-white dark:text-yellow-900 fill-current" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <button
                  onClick={handleOpenLink}
                  className="text-left w-full group/link hover:bg-primary/5 hover:text-primary transition-all duration-200 rounded-md p-2 -m-2 cursor-pointer"
                >
                  <h3 className="font-bold text-foreground text-lg leading-tight mb-1 group-hover/link:text-primary transition-colors">
                    {link.title.length > 15 ? link.title.substring(0, 15) + '...' : link.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover/link:text-primary/80">
                    <Globe className="h-3 w-3" />
                    <span className="truncate">{link.domain}</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Favorite Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className={`h-8 w-8 rounded-md transition-colors ${
                      link.is_favorite 
                        ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 dark:text-yellow-400 dark:hover:text-yellow-300" 
                        : "text-muted-foreground hover:text-yellow-500 bg-card hover:bg-yellow-50 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-400"
                    } shadow-sm border border-border`}
                  >
                    <Star className={`h-4 w-4 ${link.is_favorite ? "fill-current" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{link.is_favorite ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
              </Tooltip>

              {/* Edit Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(link)}
                    className="h-8 w-8 rounded-md text-muted-foreground hover:text-blue-600 bg-card hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 shadow-sm border border-border transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit bookmark</TooltipContent>
              </Tooltip>

              {/* Delete Button */}
              <Tooltip>
                <AlertDialog>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-md text-muted-foreground hover:text-red-600 bg-card hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 shadow-sm border border-border transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Delete bookmark</TooltipContent>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{link.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Tooltip>
            </div>
          </div>

          {/* Memo */}
          <div className="mb-5 min-h-[60px] flex flex-col">
            {isEditingMemo ? (
              <div className="space-y-2 flex-1">
                <Textarea
                  value={memoValue}
                  onChange={(e) => setMemoValue(e.target.value)}
                  placeholder="Add your notes..."
                  className="resize-none text-sm h-[60px] bg-background/50 border-border/50 focus:bg-background focus:border-primary/50"
                  rows={3}
                />
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={handleSaveMemo}
                    className="h-7 px-3 bg-brand-orange hover:bg-brand-orange-dark text-brand-orange-foreground"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelMemoEdit}
                    className="h-7 px-3"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                onClick={handleStartMemoEdit}
                className="min-h-[60px] cursor-pointer rounded-md border border-dashed border-border/50 hover:border-border transition-colors p-3 group/memo flex items-start overflow-hidden flex-1 memo-background"
              >
                {link.memo ? (
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium group-hover/memo:text-foreground transition-colors break-words line-clamp-3">
                    {link.memo}
                  </p>
                ) : (
                  <p className="text-muted-foreground/60 text-sm italic group-hover/memo:text-muted-foreground transition-colors">
                    Click to add notes...
                  </p>
                )}
              </div>
            )}
          </div>

        </CardContent>

        <CardFooter className="px-6 py-4 bg-muted/30 border-t border-border">
          <div className="flex items-center justify-between w-full">
            {/* Tags */}
            {link.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {link.tags.slice(0, 4).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-primary/10 text-primary hover-hashtag transition-colors border border-primary/20 font-medium"
                  >
                    #{tag}
                  </Badge>
                ))}
                {link.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs px-2 py-1 font-medium">
                    +{link.tags.length - 4} more
                  </Badge>
                )}
              </div>
            ) : (
              <div></div>
            )}
            
            <div className="flex items-center gap-1.5">
              {link.is_favorite && (
                <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs font-medium">Favorite</span>
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
