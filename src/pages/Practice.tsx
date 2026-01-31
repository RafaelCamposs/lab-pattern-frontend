import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { getPatternByName } from '../data/designPatterns';
import { patternApi, challengeApi, submissionApi, getUserIdFromToken, type Pattern, type Challenge, type SubmissionResponse } from '../services/api';
import SubmissionModal from '../components/SubmissionModal';
import LoadingModal from '../components/LoadingModal';
import { SkeletonLoader } from '../components/SkeletonLoader';
import './Practice.css';

type Language = 'javascript' | 'python' | 'java' | 'cpp' | 'typescript';

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  java: java(),
  cpp: cpp(),
  typescript: javascript({ typescript: true })
};

const languageNames = {
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  typescript: 'TypeScript'
};

interface PracticeChallengeState {
  challenge: Challenge;
  code: string;
  language: Language;
  selectedPatternName: string;
  submitted: boolean;
}

const STORAGE_KEY = 'practice-challenge-state';

export default function Practice() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [selectedPatternName, setSelectedPatternName] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [generatingChallenge, setGeneratingChallenge] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load persisted challenge state on mount
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const fetchedPatterns = await patternApi.getAllPatterns();
        setPatterns(fetchedPatterns);

        // Try to load saved challenge state
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          try {
            const state: PracticeChallengeState = JSON.parse(savedState);
            setChallenge(state.challenge);
            setCode(state.code);
            setLanguage(state.language);
            setSelectedPatternName(state.selectedPatternName);
            setHasSubmitted(state.submitted);

            // If challenge was submitted, fetch the submission result
            if (state.submitted) {
              const userId = getUserIdFromToken();
              if (userId) {
                try {
                  const submissions = await submissionApi.getUserSubmissionsForChallenge(userId, state.challenge.id);
                  if (submissions.length > 0) {
                    // Get the most recent submission
                    setSubmissionResult(submissions[submissions.length - 1]);
                  }
                } catch (error) {
                  console.error('Failed to fetch submission:', error);
                }
              }
            }
          } catch (error) {
            console.error('Failed to parse saved challenge state:', error);
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        // Set default pattern if no saved state
        if (!savedState && fetchedPatterns.length > 0) {
          setSelectedPatternName(fetchedPatterns[0].name);
        }
      } catch (error) {
        console.error('Failed to fetch patterns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatterns();
  }, []);

  const currentPattern = getPatternByName(selectedPatternName);

  // Update code when pattern or language changes (only if no active challenge)
  useEffect(() => {
    if (currentPattern && !challenge) {
      setCode(currentPattern.code[language] || '');
    }
  }, [currentPattern, language, challenge]);

  const handlePatternChange = (patternName: string) => {
    setSelectedPatternName(patternName);
    const pattern = getPatternByName(patternName);
    if (pattern) {
      setCode(pattern.code[language]);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if (currentPattern) {
      setCode(currentPattern.code[lang]);
    }
  };

  // Save challenge state to localStorage whenever it changes
  useEffect(() => {
    if (challenge && selectedPatternName) {
      const state: PracticeChallengeState = {
        challenge,
        code,
        language,
        selectedPatternName,
        submitted: hasSubmitted,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [challenge, code, language, selectedPatternName, hasSubmitted]);

  const handleGenerateChallenge = async () => {
    if (!hasSubmitted && challenge) {
      alert('Por favor, envie seu desafio atual antes de gerar um novo.');
      return;
    }

    setGeneratingChallenge(true);
    try {
      const generatedChallenge = await challengeApi.generateChallenge();
      setChallenge(generatedChallenge);
      setHasSubmitted(false);
      setSubmissionResult(null); // Reset submission result

      // Reset code to default template
      if (currentPattern) {
        setCode(currentPattern.code[language]);
      }
    } catch (error) {
      console.error('Failed to generate challenge:', error);
      alert('Falha ao gerar desafio. Por favor, tente novamente.');
    } finally {
      setGeneratingChallenge(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge) {
      alert('Nenhum desafio ativo para enviar.');
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      alert('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    const pattern = patterns.find(p => p.name === selectedPatternName);
    if (!pattern) {
      alert('Padrão não encontrado.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submission = await submissionApi.submitSolution({
        userId,
        challengeId: challenge.id,
        patternId: pattern.id,
        code,
        language,
      });

      setHasSubmitted(true);
      setSubmissionResult(submission);
      setIsSubmitting(false);
      setIsModalOpen(true);

      // Clear the challenge state from localStorage after submission
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to submit solution:', error);
      setIsSubmitting(false);
      alert('Falha ao enviar solução. Por favor, tente novamente.');
    }
  };

  if (loading || !currentPattern) {
    return (
      <div className="practice-container">
        <div className="problem-panel">
          <div className="problem-content">
            <div className="skeleton-loading-header">
              <div className="skeleton skeleton-text" style={{ width: '50%', height: '2rem', marginBottom: '1.5rem' }}></div>
            </div>
            <section>
              <div className="skeleton skeleton-text" style={{ width: '20%', height: '1.25rem', marginBottom: '1rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '100%', height: '1rem', marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '95%', height: '1rem', marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '90%', height: '1rem' }}></div>
            </section>
          </div>
        </div>

        <div className="code-panel">
          <div className="code-header">
            <div className="skeleton skeleton-text" style={{ width: '150px', height: '2.5rem' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '100px', height: '2.5rem' }}></div>
          </div>
          <div className="code-editor">
            <SkeletonLoader variant="card" height="calc(100vh - 140px)" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingModal isOpen={isSubmitting} />
      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={submissionResult}
      />
      <div className="practice-container">
        <div className="problem-panel">
        <div className="problem-content">
          {!challenge ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h2>Pronto para Praticar?</h2>
              <p>Gere um novo desafio para começar a praticar padrões de projeto e melhorar suas habilidades de programação.</p>
              <button
                className="btn-primary btn-large"
                onClick={handleGenerateChallenge}
                disabled={generatingChallenge}
              >
                {generatingChallenge ? 'Gerando...' : 'Gerar Novo Desafio'}
              </button>
            </div>
          ) : (
            <>
              <div className="pattern-info">
                <h1>{challenge.title}</h1>
              </div>
              <section>
                <h3>Descrição</h3>
                <p style={{ whiteSpace: 'pre-line' }}>
                  {challenge.description}
                </p>
              </section>
            </>
          )}
        </div>
      </div>

      <div className="code-panel">
        <div className="code-header">
          <div className="left-controls">
            <select
              id="pattern-select"
              className="pattern-select-compact"
              value={selectedPatternName}
              onChange={(e) => handlePatternChange(e.target.value)}
              title="Selecionar Padrão"
            >
              {patterns.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>

            <select
              id="language-select"
              className="language-select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              title="Selecionar Linguagem"
            >
              {Object.entries(languageNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div className="code-actions">
            {challenge && (
              <>
                {hasSubmitted ? (
                  <>
                    <button
                      className="btn-primary"
                      onClick={handleGenerateChallenge}
                      disabled={generatingChallenge}
                    >
                      {generatingChallenge ? 'Gerando...' : 'Novo Desafio'}
                    </button>
                    <button
                      className="btn-primary"
                      onClick={async () => {
                        // If submission result isn't loaded, fetch it
                        if (!submissionResult && challenge) {
                          const userId = getUserIdFromToken();
                          if (userId) {
                            try {
                              const submissions = await submissionApi.getUserSubmissionsForChallenge(userId, challenge.id);
                              if (submissions.length > 0) {
                                setSubmissionResult(submissions[submissions.length - 1]);
                              }
                            } catch (error) {
                              console.error('Failed to fetch submission:', error);
                              alert('Falha ao carregar resultados da submissão. Por favor, tente novamente.');
                              return;
                            }
                          }
                        }
                        setIsModalOpen(true);
                      }}
                    >
                      Ver Resultados
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="code-editor">
          <CodeMirror
            value={code}
            height="calc(100vh - 70px)"
            theme={oneDark}
            extensions={[languageExtensions[language]]}
            onChange={(value) => setCode(value)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>
      </div>
      </div>
    </>
  );
}
