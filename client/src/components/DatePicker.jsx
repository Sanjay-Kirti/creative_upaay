const DatePicker = ({ dates, selectedDate, onSelect }) => {
  const formatDay = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.getDate();
  };

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
      {dates.map((dateStr) => {
        const isSelected = selectedDate === dateStr;
        return (
          <button
            key={dateStr}
            id={`date-${dateStr}`}
            onClick={() => onSelect(dateStr)}
            className={`flex flex-col items-center justify-center min-w-[56px] h-[68px] rounded-xl border text-sm font-medium transition-colors flex-shrink-0 ${isSelected
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-gray-300 text-gray-600 hover:border-primary'
              }`}
          >
            <span className="text-xs">{formatDay(dateStr)}</span>
            <span className="text-lg font-bold">{formatDate(dateStr)}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DatePicker;
