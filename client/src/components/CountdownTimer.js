import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './CountdownTimer.css';

const CountdownTimer = ({ targetDate, title = 'Ưu đãi kết thúc sau', onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        if (onComplete) onComplete();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (isExpired) {
    return null;
  }

  const TimeUnit = ({ value, label }) => (
    <motion.div
      className="time-unit"
      key={value}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="time-value">{String(value).padStart(2, '0')}</div>
      <div className="time-label">{label}</div>
    </motion.div>
  );

  return (
    <div className="countdown-timer">
      <div className="countdown-title">{title}</div>
      <div className="countdown-display">
        <TimeUnit value={timeLeft.days} label="Ngày" />
        <span className="time-separator">:</span>
        <TimeUnit value={timeLeft.hours} label="Giờ" />
        <span className="time-separator">:</span>
        <TimeUnit value={timeLeft.minutes} label="Phút" />
        <span className="time-separator">:</span>
        <TimeUnit value={timeLeft.seconds} label="Giây" />
      </div>
    </div>
  );
};

export default CountdownTimer;
