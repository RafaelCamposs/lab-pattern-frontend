import { useEffect, useState } from 'react';
import { userApi, getUserIdFromToken, type UserStatistics, type Challenge } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SkeletonLoader } from '../components/SkeletonLoader';
import './Dashboard.css';

interface DailyActivity {
  date: string;
  challenges: number;
}

export default function Home() {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = getUserIdFromToken();

        if (!userId) {
          throw new Error('ID do usuário não encontrado');
        }

        const stats = await userApi.getUserStatistics(userId);
        setStatistics(stats);

        const challengesResponse = await userApi.getUserChallenges(userId, 0, 100);
        const activityData = processLast30Days(challengesResponse.content);
        setDailyActivity(activityData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Falha ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processLast30Days = (challenges: Challenge[]): DailyActivity[] => {
    const last30Days: DailyActivity[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const count = challenges.filter(challenge => {
        const publishedDate = new Date(challenge.publishedAt);
        return publishedDate.toDateString() === date.toDateString();
      }).length;

      last30Days.push({
        date: dateStr,
        challenges: count
      });
    }

    return last30Days;
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>Bem-vindo ao PatternLab</h1>
        <p className="page-description">Acompanhe seu progresso e melhore suas habilidades em padrões de projeto</p>

        {/* Statistics Cards Skeleton */}
        <div className="stats-grid">
          <SkeletonLoader variant="stat-card" count={4} />
        </div>

        {/* Chart Section Skeleton */}
        <div className="chart-section">
          <div className="skeleton-loading-header">
            <div className="skeleton skeleton-text" style={{ width: '40%', height: '1.5rem', marginBottom: '1rem' }}></div>
          </div>
          <SkeletonLoader variant="card" height="300px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Bem-vindo ao PatternLab</h1>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Bem-vindo ao PatternLab</h1>
      <p className="page-description">Acompanhe seu progresso e melhore suas habilidades em padrões de projeto</p>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon challenges">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-number">{statistics?.completedChallenges || 0}</span>
            <span className="stat-label">Desafios Concluídos</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-number">{statistics?.percentage || 0}%</span>
            <span className="stat-label">Taxa de Sucesso</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon streak">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-number">{statistics?.currentStreak || 0}</span>
            <span className="stat-label">Sequência Atual</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon trophy">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-number">{statistics?.longestStreak || 0}</span>
            <span className="stat-label">Maior Sequência</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <h2>Visão Geral de Atividades - Últimos 30 Dias</h2>
        {dailyActivity.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#718096' }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#718096' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ color: '#2d3748', fontWeight: 600 }}
                itemStyle={{ color: '#667eea' }}
              />
              <Bar
                dataKey="challenges"
                fill="#667eea"
                radius={[8, 8, 0, 0]}
                name="Desafios"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-placeholder">
            <p>Nenhum dado de atividade disponível</p>
          </div>
        )}
      </div>
    </div>
  );
}
