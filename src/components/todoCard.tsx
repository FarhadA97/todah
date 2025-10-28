import { Todo } from "@/types"
import { formatDateTime } from "@/utils"
import { CheckCircle2, Circle, Trash2 } from "lucide-react"
import Link from "next/link"

export const TodoCard = ({
  todo,
  currentDate,
  onToggle,
  onDelete
}: {
  todo: Todo
  currentDate: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) => {
  const isDoneToday = todo.doneDates.includes(currentDate)
  const totalCompletions = todo.doneDates.length

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(todo.id)}
          disabled={isDoneToday}
          className={`flex-shrink-0 mt-1 transition-all ${
            isDoneToday
              ? 'cursor-not-allowed opacity-50'
              : 'hover:scale-110 cursor-pointer'
          }`}
          aria-label={isDoneToday ? 'Already completed today' : 'Mark as done'}
        >
          {isDoneToday ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <Link href={`/todo/${todo.id}`} className="group">
            <h3 className={`text-lg font-medium mb-1 group-hover:text-indigo-600 transition-colors ${
              isDoneToday ? 'text-gray-700' : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
            <span>Created {formatDateTime(todo.createdAt)}</span>
            {isDoneToday && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Done today
              </span>
            )}
            {totalCompletions > 0 && (
              <span className="text-xs text-gray-400">
                {totalCompletions} {totalCompletions === 1 ? 'day' : 'days'} completed
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(todo.id)}
          className="shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete todo"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
