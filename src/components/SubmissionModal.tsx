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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Submission Result</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="modal-body">

          {hasEvaluation ? (
            <div className="evaluation-section">
              <h3>Evaluation</h3>
              <div className="score-container">
                <span className="score-label">Score:</span>
                <span className={`score-value ${score && score >= 70 ? 'score-good' : 'score-low'}`}>
                  {score}%
                </span>
              </div>
              {feedback && (
                <div className="feedback-container">
                  <h4>Feedback:</h4>

                  {hasKeyPoints && (
                    <div className="feedback-section">
                      <h5>Key Points</h5>
                      <ul className="feedback-list">
                        {feedback.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hasStrengths && (
                    <div className="feedback-section strengths">
                      <h5>Strengths</h5>
                      <ul className="feedback-list">
                        {feedback.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hasImprovements && (
                    <div className="feedback-section improvements">
                      <h5>Areas for Improvement</h5>
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
              <p className="pending-message">Evaluation is pending...</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
