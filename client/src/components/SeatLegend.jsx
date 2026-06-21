const SeatLegend = () => {
  return (
    <div className="flex items-center justify-center gap-6 py-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md border border-seat-border bg-white" />
        <span className="text-xs text-gray-500">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-seat-occupied" />
        <span className="text-xs text-gray-500">Occupied</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-primary" />
        <span className="text-xs text-gray-500">Selected</span>
      </div>
    </div>
  );
};

export default SeatLegend;
