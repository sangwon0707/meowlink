import React, { useState, useEffect } from "react"
import { X, Link, Tag, FileText, Globe } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { LinkItem } from '../types'
import { correctUrl } from '../utils/urlUtils'

interface AddLinkModalProps {
  link?: LinkItem | null
  onSave: (linkData: any) => void
  onClose: () => void
}

export function AddLinkModal({ link, onSave, onClose }: AddLinkModalProps) {
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    memo: "",
    tags: "",
  })

  const [tagList, setTagList] = useState<string[]>([])

  useEffect(() => {
    if (link) {
      // 기존 태그들도 대문자로 변환하여 표시
      const uppercaseTags = link.tags.map(tag => tag.toUpperCase())
      setFormData({
        url: link.url,
        title: link.title,
        memo: link.memo || "",
        tags: uppercaseTags.join(", "),
      })
      setTagList(uppercaseTags)
    } else {
      setFormData({
        url: "",
        title: "",
        memo: "",
        tags: "",
      })
      setTagList([])
    }
  }, [link])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.url.trim()) {
      return
    }

    const correctedFormData = {
      ...formData,
      url: correctUrl(formData.url.trim()),
      tags: tagList,
    }
    onSave(correctedFormData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "url") {
      // Don't auto-correct URL while typing, only store the raw value
      setFormData((prev) => ({ ...prev, [name]: value }))
    } else if (name === "tags") {
      setFormData((prev) => ({ ...prev, [name]: value }))
      // Update tag list for preview with automatic uppercase conversion
      const tags = value
        .split(",")
        .map((tag) => tag.trim().toUpperCase()) // 자동으로 대문자 변환
        .filter((tag) => tag.length > 0)
      setTagList(tags)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tagList.filter((tag) => tag !== tagToRemove)
    setTagList(newTags)
    setFormData((prev) => ({ ...prev, tags: newTags.join(", ") }))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <Link className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-foreground">{link ? "Edit Bookmark" : "Add New Bookmark"}</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                {link ? "Update your bookmark details" : "Save a new link to your collection"}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="space-y-3 py-3">
            {/* URL Field */}
            <div className="space-y-1">
              <Label htmlFor="url" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                  <Globe className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                Website URL *
              </Label>
              <Input
                type="text"
                id="url"
                name="url"
                placeholder="Enter URL (e.g., example.com, https://example.com)"
                value={formData.url}
                onChange={handleInputChange}
                required
                autoFocus={!link}
                className="h-10 text-base bg-background/50 modal-input-border focus:bg-background focus:border-primary/50 transition-all"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                💡 Don't worry about https:// - we'll add it automatically
              </p>
            </div>

            {/* Title Field */}
            <div className="space-y-1">
              <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-md">
                  <FileText className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="Bookmark title (we'll try to fetch automatically)"
                value={formData.title}
                onChange={handleInputChange}
                className="h-10 text-base bg-background/50 modal-input-border focus:bg-background focus:border-primary/50 transition-all"
              />
            </div>

            {/* Memo Field */}
            <div className="space-y-1">
              <Label htmlFor="memo" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                  <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                Notes & Description (Keep it short for quick future reference)
              </Label>
              <Textarea
                id="memo"
                name="memo"
                placeholder="Add your personal notes, summary, or why this bookmark is important to you..."
                value={formData.memo}
                onChange={handleInputChange}
                rows={2}
                className="resize-none text-base bg-background/50 modal-input-border focus:bg-background focus:border-primary/50 transition-all"
              />
            </div>

            {/* Tags Field */}
            <div className="space-y-1">
              <Label htmlFor="tags" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                  <Tag className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                </div>
                Tags
              </Label>
              <Input
                type="text"
                id="tags"
                name="tags"
                placeholder="Add tags separated by commas (e.g., react, javascript, tutorial)"
                value={formData.tags}
                onChange={handleInputChange}
                className="h-10 text-base bg-background/50 modal-input-border focus:bg-background focus:border-primary/50 transition-all"
              />
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-xl border border-border/50">
                  {tagList.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 font-medium"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-border/50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 h-10 font-medium bg-background/50 hover:bg-muted transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="flex-1 h-10 font-semibold bg-brand-orange hover:bg-brand-orange-dark text-brand-orange-foreground shadow-sm transition-all hover:shadow-md" 
            disabled={!formData.url.trim()}
          >
            {link ? "💾 Update Bookmark" : "✨ Save Bookmark"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
