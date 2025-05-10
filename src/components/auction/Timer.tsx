
import { useEffect, useState } from "react";

interface TimerProps {
  seconds: number;
  isRunning: boolean;
}

const Timer = ({ seconds, isRunning }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(seconds);
  
  useEffect(() => {
    setTimeRemaining(seconds);
  }, [seconds]);
  
  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsStr = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    
    return `${minutesStr}:${secondsStr}`;
  };
  
  // Determine color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-cricket-red animate-pulse-light';
    if (timeRemaining <= 30) return 'text-cricket-orange';
    return 'text-cricket-green';
  };
  
  return (
    <div className={`auction-timer font-mono ${getTimerColor()}`}>
      {formatTime(timeRemaining)}
      <div className="text-xs text-gray-500 mt-1">{isRunning ? 'BIDDING IN PROGRESS' : 'PAUSED'}</div>
    </div>
  );
};

export default Timer;
