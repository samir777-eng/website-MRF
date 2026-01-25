"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Save, X, StickyNote, Clock } from "lucide-react";

interface Note {
  id: string;
  content: string;
  timestamp: number;
  timeLabel: string;
  createdAt: Date;
}

interface NotesPanelProps {
  lessonId: number;
}

export function NotesPanel({ lessonId }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content:
        "النحو هو علم يبحث في أحوال أواخر الكلمات العربية من حيث الإعراب والبناء",
      timestamp: 120,
      timeLabel: "2:00",
      createdAt: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "2",
      content: "الكلمة في العربية تنقسم إلى: اسم وفعل وحرف",
      timestamp: 300,
      timeLabel: "5:00",
      createdAt: new Date("2024-01-15T10:35:00"),
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editContent, setEditContent] = useState("");

  const addNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: newNoteContent.trim(),
      timestamp: 0, // In real app, get from video player
      timeLabel: "0:00",
      createdAt: new Date(),
    };

    setNotes([...notes, newNote]);
    setNewNoteContent("");
    setIsAdding(false);
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (!editContent.trim() || !editingId) return;

    setNotes(
      notes.map((note) =>
        note.id === editingId ? { ...note, content: editContent.trim() } : note,
      ),
    );
    setEditingId(null);
    setEditContent("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-EG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              ملاحظاتي
            </CardTitle>
            <CardDescription>{notes.length} ملاحظة</CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            <Plus className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            إضافة
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add New Note */}
        {isAdding && (
          <div className="p-3 border rounded-lg bg-muted/50">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="اكتب ملاحظتك هنا..."
              className="w-full p-2 border rounded resize-none bg-background"
              rows={3}
              autoFocus
            />
            <div className="flex items-center gap-2 mt-2">
              <Button size="sm" onClick={addNote}>
                <Save className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                حفظ
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewNoteContent("");
                }}
              >
                <X className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد ملاحظات بعد</p>
              <p className="text-sm">ابدأ بإضافة ملاحظاتك الأولى</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-3 border rounded-lg bg-card">
                {editingId === note.id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border rounded resize-none bg-background"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        حفظ
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline" className="text-sm">
                        <Clock className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                        {note.timeLabel}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => startEdit(note)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed mb-2">
                      {note.content}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
