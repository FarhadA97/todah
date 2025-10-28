'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { formatDateTime, getMsUntilMidnight, getTodayString } from '@/utils'
import { STORAGE_KEY } from '@/contants'
import { Todo } from '@/types'
import { ActivityStats } from '@/components/activityStats'
import { ActivityHeatmap } from '@/components/activityHeatmap'

export default function TodoDetailPage() {
    const params = useParams() as { id: string };
    const router = useRouter()
    const [todo, setTodo] = useState<Todo | null>(null)
    const [currentDate, setCurrentDate] = useState(getTodayString())
    console.log(params.id);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const todos: Todo[] = JSON.parse(stored)
                const foundTodo = todos.find(t => t.id === params.id)
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setTodo(foundTodo || null)
            } catch (e) {
                console.error('Failed to parse todos from localStorage', e)
            }
        }
    }, [params.id])

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

    if (!todo) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">Todo not found</p>
                    <button
                        onClick={() => router.push('/')}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Back to list
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to todos
            </button>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{todo.title}</h1>
                <p className="text-gray-600">Created {formatDateTime(todo.createdAt)}</p>
            </div>

            <ActivityStats todo={todo} currentDate={currentDate} />
            <ActivityHeatmap todo={todo} currentDate={currentDate} />
        </div>
    )
}
