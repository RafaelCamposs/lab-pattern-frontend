import './LoadingModal.css';

interface LoadingModalProps {
  isOpen: boolean;
}

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="loading-modal-content">
        <div className="loading-spinner"></div>
        <h2>Processing Submission</h2>
        <p>Please wait while we evaluate your solution...</p>
      </div>
    </div>
  );
}
