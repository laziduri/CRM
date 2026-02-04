'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mic,
  Sparkles,
  FileText,
  Download,
  Play,
  Pause,
  Calendar as CalendarIcon,
  Clock,
  User,
  Users,
  CheckCircle2,
  List,
  MessageSquare,
  Zap,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface MeetingNote {
  id: string
  title: string
  meetingDate: Date
  duration: number
  participants: string[]
  transcription?: string
  summary: string
  actionItems: ActionItem[]
  keyPoints: string[]
  tags: string[]
  aiGenerated: boolean
  createdAt: Date
}

interface ActionItem {
  id: string
  task: string
  assignee: string
  dueDate?: Date
  status: 'pending' | 'in-progress' | 'completed'
}

export default function AIMeetingsPage() {
  const router = useRouter()
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState<MeetingNote | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/crm')
      return
    }

    // Mock meeting notes
    const mockNotes: MeetingNote[] = [
      {
        id: '1',
        title: 'Q1 Strategy Meeting',
        meetingDate: new Date('2024-02-05T10:00:00'),
        duration: 45,
        participants: ['Sarah Chen', 'John Doe', 'Jane Smith'],
        transcription: 'Full transcription text would appear here...',
        summary: 'Discussed Q1 marketing strategy, budget allocation, and team goals. Agreed on launching new campaign by end of February.',
        actionItems: [
          {
            id: 'a1',
            task: 'Prepare marketing budget proposal',
            assignee: 'Sarah Chen',
            dueDate: new Date('2024-02-10'),
            status: 'in-progress',
          },
          {
            id: 'a2',
            task: 'Review campaign materials',
            assignee: 'John Doe',
            dueDate: new Date('2024-02-12'),
            status: 'pending',
          },
        ],
        keyPoints: [
          'Budget increased by 20% for Q1',
          'New campaign focuses on SME loans',
          'Target: 30% increase in applications',
        ],
        tags: ['strategy', 'marketing', 'q1'],
        aiGenerated: true,
        createdAt: new Date('2024-02-05'),
      },
      {
        id: '2',
        title: 'Client Consultation - ABC Trading',
        meetingDate: new Date('2024-02-08T14:30:00'),
        duration: 30,
        participants: ['Sarah Chen', 'ABC Trading Pte Ltd'],
        summary: 'Discussed business loan requirements. Client needs S$500K for expansion. Documents pending.',
        actionItems: [
          {
            id: 'a3',
            task: 'Follow up on missing documents',
            assignee: 'Sarah Chen',
            dueDate: new Date('2024-02-10'),
            status: 'pending',
          },
        ],
        keyPoints: ['Loan amount: S$500K', 'Purpose: Expansion', 'Timeline: Urgent'],
        tags: ['client', 'consultation', 'business-loan'],
        aiGenerated: true,
        createdAt: new Date('2024-02-08'),
      },
    ]

    setMeetingNotes(mockNotes)
    setIsLoading(false)
  }, [router])

  const startRecording = () => {
    setIsRecording(true)
    // In production, start actual recording
  }

  const stopRecording = async () => {
    setIsRecording(false)
    setIsTranscribing(true)

    try {
      // Call AI API to transcribe and generate notes
      const response = await fetch('/api/ai/meetings/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: 'base64_audio_data' }),
      })

      const data = await response.json()

      if (response.ok && data.note) {
        setMeetingNotes([data.note, ...meetingNotes])
        alert('Meeting notes generated successfully!')
      }
    } catch (error) {
      console.error('Transcription error:', error)
      alert('Failed to transcribe meeting. Please try again.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const uploadAudio = async (file: File) => {
    setIsTranscribing(true)

    try {
      const formData = new FormData()
      formData.append('audio', file)

      const response = await fetch('/api/ai/meetings/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.note) {
        setMeetingNotes([data.note, ...meetingNotes])
        alert('Meeting notes generated successfully!')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to process audio. Please try again.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const generateSummary = async (noteId: string) => {
    const note = meetingNotes.find((n) => n.id === noteId)
    if (!note || !note.transcription) return

    try {
      const response = await fetch('/api/ai/meetings/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: note.transcription }),
      })

      const data = await response.json()

      if (response.ok && data.summary) {
        const updatedNotes = meetingNotes.map((n) =>
          n.id === noteId
            ? {
                ...n,
                summary: data.summary,
                actionItems: data.actionItems || n.actionItems,
                keyPoints: data.keyPoints || n.keyPoints,
              }
            : n
        )
        setMeetingNotes(updatedNotes)
      }
    } catch (error) {
      console.error('Summary generation error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meeting notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Meeting Note Taker</h1>
                <p className="text-sm text-gray-600">Automatic transcription and intelligent summaries</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="audio/*,video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadAudio(file)
                }}
                className="hidden"
                id="audio-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('audio-upload')?.click()}
                disabled={isTranscribing}
              >
                {isTranscribing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Audio
                  </>
                )}
              </Button>
              <Button
                variant={isRecording ? 'primary' : 'outline'}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
              >
                {isRecording ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="bg-red-50 border-b border-red-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span className="font-medium">Recording in progress...</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Meeting Notes List */}
        <div className="space-y-4">
          {meetingNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                    {note.aiGenerated && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Generated
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{note.meetingDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{note.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{note.participants.length} participants</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{note.summary}</p>

                  {note.actionItems.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{note.actionItems.length} action items</span>
                    </div>
                  )}

                  {note.tags.length > 0 && (
                    <div className="flex gap-2">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    generateSummary(note.id)
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Enhance
                </Button>
              </div>
            </div>
          ))}
        </div>

        {meetingNotes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No meeting notes yet</p>
            <Button variant="primary" onClick={startRecording}>
              <Play className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          </div>
        )}
      </div>

      {/* Meeting Note Detail Modal */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title={selectedNote?.title}
        size="xl"
      >
        {selectedNote && (
          <div className="space-y-6">
            {/* Meeting Info */}
            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedNote.meetingDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-medium text-gray-900">{selectedNote.duration} minutes</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Participants</p>
                <p className="text-sm font-medium text-gray-900">{selectedNote.participants.length}</p>
              </div>
            </div>

            {/* Participants */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Participants</h3>
              <div className="flex flex-wrap gap-2">
                {selectedNote.participants.map((participant, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-2"
                  >
                    <User className="w-3 h-3" />
                    {participant}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedNote.summary}</p>
            </div>

            {/* Key Points */}
            {selectedNote.keyPoints.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Key Points</h3>
                <ul className="space-y-2">
                  {selectedNote.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Items */}
            {selectedNote.actionItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Action Items</h3>
                <div className="space-y-3">
                  {selectedNote.actionItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{item.task}</p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Assignee: {item.assignee}</span>
                        {item.dueDate && (
                          <span>Due: {item.dueDate.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transcription */}
            {selectedNote.transcription && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Full Transcription</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([selectedNote.transcription!], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${selectedNote.title}-transcription.txt`
                      a.click()
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedNote.transcription}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
