"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, X, Save, KeyRound, Search } from "lucide-react"
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
import { format } from "date-fns"

interface UserListProps {
  users: any[]
  isLoading: boolean
  onUpdate: (id: string, updates: { name?: string; email?: string; role?: string }) => void
  onDelete: (id: string) => void
  onResetPassword: (id: string) => void
}

export function UserList({ users, isLoading, onUpdate, onDelete, onResetPassword }: UserListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [userToResetPassword, setUserToResetPassword] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleEdit = (user: any) => {
    setEditingId(user.id)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditRole(user.role)
  }

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, {
        name: editName,
        email: editEmail,
        role: editRole,
      })
      setEditingId(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleResetPasswordClick = (id: string) => {
    setUserToResetPassword(id)
    setResetPasswordDialogOpen(true)
  }

  const confirmResetPassword = () => {
    if (userToResetPassword) {
      onResetPassword(userToResetPassword)
      setResetPasswordDialogOpen(false)
      setUserToResetPassword(null)
    }
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="relative w-full max-w-sm mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="relative w-full max-w-sm mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">No users found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery ? "Try adjusting your search to find what you're looking for." : "Add a user to get started."}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {editingId === user.id ? (
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="max-w-[200px]" />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user.id ? (
                      <Input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="max-w-[200px]"
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user.id ? (
                      <Select value={editRole} onValueChange={setEditRole}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? format(new Date(user.lastLogin), "MMM d, yyyy 'at' h:mm a") : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === user.id ? (
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
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleResetPasswordClick(user.id)}>
                          <KeyRound className="h-4 w-4" />
                          <span className="sr-only">Reset Password</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user.id)}>
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
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user account. This action cannot be undone.
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

      <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a password reset link to the user's email. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword}>Reset Password</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
