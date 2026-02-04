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

const today = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

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

export default function DailyChallenge() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [selectedPatternName, setSelectedPatternName] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [dailyChallenge, setDailyChallenge] = useState<Challenge | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedPatterns, fetchedChallenge] = await Promise.all([
          patternApi.getAllPatterns(),
          challengeApi.getDailyChallenge()
        ]);

        setPatterns(fetchedPatterns);
        setDailyChallenge(fetchedChallenge);

        // Set the pattern based on the daily challenge's expected pattern
        const expectedPattern = fetchedPatterns.find(p => p.id === fetchedChallenge.expectedPatternId);
        if (expectedPattern) {
          setSelectedPatternName(expectedPattern.name);
        } else if (fetchedPatterns.length > 0) {
          setSelectedPatternName(fetchedPatterns[0].name);
        }

        // Check if user has already submitted for this daily challenge
        const userId = getUserIdFromToken();
        if (userId) {
          try {
            const submissions = await submissionApi.getUserSubmissionsForChallenge(userId, fetchedChallenge.id);
            if (submissions.length > 0) {
              // User has already submitted
              setHasSubmitted(true);
              setSubmissionResult(submissions[submissions.length - 1]);
            }
          } catch (error) {
            console.error('Failed to fetch submission:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Falha ao carregar desafio diário. Por favor, tente fazer login novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentPattern = getPatternByName(selectedPatternName);

  useEffect(() => {
    if (currentPattern && !code) {
      setCode(currentPattern.code[language] || '');
    }
  }, [currentPattern]);

  const handlePatternChange = (patternName: string) => {
    setSelectedPatternName(patternName);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleSubmit = async () => {
    if (!dailyChallenge) {
      alert('Nenhum desafio diário disponível.');
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
        challengeId: dailyChallenge.id,
        patternId: pattern.id,
        code,
        language,
      });

      setHasSubmitted(true);
      setSubmissionResult(submission);
      setIsSubmitting(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to submit solution:', error);
      setIsSubmitting(false);
      alert('Falha ao enviar solução. Por favor, tente novamente.');
    }
  };

  if (loading || !currentPattern || !dailyChallenge) {
    return (
      <div className="practice-container">
        <div className="problem-panel">
          <div className="problem-content">
            <div className="skeleton-loading-header">
              <div className="skeleton skeleton-text" style={{ width: '50%', height: '2rem', marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '30%', height: '0.875rem', marginBottom: '1.5rem' }}></div>
            </div>
            <section>
              <div className="skeleton skeleton-text" style={{ width: '20%', height: '1.25rem', marginBottom: '1rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '100%', height: '1rem', marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '95%', height: '1rem', marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '90%', height: '1rem', marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '85%', height: '1rem' }}></div>
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
          <div className="pattern-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1>{dailyChallenge.title}</h1>
              <div className="daily-badge" style={{ margin: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Desafio Diário</span>
              </div>
            </div>
            <p style={{ margin: '0.5rem 0', color: 'var(--text-medium)', fontSize: '0.875rem' }}>
              {today}
            </p>
          </div>
          <section>
            <h3>Descrição</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{dailyChallenge.description}</p>
          </section>
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
            {hasSubmitted ? (
              <button
                className="btn-primary"
                onClick={async () => {
                  // If submission result isn't loaded, fetch it
                  if (!submissionResult && dailyChallenge) {
                    const userId = getUserIdFromToken();
                    if (userId) {
                      try {
                        const submissions = await submissionApi.getUserSubmissionsForChallenge(userId, dailyChallenge.id);
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
            ) : (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            )}
          </div>
        </div>

        <div className="code-editor">
          <CodeMirror
            value={code}
            height="100%"
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
