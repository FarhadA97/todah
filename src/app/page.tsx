'use client'

import { Toast } from "@/components/toast"
import { TodoCard } from "@/components/todoCard"
import { STORAGE_KEY } from "@/contants"
import { Todo } from "@/types"
import { getMsUntilMidnight, getTodayString } from "@/utils"
import { Calendar } from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentDate, setCurrentDate] = useState(getTodayString())
  const [toast, setToast] = useState<string | null>(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTodos(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse todos from localStorage', e)
      }
    }
  }, [])

  useEffect(() => {
    if (todos && todos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
  }, [todos])

  useEffect(() => {
    const scheduleRefresh = () => {
      const ms = getMsUntilMidnight()
      const timer = setTimeout(() => {
        setCurrentDate(getTodayString())
        scheduleRefresh()
      }, ms)
      return timer
    }

    const timer = scheduleRefresh()
    return () => clearTimeout(timer)
  }, [])

  const showToast = (message: string) => {
    setToast(message)
  }

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      createdAt: new Date().toISOString(),
      doneDates: []
    }
    setTodos(prev => [newTodo, ...prev])
    showToast('Todo created!')
  }

  const toggleTodo = (id: string) => {
    const today = currentDate
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const isDoneToday = todo.doneDates.includes(today)
        if (!isDoneToday) {
          showToast('Todo completed for today!')
          return { ...todo, doneDates: [...todo.doneDates, today] }
        }
      }
      return todo
    }))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    showToast('Todo deleted')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      addTodo(input.trim())
      setInput('')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Todos</h1>
        <p className="text-gray-600">Track your daily habits and tasks</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-3 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No todos yet. Create one to get started!</p>
          </div>
        ) : (
          todos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              currentDate={currentDate}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
