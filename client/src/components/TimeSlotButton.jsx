const TimeSlotButton = ({ time, isSelected, isAvailable = true, onClick }) => {
  let className = 'px-4 py-2 rounded-full text-sm font-medium border transition-colors ';

  if (isSelected) {
    className += 'bg-primary border-primary text-white';
  } else if (isAvailable) {
    className += 'bg-white border-gray-300 text-primary hover:border-primary cursor-pointer';
  } else {
    className += 'bg-white border-gray-200 text-gray-400 cursor-not-allowed';
  }

  return (
    <button
      id={`time-slot-${time.replace(/[\s:]/g, '-')}`}
      className={className}
      onClick={() => isAvailable && onClick?.(time)}
      disabled={!isAvailable}
    >
      {time}
    </button>
  );
};

export default TimeSlotButton;
