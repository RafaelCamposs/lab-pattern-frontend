import { useState, useEffect } from 'react';
import { userApi, submissionApi, getUserIdFromToken, type Challenge, type PageResponse, type SubmissionResponse } from '../services/api';
import SubmissionModal from '../components/SubmissionModal';
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
      alert('User not authenticated. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const response: PageResponse<Challenge> = await userApi.getUserChallenges(userId, page, 15);
      setChallenges(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      alert('Failed to load challenges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeClick = async (challengeId: string) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    setLoadingSubmission(true);
    try {
      const submissions = await submissionApi.getUserSubmissionsForChallenge(userId, challengeId);
      if (submissions.length > 0) {
        setSubmissionResult(submissions[submissions.length - 1]);
        setIsModalOpen(true);
      } else {
        alert('No submission found for this challenge.');
      }
    } catch (error) {
      console.error('Failed to fetch submission:', error);
      alert('Failed to load submission. Please try again.');
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
    return <div className="challenges-loading">Loading challenges...</div>;
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
          <h1>My Challenges</h1>
          <p>View all challenges you've completed</p>
        </div>

        {challenges.length === 0 ? (
          <div className="empty-challenges">
            <p>No challenges completed yet. Start practicing to see your progress here!</p>
          </div>
        ) : (
          <>
            <div className="challenges-table-container">
              <table className="challenges-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Published Date</th>
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
                          <span className="badge badge-daily">Daily</span>
                        ) : (
                          <span className="badge badge-practice">Practice</span>
                        )}
                      </td>
                      <td>{new Date(challenge.publishedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
