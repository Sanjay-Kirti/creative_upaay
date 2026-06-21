const ProgressBar = ({ percent }) => {
  return (
    <div className="w-full h-1.5 bg-progress-unfilled rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressBar;
