import React, { useState, useEffect } from 'react'
import { FolderOpen, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDisplayVersion } from '../utils/version'

interface WelcomeDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function WelcomeDialog({ isOpen, onClose }: WelcomeDialogProps) {
  const [databasePath, setDatabasePath] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadDatabasePath()
    }
  }, [isOpen])

  const loadDatabasePath = async () => {
    try {
      if (window.electronAPI?.getDatabasePath) {
        const path = await window.electronAPI.getDatabasePath()
        setDatabasePath(path)
      }
    } catch (error) {
      console.error('Failed to get database path:', error)
      setDatabasePath('Unable to determine database path')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevealFolder = async () => {
    try {
      if (window.electronAPI?.revealDatabaseFolder) {
        await window.electronAPI.revealDatabaseFolder()
      }
    } catch (error) {
      console.error('Failed to reveal database folder:', error)
    }
  }

  const handleCopyPath = () => {
    if (navigator.clipboard && databasePath) {
      navigator.clipboard.writeText(databasePath)
      // Could add a toast notification here
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-card border border-border shadow-2xl">
        <CardHeader className="relative pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-4 pr-12">
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
            <div>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                Welcome to MeowLink! 
                <Badge variant="secondary" className="text-xs">
                  {getDisplayVersion()}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-1">
                Your bookmark data is safely stored locally on your computer
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Database Location Info */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">Database Location</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your bookmarks are stored in a local SQLite database file:
                </p>
                {isLoading ? (
                  <div className="bg-muted rounded-md p-3 text-sm">
                    <div className="animate-pulse bg-muted-foreground/20 h-4 w-3/4 rounded"></div>
                  </div>
                ) : (
                  <div className="bg-background border border-border rounded-md p-3 text-sm font-mono text-foreground break-all">
                    {databasePath}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">✨ What This Means:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Your data stays on your computer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>No cloud sync or external servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Fast performance and full privacy</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">💾 For Backup:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Copy the <code className="text-xs bg-muted px-1 rounded">meowlink.db</code> file</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Store it in your preferred backup location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Restore by replacing the file</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>

        <CardFooter className="gap-3 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleRevealFolder}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <FolderOpen className="h-4 w-4" />
            Show in Finder
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyPath}
            disabled={isLoading || !databasePath}
          >
            Copy Path
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('https://github.com/sangwon0707/meowlink/blob/main/Readme.md', '_blank')}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            Github Link
          </Button>
          <div className="flex-1"></div>
          <Button
            onClick={onClose}
            className="bg-brand-orange hover:bg-brand-orange-dark text-brand-orange-foreground"
          >
            Got it, thanks!
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}