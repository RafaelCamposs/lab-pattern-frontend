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
        <h2>Processando Submissão</h2>
        <p>Por favor, aguarde enquanto avaliamos sua solução...</p>
      </div>
    </div>
  );
}
