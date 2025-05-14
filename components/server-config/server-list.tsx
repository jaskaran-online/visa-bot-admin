"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil, Trash2, X, Save } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ServerListProps {
  servers: any[]
  activeServerId: string | null
  isLoading: boolean
  onUpdate: (id: string, updates: { name?: string; baseUrl?: string }) => void
  onDelete: (id: string) => void
  onSetActive: (id: string) => void
}

export function ServerList({ servers, activeServerId, isLoading, onUpdate, onDelete, onSetActive }: ServerListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editBaseUrl, setEditBaseUrl] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serverToDelete, setServerToDelete] = useState<string | null>(null)

  const handleEdit = (server: any) => {
    setEditingId(server.id)
    setEditName(server.name)
    setEditBaseUrl(server.baseUrl)
  }

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, {
        name: editName,
        baseUrl: editBaseUrl,
      })
      setEditingId(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleDeleteClick = (id: string) => {
    setServerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (serverToDelete) {
      onDelete(serverToDelete)
      setDeleteDialogOpen(false)
      setServerToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (servers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No servers configured</p>
        <p className="text-sm text-muted-foreground mt-1">Add a server to get started with the bot system.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Base URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servers.map((server) => (
              <TableRow key={server.id}>
                <TableCell>
                  {server.id === activeServerId ? (
                    <Badge variant="success" className="bg-green-500">
                      Active
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => onSetActive(server.id)}>
                      Set Active
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === server.id ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="max-w-[200px]" />
                  ) : (
                    server.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === server.id ? (
                    <Input value={editBaseUrl} onChange={(e) => setEditBaseUrl(e.target.value)} className="w-full" />
                  ) : (
                    <span className="font-mono text-sm">{server.baseUrl}</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === server.id ? (
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cancel</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleSave}>
                        <Save className="h-4 w-4" />
                        <span className="sr-only">Save</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(server)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(server.id)}
                        disabled={servers.length === 1} // Prevent deleting the last server
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this server configuration. This action cannot be undone.
              {activeServerId === serverToDelete && (
                <p className="mt-2 text-destructive font-semibold">
                  Warning: You are deleting the active server. Another server will be set as active.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
