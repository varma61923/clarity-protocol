import React from 'react';
import { Author } from '../types';

interface ReputationGraphProps {
  activity: Author['activity'];
  initialScore: number;
}

const ReputationGraph: React.FC<ReputationGraphProps> = ({ activity = [], initialScore }) => {
  const dataPoints = React.useMemo(() => {
    if (!activity || activity.length === 0) {
      return [{ x: 0, y: initialScore }, { x: 100, y: initialScore }];
    }
    
    const sortedActivity = [...activity].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const firstDate = new Date(sortedActivity[0].timestamp).getTime();
    const lastDate = new Date(sortedActivity[sortedActivity.length - 1].timestamp).getTime();
    const duration = lastDate - firstDate || 1; // Avoid division by zero

    let currentScore = initialScore;
    const points = [{ score: initialScore, date: firstDate - duration * 0.1 }]; // Start before first activity

    sortedActivity.forEach(event => {
      // Simplified logic for score changes
      if (event.type === 'publish') currentScore += 10;
      if (event.type === 'donation') currentScore += 50; // Example value
      if (event.type === 'vote') currentScore += 2;
      points.push({ score: currentScore, date: new Date(event.timestamp).getTime() });
    });

    const scores = points.map(p => p.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const scoreRange = maxScore - minScore || 1;

    return points.map(p => ({
      x: ((p.date - points[0].date) / (lastDate - points[0].date + duration * 0.1)) * 100,
      y: 100 - ((p.score - minScore) / scoreRange) * 100,
    }));
  }, [activity, initialScore]);

  const pathData = dataPoints.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

  return (
    <div className="w-full h-48 p-4 bg-light-surface dark:bg-dark-surface rounded-lg">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={pathData}
          fill="none"
          stroke="currentColor"
          className="text-light-primary dark:text-dark-primary"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Add circles for data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.5"
            fill="currentColor"
            className="text-light-primary dark:text-dark-primary"
          />
        ))}
         {/* Grid lines */}
        {[25, 50, 75].map(y => (
             <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" className="text-light-outline-variant/30 dark:text-dark-outline-variant/30" strokeWidth="0.5" />
        ))}
      </svg>
    </div>
  );
};

export default ReputationGraph;