'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Send,
  Search,
  User,
  Building2,
  Paperclip,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  MessageSquare,
  Loader2
} from 'lucide-react'
import Button from '@/components/ui/Button'

interface Message {
  id: string
  clientId: string
  clientName: string
  clientType: 'personal' | 'business'
  content: string
  sender: 'consultant' | 'client'
  timestamp: Date
  read: boolean
  attachments?: string[]
}

interface Conversation {
  clientId: string
  clientName: string
  clientType: 'personal' | 'business'
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  avatar?: string
}

function MessagesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedClientId = searchParams.get('client')
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedClientId)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('consultant_token')
    if (!token) {
      router.push('/client/login')
      return
    }

    // Mock conversations
    const mockConversations: Conversation[] = [
      {
        clientId: '1',
        clientName: 'John Doe',
        clientType: 'personal',
        lastMessage: 'Thank you for the update on my loan application.',
        lastMessageTime: new Date('2024-01-16T14:30:00'),
        unreadCount: 2,
      },
      {
        clientId: '2',
        clientName: 'ABC Trading Pte Ltd',
        clientType: 'business',
        lastMessage: 'We would like to schedule a follow-up meeting.',
        lastMessageTime: new Date('2024-01-16T10:15:00'),
        unreadCount: 0,
      },
      {
        clientId: '3',
        clientName: 'Jane Smith',
        clientType: 'personal',
        lastMessage: 'When can I expect the approval?',
        lastMessageTime: new Date('2024-01-15T16:45:00'),
        unreadCount: 0,
      },
      {
        clientId: '4',
        clientName: 'XYZ Services Ltd',
        clientType: 'business',
        lastMessage: 'The documents have been uploaded.',
        lastMessageTime: new Date('2024-01-14T09:20:00'),
        unreadCount: 0,
      },
    ]

    setConversations(mockConversations)
    
    if (selectedClientId) {
      setSelectedConversation(selectedClientId)
    }
  }, [router, selectedClientId])

  useEffect(() => {
    if (!selectedConversation) return

    // Mock messages for selected conversation
    const mockMessages: Message[] = [
      {
        id: '1',
        clientId: selectedConversation,
        clientName: conversations.find(c => c.clientId === selectedConversation)?.clientName || 'Client',
        clientType: conversations.find(c => c.clientId === selectedConversation)?.clientType || 'personal',
        content: 'Hi, I would like to inquire about a business loan.',
        sender: 'client',
        timestamp: new Date('2024-01-15T09:00:00'),
        read: true,
      },
      {
        id: '2',
        clientId: selectedConversation,
        clientName: conversations.find(c => c.clientId === selectedConversation)?.clientName || 'Client',
        clientType: conversations.find(c => c.clientId === selectedConversation)?.clientType || 'personal',
        content: 'Thank you for reaching out. I would be happy to help you with your business loan application. Could you tell me more about your business and funding requirements?',
        sender: 'consultant',
        timestamp: new Date('2024-01-15T09:15:00'),
        read: true,
      },
      {
        id: '3',
        clientId: selectedConversation,
        clientName: conversations.find(c => c.clientId === selectedConversation)?.clientName || 'Client',
        clientType: conversations.find(c => c.clientId === selectedConversation)?.clientType || 'personal',
        content: 'Thank you for the update on my loan application.',
        sender: 'client',
        timestamp: new Date('2024-01-16T14:30:00'),
        read: false,
      },
    ]

    setMessages(mockMessages)
  }, [selectedConversation, conversations])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const client = conversations.find(c => c.clientId === selectedConversation)
    if (!client) return

    const message: Message = {
      id: Date.now().toString(),
      clientId: selectedConversation,
      clientName: client.clientName,
      clientType: client.clientType,
      content: newMessage,
      sender: 'consultant',
      timestamp: new Date(),
      read: true,
    }

    setMessages([...messages, message])
    setNewMessage('')

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.clientId === selectedConversation
          ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date(), unreadCount: 0 }
          : conv
      )
    )
  }

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedClient = conversations.find(c => c.clientId === selectedConversation)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/consultant/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-600">Communicate with your clients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.clientId}
                onClick={() => setSelectedConversation(conversation.clientId)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.clientId ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${conversation.clientType === 'personal' ? 'bg-primary/10' : 'bg-teal/10'}`}>
                    {conversation.clientType === 'personal' ? (
                      <User className="w-5 h-5 text-primary" />
                    ) : (
                      <Building2 className="w-5 h-5 text-teal" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.clientName}</h3>
                      {conversation.unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full flex-shrink-0">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-500">
                      {conversation.lastMessageTime.toLocaleDateString()} {conversation.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message View */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation && selectedClient ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedClient.clientType === 'personal' ? 'bg-primary/10' : 'bg-teal/10'}`}>
                    {selectedClient.clientType === 'personal' ? (
                      <User className="w-6 h-6 text-primary" />
                    ) : (
                      <Building2 className="w-6 h-6 text-teal" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedClient.clientName}</h2>
                    <p className="text-sm text-gray-600 capitalize">{selectedClient.clientType} Client</p>
                  </div>
                </div>
                <Link
                  href={`/consultant/clients/${selectedConversation}`}
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  View Profile →
                </Link>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'consultant' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.sender === 'consultant'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className={`flex items-center gap-2 mt-2 text-xs ${
                        message.sender === 'consultant' ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.sender === 'consultant' && (
                          <span>
                            {message.read ? (
                              <CheckCircle2 className="w-3 h-3 inline" />
                            ) : (
                              <Clock className="w-3 h-3 inline" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Type your message..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a client from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}
