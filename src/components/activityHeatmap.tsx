import { Todo } from "@/types";

export const ActivityHeatmap = ({ todo, currentDate }: { todo: Todo; currentDate: string }) => {
    const today = new Date(currentDate)
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    const monthName = firstDay.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const days: (null | { day: number; dateStr: string; isDone: boolean; isToday: boolean })[] = []

    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const isDone = todo.doneDates.includes(dateStr)
        const isToday = dateStr === currentDate
        days.push({ day, dateStr, isDone, isToday })
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{monthName} Activity</h2>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekdays.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => (
                    <div key={idx} className="aspect-square">
                        {day ? (
                            <div
                                className={`w-full h-full rounded-lg flex items-center justify-center text-sm font-medium transition-all ${day.isDone
                                        ? 'bg-green-500 text-white shadow-sm'
                                        : day.isToday
                                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                title={`${day.dateStr}${day.isDone ? ' - Completed' : ''}${day.isToday ? ' - Today' : ''}`}
                            >
                                {day.day}
                            </div>
                        ) : (
                            <div className="w-full h-full" />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                    <span>Not done</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-100 border-2 border-indigo-400 rounded"></div>
                    <span>Today</span>
                </div>
            </div>
        </div>
    )
}
