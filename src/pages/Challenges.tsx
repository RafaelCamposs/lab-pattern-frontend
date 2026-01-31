import { useState, useEffect } from 'react';
import { userApi, submissionApi, getUserIdFromToken, type Challenge, type PageResponse, type SubmissionResponse } from '../services/api';
import SubmissionModal from '../components/SubmissionModal';
import { SkeletonLoader } from '../components/SkeletonLoader';
import './Challenges.css';

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  useEffect(() => {
    fetchChallenges(currentPage);
  }, [currentPage]);

  const fetchChallenges = async (page: number) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    setLoading(true);
    try {
      const response: PageResponse<Challenge> = await userApi.getUserChallenges(userId, page, 10);
      setChallenges(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      alert('Falha ao carregar desafios. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeClick = async (challengeId: string) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    setLoadingSubmission(true);
    try {
      const submissions = await submissionApi.getUserSubmissionsForChallenge(userId, challengeId);
      if (submissions.length > 0) {
        setSubmissionResult(submissions[submissions.length - 1]);
        setIsModalOpen(true);
      } else {
        alert('Nenhuma submissão encontrada para este desafio.');
      }
    } catch (error) {
      console.error('Failed to fetch submission:', error);
      alert('Falha ao carregar submissão. Por favor, tente novamente.');
    } finally {
      setLoadingSubmission(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading && challenges.length === 0) {
    return (
      <div className="challenges-container">
        <div className="challenges-header">
          <h1>Meus Desafios</h1>
          <p>Veja todos os desafios que você completou</p>
        </div>

        <div className="challenges-table-container">
          <SkeletonLoader variant="challenge-card" count={5} />
        </div>
      </div>
    );
  }

  return (
    <>
      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={submissionResult}
      />
      <div className="challenges-container">
        <div className="challenges-header">
          <h1>Meus Desafios</h1>
          <p>Veja todos os desafios que você completou</p>
        </div>

        {challenges.length === 0 ? (
          <div className="empty-challenges">
            <p>Nenhum desafio completado ainda. Comece a praticar para ver seu progresso aqui!</p>
          </div>
        ) : (
          <>
            <div className="challenges-table-container">
              <table className="challenges-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Data de Publicação</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.map((challenge) => (
                    <tr
                      key={challenge.id}
                      onClick={() => handleChallengeClick(challenge.id)}
                      className={loadingSubmission ? 'loading' : ''}
                    >
                      <td>{challenge.title}</td>
                      <td>
                        {challenge.isDaily ? (
                          <span className="badge badge-daily">Diário</span>
                        ) : (
                          <span className="badge badge-practice">Prática</span>
                        )}
                      </td>
                      <td>{new Date(challenge.publishedAt).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0 || loading}
                  className="pagination-btn"
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1 || loading}
                  className="pagination-btn"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
