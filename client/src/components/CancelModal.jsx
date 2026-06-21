const CancelModal = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl mx-6 p-6 w-full max-w-[320px] shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          Cancel Booking?
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to cancel this booking? This action cannot be undone and your seats will be released.
        </p>

        <div className="flex gap-3">
          <button
            id="cancel-modal-no"
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            No, Keep
          </button>
          <button
            id="cancel-modal-yes"
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 text-white font-medium rounded-xl text-sm hover:bg-red-600 transition-colors"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
