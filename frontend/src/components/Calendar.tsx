import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface CalendarProps {
    events?: Date[];
    selectedDate?: Date | null;
    onDateSelect: (date: Date) => void;
    className?: string;
}

export const Calendar = ({ events = [], selectedDate, onDateSelect, className }: CalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const hasEvent = (date: Date) => {
        return events.some(eventDate => isSameDay(eventDate, date));
    };

    // Calculate empty cells for start of month alignment
    const startDay = startOfMonth(currentMonth).getDay();
    const emptyCells = Array(startDay).fill(null);

    return (
        <div className={twMerge("bg-white p-4 rounded-xl shadow-sm border", className)}>
            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="font-semibold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {emptyCells.map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {daysInMonth.map((date) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    const hasRide = hasEvent(date);
                    const isTodayDate = isToday(date);

                    return (
                        <button
                            key={date.toString()}
                            onClick={() => onDateSelect(date)}
                            className={twMerge(
                                "h-9 w-9 rounded-full flex flex-col items-center justify-center relative transition-colors",
                                !isCurrentMonth && "text-gray-300",
                                isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700",
                                isTodayDate && !isSelected && "text-blue-600 font-bold"
                            )}
                        >
                            <span className="text-sm">{format(date, 'd')}</span>
                            {hasRide && (
                                <span className={twMerge(
                                    "w-1 h-1 rounded-full absolute bottom-1",
                                    isSelected ? "bg-white" : "bg-blue-500"
                                )} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
