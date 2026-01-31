import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'stat-card' | 'challenge-card';
  count?: number;
  height?: string;
  width?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  count = 1,
  height,
  width,
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'stat-card':
        return (
          <div className="skeleton-stat-card">
            <div className="skeleton skeleton-stat-icon"></div>
            <div className="skeleton-stat-content">
              <div className="skeleton skeleton-text" style={{ width: '60%', height: '1.5rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '40%', height: '0.875rem', marginTop: '0.5rem' }}></div>
            </div>
          </div>
        );

      case 'challenge-card':
        return (
          <div className="skeleton-challenge-card">
            <div className="skeleton-challenge-header">
              <div className="skeleton skeleton-text" style={{ width: '70%', height: '1.25rem' }}></div>
              <div className="skeleton skeleton-circle" style={{ width: '24px', height: '24px' }}></div>
            </div>
            <div className="skeleton-challenge-body">
              <div className="skeleton skeleton-text" style={{ width: '100%', height: '0.875rem', marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '90%', height: '0.875rem', marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '80%', height: '0.875rem' }}></div>
            </div>
            <div className="skeleton-challenge-footer">
              <div className="skeleton skeleton-text" style={{ width: '30%', height: '0.875rem' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '25%', height: '0.875rem' }}></div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div
            className="skeleton skeleton-card"
            style={{ height: height || '200px', width: width || '100%' }}
          ></div>
        );

      case 'circle':
        return (
          <div
            className="skeleton skeleton-circle"
            style={{ height: height || '40px', width: width || '40px' }}
          ></div>
        );

      case 'text':
      default:
        return (
          <div
            className="skeleton skeleton-text"
            style={{ height: height || '1rem', width: width || '100%' }}
          ></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;
