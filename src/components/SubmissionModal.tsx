import { type SubmissionResponse } from '../services/api';
import './SubmissionModal.css';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionResponse | null;
}

export default function SubmissionModal({ isOpen, onClose, submission }: SubmissionModalProps) {
  if (!isOpen || !submission) return null;

  const hasEvaluation = submission.evaluation !== null;
  const score = hasEvaluation ? submission.evaluation?.score : null;
  const feedback = hasEvaluation ? submission.evaluation?.feedback : null;

  const hasKeyPoints = feedback?.keyPoints && feedback.keyPoints.length > 0;
  const hasStrengths = feedback?.strengths && feedback.strengths.length > 0;
  const hasImprovements = feedback?.improvements && feedback.improvements.length > 0;

  const isCorrectPattern = submission.selectedPatternName === submission.expectedPatternName;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Resultado da Submissão</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar modal">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* Submitted Code Section */}
          <div className="code-section">
            <h3>Seu Código</h3>
            <div className="code-display">
              <div className="code-header">
                <span className="language-badge">{submission.language}</span>
              </div>
              <pre>
                <code>{submission.code}</code>
              </pre>
            </div>
          </div>

          {hasEvaluation ? (
            <div className="evaluation-section">
              <h3>Avaliação</h3>

              {submission.selectedPatternName && submission.expectedPatternName && (
                <div className="pattern-result-section">
                  <div className={`pattern-result-item ${isCorrectPattern ? 'correct' : 'incorrect'}`}>
                    <span className="pattern-result-label">Sua Resposta:</span>
                    <span className="pattern-result-value">{submission.selectedPatternName}</span>
                    {isCorrectPattern ? (
                      <span className="result-icon">✓</span>
                    ) : (
                      <span className="result-icon">✗</span>
                    )}
                  </div>
                  {!isCorrectPattern && (
                    <div className="pattern-result-item correct">
                      <span className="pattern-result-label">Resposta Correta:</span>
                      <span className="pattern-result-value">{submission.expectedPatternName}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="score-container">
                <span className="score-label">Pontuação:</span>
                <span className={`score-value ${score && score >= 70 ? 'score-good' : 'score-low'}`}>
                  {score}%
                </span>
              </div>
              {feedback && (
                <div className="feedback-container">
                  <h4>Feedback:</h4>

                  {hasKeyPoints && (
                    <div className="feedback-section">
                      <h5>Pontos-Chave</h5>
                      <ul className="feedback-list">
                        {feedback.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hasStrengths && (
                    <div className="feedback-section strengths">
                      <h5>Pontos Fortes</h5>
                      <ul className="feedback-list">
                        {feedback.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hasImprovements && (
                    <div className="feedback-section improvements">
                      <h5>Áreas para Melhoria</h5>
                      <ul className="feedback-list">
                        {feedback.improvements.map((improvement, index) => (
                          <li key={index}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="evaluation-section">
              <p className="pending-message">Avaliação pendente...</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
