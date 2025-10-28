import { Todo } from "@/types";

export const ActivityStats = ({ todo, currentDate }: { todo: Todo; currentDate: string }) => {
    const today = new Date(currentDate)
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const thisMonthDates = todo.doneDates.filter(dateStr => {
        const date = new Date(dateStr)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const totalDays = thisMonthDates.length
    const isDoneToday = todo.doneDates.includes(currentDate)

    // Calculate current streak
    let streak = 0
    const sortedDates = [...todo.doneDates].sort().reverse()
    const checkDate = new Date(currentDate)

    for (const dateStr of sortedDates) {
        const checkDateStr = checkDate.toLocaleDateString('en-CA')

        if (dateStr === checkDateStr) {
            streak++
            checkDate.setDate(checkDate.getDate() - 1)
        } else if (dateStr < checkDateStr) {
            break
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Summary</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-3xl font-bold text-indigo-600">{totalDays}</div>
                    <div className="text-sm text-gray-600 mt-1">Days this month</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{streak}</div>
                    <div className="text-sm text-gray-600 mt-1">Current streak</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{todo.doneDates.length}</div>
                    <div className="text-sm text-gray-600 mt-1">Total completions</div>
                </div>
            </div>
            {isDoneToday && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
                    ✓ Completed today!
                </div>
            )}
        </div>
    )
}