const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];
const COLS = Array.from({ length: 12 }, (_, i) => i + 1);

const SeatGrid = ({ seatMap, onSeatClick }) => {
  const getSeatStyle = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-seat-occupied border-seat-occupied cursor-not-allowed';
      case 'selected':
        return 'bg-primary border-primary text-white cursor-pointer';
      default:
        return 'bg-white border-seat-border cursor-pointer hover:border-primary';
    }
  };

  const getSeatTextColor = (status) => {
    if (status === 'selected') return 'text-white';
    if (status === 'occupied') return 'text-gray-400';
    return 'text-gray-500';
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      {/* Screen curve */}
      <div className="flex flex-col items-center mb-4 px-4">
        <svg viewBox="0 0 300 30" className="w-64 h-6">
          <path
            d="M 10 25 Q 150 0 290 25"
            fill="none"
            stroke="#D1D5DB"
            strokeWidth="2.5"
          />
        </svg>
        <span className="text-xs text-gray-400 tracking-[0.2em] mt-1 font-medium">SCREEN</span>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col gap-1 px-2">
        {ROWS.map((row, rowIndex) => (
          <div key={row}>
            {/* Aisle gap between H and J */}
            {row === 'J' && <div className="h-4" />}
            <div className="flex items-center gap-1">
              <span className="w-5 text-xs text-gray-400 font-medium text-center shrink-0">{row}</span>
              <div className="flex gap-1">
                {COLS.map((col) => {
                  const seatId = `${row}${col}`;
                  const status = seatMap[seatId] || 'available';
                  return (
                    <button
                      key={seatId}
                      id={`seat-${seatId}`}
                      onClick={() => onSeatClick(seatId)}
                      disabled={status === 'occupied'}
                      className={`w-7 h-7 rounded-md border text-[10px] font-medium flex items-center justify-center transition-colors ${getSeatStyle(status)} ${getSeatTextColor(status)}`}
                    >
                      {status !== 'occupied' ? col : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
