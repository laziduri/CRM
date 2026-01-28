'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, X, Send, Bot, MessageSquare, Loader2, Plus, Calendar, Clock, User, Phone, Mail, Building2, Trash2 } from 'lucide-react'
import { personalLoanFlow, businessLoanFlow, detectHighIntent, getHighIntentResponse, detectIntent, type ConversationMemory } from '@/lib/chatbotFlow'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  citations?: Array<{ title: string; url?: string }>
  buttons?: Array<{ label: string; value: string }>
}

interface Thread {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const STORAGE_KEY = 'brilliance_chatbot_threads'

export default function AIChatbot() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [threads, setThreads] = useState<Thread[]>([])
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m Claire from Brilliance Advisory 👋\n\nChoose how you\'d like to start 🙂\n\n(This chat is for guidance only — no application is submitted here.)',
      sender: 'bot',
      timestamp: new Date(),
      buttons: [
        { label: 'Learn & Understand', value: 'learn_understand' },
        { label: 'My Situation', value: 'my_situation' },
        { label: 'Others', value: 'others' },
      ],
    },
  ])
  
  // Track conversation stage for dynamic CTAs
  const [conversationStage, setConversationStage] = useState<'early' | 'mid' | 'high-intent'>('early')
  
  // Conversation flow state
  const [conversationFlow, setConversationFlow] = useState<{
    type: 'personal' | 'business' | 'exploring' | null
    step: number
    answers: Record<string, string>
  }>({
    type: null,
    step: 0,
    answers: {},
  })
  
  // Memory/Context tracking
  const [conversationMemory, setConversationMemory] = useState<{
    userInfo: {
      employmentType?: 'salaried' | 'self_employed' | 'business_owner'
      loanType?: 'personal' | 'business'
      loanAmount?: string
      loanPurpose?: string
      businessStatus?: string
      financingPurpose?: string
      monthlyIncome?: string
    }
    intent: 'browsing' | 'comparing' | 'ready-to-apply' | 'just-curious'
    questionsAsked: string[]
  }>({
    userInfo: {},
    intent: 'browsing',
    questionsAsked: [],
  })
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  
  // Suggested questions for quick selection - focused on loans only
  const suggestedQuestions = [
    "What are the requirements for a personal loan?",
    "How much can I borrow?",
    "Tell me about business loans",
    "How much does your service cost?",
    "What are the interest rates?",
    "How do I apply?",
  ]
  const [connectionTestResult, setConnectionTestResult] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<{ status?: number; error?: string; response?: string } | null>(null)
  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    company: '',
    purpose: '',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load threads from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved).map((t: any) => ({
          ...t,
          messages: t.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
          createdAt: new Date(t.createdAt),
        }))
        setThreads(parsed)
        if (parsed.length > 0 && !currentThreadId) {
          setCurrentThreadId(parsed[0].id)
          setMessages(parsed[0].messages)
        }
      }
    } catch (error) {
      console.error('Error loading threads:', error)
    }
    setIsVisible(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save threads to localStorage whenever they change
  useEffect(() => {
    if (threads.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
      } catch (error) {
        console.error('Error saving threads:', error)
      }
    }
  }, [threads])

  // Listen for custom event to open chatbot
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true)
    }
    window.addEventListener('openChatbot', handleOpenChatbot)
    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot)
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && !showAppointmentForm) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, showAppointmentForm])

  // Hide chatbot on CRM pages - check AFTER all hooks
  if (pathname?.startsWith('/crm')) {
    return null
  }

  const createNewThread = () => {
    const newThread: Thread = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        id: '1',
        text: 'Hello! I\'m Claire from Brilliance Advisory. I\'m here to help you with your loan and grant inquiries. How can I assist you today?',
        sender: 'bot',
        timestamp: new Date(),
      }],
      createdAt: new Date(),
    }
    setThreads([newThread, ...threads])
    setCurrentThreadId(newThread.id)
    setMessages(newThread.messages)
  }

  const switchThread = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId)
    if (thread) {
      setCurrentThreadId(threadId)
      setMessages(thread.messages)
    }
  }

  const deleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering thread switch
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      const updatedThreads = threads.filter(t => t.id !== threadId)
      setThreads(updatedThreads)
      
      // If deleting current thread, switch to first available or clear
      if (currentThreadId === threadId) {
        if (updatedThreads.length > 0) {
          setCurrentThreadId(updatedThreads[0].id)
          setMessages(updatedThreads[0].messages)
        } else {
          setCurrentThreadId(null)
          setMessages([{
            id: '1',
            text: 'Hi! I\'m Claire from Brilliance Advisory 👋\n\nI help with personal and business loans in Singapore.',
            sender: 'bot',
            timestamp: new Date(),
          }])
          setConversationFlow({ type: null, step: 0, answers: {} })
          setConversationStage('early')
        }
      }
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedThreads))
      } catch (error) {
        console.error('Failed to save threads to localStorage:', error)
      }
    }
  }

  const updateCurrentThread = (newMessages: Message[]) => {
    if (!currentThreadId) return
    
    const updated = threads.map(t => {
      if (t.id === currentThreadId) {
        // Update title from first user message if it's still "New Chat"
        let title = t.title
        if (title === 'New Chat' && newMessages.length > 1) {
          const firstUserMsg = newMessages.find(m => m.sender === 'user')
          if (firstUserMsg) {
            title = firstUserMsg.text.slice(0, 50) + (firstUserMsg.text.length > 50 ? '...' : '')
          }
        }
        return { ...t, messages: newMessages, title }
      }
      return t
    })
    setThreads(updated)
  }

  const handleQuickQuestion = (question: string) => {
    // Create user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: 'user',
      timestamp: new Date(),
    }

    // Show user message immediately
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    updateCurrentThread(newMessages)
    setInputValue('')
    setIsLoading(true)
    setDebugInfo(null)

    // Build payload
    const payload = {
      threadId: currentThreadId,
      messages: newMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    }
    
    console.log('[Chat] Payload sent (quick question):', JSON.stringify(payload, null, 2))

    // Send the message
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text()
          let errorData: any = { error: 'Unknown error occurred' }
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { error: errorText || `HTTP ${response.status}: ${response.statusText}` }
          }
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          sender: 'bot',
          timestamp: new Date(),
          citations: data.citations,
        }

        const updatedMessages = [...newMessages, botMessage]
        setMessages(updatedMessages)
        updateCurrentThread(updatedMessages)

        // Removed auto-open appointment form - user must click button explicitly
      })
      .catch((error) => {
        console.error('[Chat] Chat error:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I apologize, I'm having trouble connecting. Would you like to speak with a consultant directly via WhatsApp?`,
          sender: 'bot',
          timestamp: new Date(),
        }
        const updatedMessages = [...newMessages, errorMessage]
        setMessages(updatedMessages)
        updateCurrentThread(updatedMessages)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleButtonClick = (buttonValue: string, buttonLabel: string) => {
    // Handle special button actions
    if (buttonValue === 'book_appointment') {
      setShowAppointmentForm(true)
      return
    }
    
    if (buttonValue === 'whatsapp_advisor' || buttonValue === 'speak_to_human') {
      openWhatsApp()
      return
    }
    
    // Level 1 Categories (Learn & Understand, My Situation, Others)
    if (buttonValue === 'learn_understand') {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: buttonLabel,
        sender: 'user',
        timestamp: new Date(),
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'What would you like to learn about?',
        sender: 'bot',
        timestamp: new Date(),
        buttons: [
          { label: 'Personal loan basics', value: 'learn_personal_basics' },
          { label: 'Business / SME loan basics', value: 'learn_business_basics' },
          { label: 'How banks assess applications', value: 'learn_bank_assessment' },
          { label: 'Documents to prepare (Singapore)', value: 'learn_documents' },
        ],
      }
      const newMessages = [...messages, userMessage, botMessage]
      setMessages(newMessages)
      updateCurrentThread(newMessages)
      return
    }
    
    if (buttonValue === 'my_situation') {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: buttonLabel,
        sender: 'user',
        timestamp: new Date(),
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Tell me more about your situation:',
        sender: 'bot',
        timestamp: new Date(),
        buttons: [
          { label: 'I\'ve been rejected before', value: 'situation_rejected' },
          { label: 'My case is complicated', value: 'situation_complicated' },
          { label: 'Not sure if I should apply now', value: 'situation_unsure' },
          { label: 'I want someone to review my situation', value: 'situation_review' },
        ],
      }
      const newMessages = [...messages, userMessage, botMessage]
      setMessages(newMessages)
      updateCurrentThread(newMessages)
      return
    }
    
    if (buttonValue === 'others') {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: buttonLabel,
        sender: 'user',
        timestamp: new Date(),
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'How can I help?',
        sender: 'bot',
        timestamp: new Date(),
        buttons: [
          { label: 'Fees & how we work', value: 'others_fees' },
          { label: 'Speak to a human (WhatsApp)', value: 'speak_to_human' },
          { label: 'Just chat with Claire', value: 'just_chat' },
          { label: 'I\'m just browsing', value: 'others_browsing' },
        ],
      }
      const newMessages = [...messages, userMessage, botMessage]
      setMessages(newMessages)
      updateCurrentThread(newMessages)
      return
    }
    
    // Handle "Speak to a human" - show WhatsApp message
    if (buttonValue === 'speak_to_human') {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: buttonLabel,
        sender: 'user',
        timestamp: new Date(),
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'If you\'d prefer to talk to a human advisor, you can continue on WhatsApp anytime 💬\n\nYou\'ll be speaking with a Brilliance Advisory consultant. No obligation.',
        sender: 'bot',
        timestamp: new Date(),
      }
      const newMessages = [...messages, userMessage, botMessage]
      setMessages(newMessages)
      updateCurrentThread(newMessages)
      openWhatsApp()
      return
    }
    
    // Level 2 options that require routing question (except WhatsApp)
    const level2OptionsRequiringRouting = [
      'learn_personal_basics', 'learn_business_basics', 'learn_bank_assessment', 'learn_documents',
      'situation_rejected', 'situation_complicated', 'situation_unsure', 'situation_review',
      'just_chat', 'others_browsing', 'others_fees'
    ]
    
    if (level2OptionsRequiringRouting.includes(buttonValue)) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: buttonLabel,
        sender: 'user',
        timestamp: new Date(),
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Just one quick question so I guide you correctly 🔍\n\nIs this for a personal loan or a business / SME loan?',
        sender: 'bot',
        timestamp: new Date(),
        buttons: [
          { label: 'Personal', value: 'routing_personal' },
          { label: 'Business / SME', value: 'routing_business' },
        ],
      }
      const newMessages = [...messages, userMessage, botMessage]
      setMessages(newMessages)
      updateCurrentThread(newMessages)
      // Store the level 2 selection for later use
      setConversationFlow({ type: null, step: 0, answers: { level2: buttonValue } })
      return
    }
    
    // Routing question response (Personal vs Business/SME)
    if (buttonValue === 'routing_personal' || buttonValue === 'routing_business') {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: buttonLabel,
        sender: 'user',
        timestamp: new Date(),
      }
      const loanType = buttonValue === 'routing_personal' ? 'personal' : 'business'
      const level2Option = conversationFlow.answers.level2 || ''
      
      // Update memory
      const updatedMemory = {
        ...conversationMemory,
        userInfo: { ...conversationMemory.userInfo, loanType: loanType as 'personal' | 'business' },
      }
      setConversationMemory(updatedMemory)
      
      // Create summary message
      let summaryText = `✅ Here's what I understand so far: `
      if (level2Option.startsWith('learn_')) {
        summaryText += `you want to learn about ${level2Option.replace('learn_', '').replace('_', ' ')}, and this is for a ${loanType} loan. `
      } else if (level2Option.startsWith('situation_')) {
        summaryText += `you have a ${level2Option.replace('situation_', '').replace('_', ' ')} situation, and this is for a ${loanType} loan. `
      } else {
        summaryText += `this is for a ${loanType} loan. `
      }
      summaryText += `\n\nYou can type your question anytime now 😊`
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: summaryText,
        sender: 'bot',
        timestamp: new Date(),
      }
      const newMessages = [...messages, userMessage, botMessage]
      setMessages(newMessages)
      updateCurrentThread(newMessages)
      setConversationStage('mid')
      setConversationFlow({ type: loanType as 'personal' | 'business', step: 0, answers: {} })
      return
    }
    
    // Handle flow navigation
    if (buttonValue === 'personal' || buttonValue === 'personal_loan') {
      const updatedMemory = {
        ...conversationMemory,
        userInfo: { ...conversationMemory.userInfo, loanType: 'personal' as 'personal' | 'business' },
      }
      setConversationMemory(updatedMemory)
      setConversationFlow({ type: 'personal', step: 2, answers: { type: 'personal' } })
      setConversationStage('mid')
      const step = personalLoanFlow.step2
      const botMessage: Message = {
        id: Date.now().toString(),
        text: step.message,
        sender: 'bot',
        timestamp: new Date(),
        buttons: step.buttons,
      }
      setMessages(prev => [...prev, 
        { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
        botMessage
      ])
      updateCurrentThread([...messages, 
        { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
        botMessage
      ])
      return
    }
    
    if (buttonValue === 'business' || buttonValue === 'business_loan') {
      const updatedMemory = {
        ...conversationMemory,
        userInfo: { ...conversationMemory.userInfo, loanType: 'business' as const },
      }
      setConversationMemory(updatedMemory)
      setConversationFlow({ type: 'business', step: 1, answers: { type: 'business' } })
      setConversationStage('mid')
      const step = businessLoanFlow.step1
      const botMessage: Message = {
        id: Date.now().toString(),
        text: step.message,
        sender: 'bot',
        timestamp: new Date(),
        buttons: step.buttons,
      }
      setMessages(prev => [...prev, 
        { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
        botMessage
      ])
      updateCurrentThread([...messages, 
        { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
        botMessage
      ])
      return
    }
    
    // Handle flow progression
    if (conversationFlow.type === 'personal') {
      const currentStep = `step${conversationFlow.step}` as keyof typeof personalLoanFlow
      const answers = { ...conversationFlow.answers, [currentStep]: buttonValue }
      
      if (conversationFlow.step === 2) {
        // Store loan purpose in memory
        const updatedMemory = {
          ...conversationMemory,
          userInfo: { ...conversationMemory.userInfo, loanPurpose: buttonValue },
        }
        setConversationMemory(updatedMemory)
        setConversationFlow({ type: 'personal', step: 3, answers })
        setConversationStage('mid')
        const step = personalLoanFlow.step3
        const botMessage: Message = {
          id: Date.now().toString(),
          text: step.message,
          sender: 'bot',
          timestamp: new Date(),
          buttons: step.buttons,
        }
        setMessages(prev => [...prev, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        updateCurrentThread([...messages, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        return
      }
      
      if (conversationFlow.step === 3) {
        // Store loan amount in memory
        const updatedMemory = {
          ...conversationMemory,
          userInfo: { ...conversationMemory.userInfo, loanAmount: buttonValue },
        }
        setConversationMemory(updatedMemory)
        setConversationFlow({ type: 'personal', step: 4, answers })
        setConversationStage('mid')
        const step = personalLoanFlow.step4
        const botMessage: Message = {
          id: Date.now().toString(),
          text: step.message,
          sender: 'bot',
          timestamp: new Date(),
          buttons: step.buttons,
        }
        setMessages(prev => [...prev, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        updateCurrentThread([...messages, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        return
      }
      
      if (conversationFlow.step === 4) {
        setConversationFlow({ type: 'personal', step: 5, answers })
        setConversationStage('high-intent')
        const step = personalLoanFlow.step5
        const botMessage: Message = {
          id: Date.now().toString(),
          text: step.message,
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        updateCurrentThread([...messages, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        return
      }
    }
    
    if (conversationFlow.type === 'business') {
      const currentStep = `step${conversationFlow.step}` as keyof typeof businessLoanFlow
      const answers = { ...conversationFlow.answers, [currentStep]: buttonValue }
      
      if (conversationFlow.step === 1) {
        setConversationFlow({ type: 'business', step: 2, answers })
        const step = businessLoanFlow.step2
        const botMessage: Message = {
          id: Date.now().toString(),
          text: step.message,
          sender: 'bot',
          timestamp: new Date(),
          buttons: step.buttons,
        }
        setMessages(prev => [...prev, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        updateCurrentThread([...messages, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        return
      }
      
      if (conversationFlow.step === 2) {
        // Store financing purpose in memory
        const updatedMemory = {
          ...conversationMemory,
          userInfo: { ...conversationMemory.userInfo, financingPurpose: buttonValue },
        }
        setConversationMemory(updatedMemory)
        setConversationFlow({ type: 'business', step: 3, answers })
        setConversationStage('high-intent')
        
        // Use memory to personalize response
        const memory = updatedMemory.userInfo
        let personalizedMessage = 'Thanks for sharing.\n\nWe help SMEs structure financing properly, even when banks are more strict.'
        
        if (memory.businessStatus === 'cash_flow_tight') {
          personalizedMessage += '\n\nSince cash flow is tight, we can help structure the application to show your business\'s potential, not just current numbers.'
        } else if (memory.businessStatus === 'newly_incorporated') {
          personalizedMessage += '\n\nFor newly incorporated businesses, some banks are more flexible than others. We know which ones to approach.'
        }
        
        const botMessage: Message = {
          id: Date.now().toString(),
          text: personalizedMessage,
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        updateCurrentThread([...messages, 
          { id: (Date.now() - 1).toString(), text: buttonLabel, sender: 'user', timestamp: new Date() },
          botMessage
        ])
        return
      }
    }
    
    // For other buttons, send as regular message
    handleSendMessage(buttonLabel)
  }

  const handleSendMessage = async (quickText?: string) => {
    const messageText = quickText || inputValue.trim()
    if (!messageText || isLoading) return

    // Check if user has completed the funnel (has selected Personal/Business after Level 2)
    const hasCompletedFunnel = conversationFlow.type === 'personal' || conversationFlow.type === 'business'
    const isFirstMessage = messages.length === 1
    const hasSelectedLevel1 = messages.some(m => 
      m.sender === 'user' && (m.text === 'Learn & Understand' || m.text === 'My Situation' || m.text === 'Others')
    )
    
    // If user types before completing funnel, redirect them
    if (!hasCompletedFunnel && !isFirstMessage && hasSelectedLevel1) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'user',
        timestamp: new Date(),
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'To guide you properly, please start by choosing one of the options below 🙂',
        sender: 'bot',
        timestamp: new Date(),
        buttons: [
          { label: 'Learn & Understand', value: 'learn_understand' },
          { label: 'My Situation', value: 'my_situation' },
          { label: 'Others', value: 'others' },
        ],
      }
      const newMessages = [...messages, userMessage, botMessage]
      setMessages(newMessages)
      updateCurrentThread(newMessages)
      if (!quickText) setInputValue('')
      return
    }
    
    // If user types on first message, redirect to Level 1 categories
    if (isFirstMessage || (!hasSelectedLevel1 && !hasCompletedFunnel)) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'user',
        timestamp: new Date(),
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'To guide you properly, please start by choosing one of the options below 🙂',
        sender: 'bot',
        timestamp: new Date(),
        buttons: [
          { label: 'Learn & Understand', value: 'learn_understand' },
          { label: 'My Situation', value: 'my_situation' },
          { label: 'Others', value: 'others' },
        ],
      }
      const newMessages = [...messages, userMessage, botMessage]
      setMessages(newMessages)
      updateCurrentThread(newMessages)
      if (!quickText) setInputValue('')
      return
    }

    // Detect intent and update memory
    const detectedIntent = detectIntent(messageText, conversationMemory as ConversationMemory)
    setConversationMemory(prev => ({
      ...prev,
      intent: detectedIntent,
      questionsAsked: [...prev.questionsAsked, messageText],
    }))
    
    // Check for high intent - trigger handoff immediately
    if (detectHighIntent(messageText) || detectedIntent === 'ready-to-apply') {
      setConversationStage('high-intent')
      const highIntent = getHighIntentResponse()
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'user',
        timestamp: new Date(),
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: highIntent.message,
        sender: 'bot',
        timestamp: new Date(),
        buttons: highIntent.buttons,
      }
      const newMessages = [...messages, userMessage, botMessage]
      setMessages(newMessages)
      updateCurrentThread(newMessages)
      if (!quickText) setInputValue('')
      return
    }
    
    // Handle different intents
    if (detectedIntent === 'comparing') {
      // Show advantages and educate
      setConversationStage('mid')
    } else if (detectedIntent === 'just-curious' || detectedIntent === 'browsing') {
      // Educate and provide information
      setConversationStage('mid')
    }
    
    // Update conversation stage based on message count
    if (messages.length <= 2) {
      setConversationStage('early')
    } else if (messages.length <= 6) {
      setConversationStage('mid')
    } else {
      setConversationStage('high-intent')
    }

    console.log('[Chat] send() called')
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    }

    // Show user message immediately
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    updateCurrentThread(newMessages)
    
    if (!quickText) {
      setInputValue('')
    }
    setIsLoading(true)
    setDebugInfo(null) // Clear previous debug info

    // Build payload
    const payload = {
      threadId: currentThreadId,
      messages: newMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    }
    
    console.log('[Chat] Payload sent:', JSON.stringify(payload, null, 2))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('[Chat] Response status:', response.status, response.statusText)

      // Log detailed fetch error information
      if (!response.ok) {
        const statusCode = response.status
        let responseText = ''
        let errorData: any = { error: 'Unknown error occurred' }
        
        try {
          responseText = await response.text()
          console.log('[Chat] Response text (error):', responseText)
          errorData = JSON.parse(responseText)
        } catch (parseError) {
          console.error('[Chat] Failed to parse error response as JSON:', parseError)
          console.error('[Chat] Raw response text:', responseText)
          errorData = { error: responseText || `HTTP ${statusCode}: ${response.statusText}` }
        }
        
        console.error('[Chat] Fetch error details:', {
          status: statusCode,
          statusText: response.statusText,
          error: errorData.error,
          responseText: responseText.substring(0, 500),
        })
        
        // Show debug info in dev mode
        if (isDev) {
          setDebugInfo({
            status: statusCode,
            error: errorData.error || `HTTP ${statusCode}: ${response.statusText}`,
            response: responseText.substring(0, 1000),
          })
        }
        
        throw new Error(errorData.error || `HTTP ${statusCode}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('[Chat] Response JSON:', JSON.stringify(data, null, 2))
      
      // Check if API returned an error message
      if (data.error) {
        console.error('[Chat] API returned error in response:', data.error)
        if (isDev) {
          setDebugInfo({
            status: response.status,
            error: data.error,
            response: JSON.stringify(data, null, 2),
          })
        }
        throw new Error(data.error)
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date(),
        citations: data.citations,
      }

      const updatedMessages = [...newMessages, botMessage]
      setMessages(updatedMessages)
      updateCurrentThread(updatedMessages)

      // Removed auto-open appointment form - user must click button explicitly
    } catch (error) {
      console.error('[Chat] Chat error caught:', error)
      if (error instanceof Error) {
        console.error('[Chat] Error name:', error.name)
        console.error('[Chat] Error message:', error.message)
        console.error('[Chat] Error stack:', error.stack)
      }
      
      // Provide a more helpful error message
      let errorText = 'I apologize, I\'m having trouble connecting.'
      let debugInfo = ''
      
      if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('API key')) {
          errorText = 'I apologize, the service is not properly configured. Please contact us directly via WhatsApp or book an appointment.'
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorText = 'I apologize, there seems to be a connection issue. Please check your internet connection and try again, or contact us directly via WhatsApp.'
        } else {
          errorText = `I apologize, there was an error: ${error.message}. Would you like to speak with a consultant directly via WhatsApp?`
        }
        
        // Add debug info in development mode
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          debugInfo = ` [DEBUG: ${error.name}: ${error.message}]`
        }
      }
      
      errorText += ' Would you like to speak with a consultant directly via WhatsApp?'
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText + debugInfo,
        sender: 'bot',
        timestamp: new Date(),
      }
      const updatedMessages = [...newMessages, errorMessage]
      setMessages(updatedMessages)
      updateCurrentThread(updatedMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const testConnection = async () => {
    setConnectionTestResult('Testing...')
    setDebugInfo(null)
    try {
      console.log('[Chat] Testing connection to GET /api/chat')
      const response = await fetch('/api/chat', {
        method: 'GET',
      })
      console.log('[Chat] Test response status:', response.status)
      
      const responseText = await response.text()
      console.log('[Chat] Test response text:', responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        data = { raw: responseText }
      }
      
      const resultMsg = response.ok 
        ? `✓ Connection OK (${response.status}): ${JSON.stringify(data)}`
        : `✗ Connection failed (${response.status}): ${JSON.stringify(data)}`
      
      setConnectionTestResult(resultMsg)
      
      if (!response.ok) {
        setDebugInfo({
          status: response.status,
          error: `GET /api/chat returned ${response.status}`,
          response: responseText.substring(0, 1000),
        })
      }
      
      console.log('[Chat] Connection test result:', data)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setConnectionTestResult(`✗ Connection failed: ${errorMsg}`)
      setDebugInfo({
        error: error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown error',
        response: 'Network error - route may not exist',
      })
      console.error('[Chat] Connection test error:', error)
    }
  }

  const openWhatsApp = (message?: string) => {
    const defaultMsg = message || 'Hello! I\'d like to learn more about your loan services.'
    // WhatsApp number should match the one in your API route
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6591234567'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const appointmentMsg = `Appointment Request:
Name: ${appointmentData.name}
Phone: ${appointmentData.phone}
Email: ${appointmentData.email}
Company: ${appointmentData.company}
Preferred Date: ${appointmentData.date}
Preferred Time: ${appointmentData.time}
Purpose: ${appointmentData.purpose}`
    
    openWhatsApp(appointmentMsg)
    setShowAppointmentForm(false)
    setAppointmentData({
      date: '',
      time: '',
      name: '',
      phone: '',
      email: '',
      company: '',
      purpose: '',
    })
  }

  const currentThread = threads.find(t => t.id === currentThreadId)

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          ${isOpen ? 'w-14 h-14 md:w-16 md:h-16' : 'px-4 py-3 md:px-5 md:py-3.5'}
          bg-gradient-to-r from-primary to-teal
          hover:from-primary-dark hover:to-teal-dark
          ${isOpen ? 'rounded-full' : 'rounded-full md:rounded-full'}
          flex items-center justify-center gap-2
          shadow-lg hover:shadow-2xl
          transition-all duration-300
          transform hover:scale-105
          group
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
        aria-label="Chat with us"
      >
        {isOpen ? (
          <X className="w-7 h-7 md:w-8 md:h-8 text-white" />
        ) : (
          <>
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white fill-white flex-shrink-0" />
            <span className="hidden md:block text-white font-semibold text-sm md:text-base whitespace-nowrap">
              Chat with us
            </span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[700px] h-[600px] bg-white rounded-2xl shadow-2xl flex border border-gray-200 overflow-hidden transform transition-all duration-300">
          {/* Left Sidebar - Threads */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="font-semibold text-gray-900 mb-3">Chats</h3>
              <button
                onClick={createNewThread}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary to-teal text-white rounded-lg hover:from-primary-dark hover:to-teal-dark transition-all font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>

            {/* Threads List */}
            <div className="flex-1 overflow-y-auto p-2">
              {threads.length === 0 ? (
                <div className="text-center text-gray-500 text-sm mt-8">
                  No chats yet. Start a new conversation!
                </div>
              ) : (
                threads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`group relative w-full mb-1 rounded-lg transition-all ${
                      currentThreadId === thread.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <button
                      onClick={() => switchThread(thread.id)}
                      className={`w-full text-left px-3 py-2 pr-10 rounded-lg transition-all ${
                        currentThreadId === thread.id
                          ? 'text-white'
                          : 'text-gray-700'
                      }`}
                    >
                      <div className={`text-sm font-medium truncate ${
                        currentThreadId === thread.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {thread.title}
                      </div>
                      <div className={`text-xs mt-1 ${
                        currentThreadId === thread.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {thread.messages.length} messages
                      </div>
                    </button>
                    <button
                      onClick={(e) => deleteThread(thread.id, e)}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-opacity-20 transition-all opacity-0 group-hover:opacity-100 ${
                        currentThreadId === thread.id
                          ? 'hover:bg-white/20 text-white'
                          : 'hover:bg-red-100 text-red-600'
                      }`}
                      aria-label="Delete chat"
                      title="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Main Chat */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary to-teal text-white p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">Claire - Brilliance Advisory</h3>
                  <p className="text-xs text-white/90">AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Appointment Form */}
            {showAppointmentForm && (
              <div className="absolute inset-0 bg-white z-20 flex flex-col">
              <div className="bg-gradient-to-r from-primary to-teal text-white p-4 flex items-center justify-between">
                <h3 className="font-semibold">Book an Appointment</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAppointmentForm(false)}
                    className="text-white hover:bg-white/20 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Back to Chat
                  </button>
                  <button
                    onClick={() => setShowAppointmentForm(false)}
                    className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAppointmentSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={appointmentData.name}
                    onChange={(e) => setAppointmentData({...appointmentData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={appointmentData.phone}
                    onChange={(e) => setAppointmentData({...appointmentData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={appointmentData.email}
                    onChange={(e) => setAppointmentData({...appointmentData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={appointmentData.company}
                    onChange={(e) => setAppointmentData({...appointmentData, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                  <input
                    type="time"
                    required
                    value={appointmentData.time}
                    onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose/Query</label>
                  <textarea
                    value={appointmentData.purpose}
                    onChange={(e) => setAppointmentData({...appointmentData, purpose: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-teal text-white px-4 py-2 rounded-lg hover:from-primary-dark hover:to-teal-dark transition-all font-semibold"
                >
                  Submit via WhatsApp
                </button>
              </form>
            </div>
          )}

            {/* Messages Container */}
            {!showAppointmentForm && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-primary to-teal text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Bot className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-primary">Claire</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      
                      {/* Citations */}
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs font-semibold text-gray-600 mb-1">Sources:</div>
                          {message.citations.map((citation, idx) => (
                            <a
                              key={idx}
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-primary hover:underline mb-1"
                            >
                              {idx + 1}. {citation.title}
                            </a>
                          ))}
                        </div>
                      )}
                      
                      {/* Buttons */}
                      {message.buttons && message.buttons.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          {message.buttons.map((button, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleButtonClick(button.value, button.label)}
                              disabled={isLoading}
                              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-primary"
                            >
                              {button.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        <span className="text-sm text-gray-500">Claire is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
                
                {/* Suggested Questions - Show when chat is new or after bot's greeting */}
                {messages.length <= 2 && !isLoading && (
                  <div className="px-2 pb-2">
                    <p className="text-xs text-gray-500 mb-2 px-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(question)}
                          disabled={isLoading}
                          className="px-3 py-2 text-xs bg-white border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

                {/* Dynamic CTA based on conversation stage */}
                <div className="px-4 py-2 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="flex gap-2">
                  {conversationStage === 'early' && (
                    <button
                      onClick={() => openWhatsApp()}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </button>
                  )}
                  {conversationStage === 'mid' && (
                    <button
                      onClick={() => openWhatsApp()}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </button>
                  )}
                  {conversationStage === 'high-intent' && (
                    <>
                      <button
                        onClick={() => setShowAppointmentForm(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Calendar className="w-4 h-4" />
                        Book appointment
                      </button>
                      <button
                        onClick={() => openWhatsApp()}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp now
                      </button>
                    </>
                  )}
                </div>
              </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                  {(() => {
                    // Check if user has completed funnel (must select Personal/Business after Level 2)
                    const hasCompletedFunnel = conversationFlow.type === 'personal' || conversationFlow.type === 'business'
                    const hasSelectedLevel1 = messages.some(m => 
                      m.sender === 'user' && (m.text === 'Learn & Understand' || m.text === 'My Situation' || m.text === 'Others')
                    )
                    // Disable input if: not first message AND (hasn't selected Level 1 OR selected Level 1 but not completed funnel)
                    const isFirstMessage = messages.length === 1
                    const isInputDisabled = !isFirstMessage && (!hasSelectedLevel1 || (!hasCompletedFunnel && hasSelectedLevel1))
                    
                    return (
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isInputDisabled ? "Please select an option above first..." : "Type your message..."}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                        disabled={isLoading || isInputDisabled}
                      />
                    )
                  })()}
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-primary to-teal hover:from-primary-dark hover:to-teal-dark text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Information provided is general and subject to assessment by financial institutions.
                </p>
              </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
