import React, { useEffect, useState } from 'react';
import { useI18n } from '../../providers/i18n';

const Countdown = ({ targetDate }) => {
  const i18n = useI18n();
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(countdownInterval); // Cleanup interval on unmount
  }, [targetDate]);

  return (
<div className="countdown-timer p-2 rounded-lg border border-dashed border-primary  max-w-lg mx-auto">
  {/* <div className="text-xl font-semibold text-center mb-2 text-primary">
    {i18n?.t('Hurry Up')}
  </div> */}
  
  <div className="flex justify-center gap-1 text-lg font-medium text-gray-800">
    <div className="flex flex-col items-center border border-primary p-1">
      <div className="text-sm font-extrabold text-primary">{timeRemaining.days}</div>
      <div className="text-xs text-gray-600">Days</div>
    </div>
    <div className="flex flex-col items-center border border-primary p-1">
      <div className="text-sm font-extrabold text-primary ">{timeRemaining.hours}</div>
      <div className="text-xs text-gray-600">Hours</div>
    </div>
    <div className="flex flex-col items-center border border-primary p-1">
      <div className="text-sm font-extrabold text-primary">{timeRemaining.minutes}</div>
      <div className="text-xs text-gray-600">Minutes</div>
    </div>
    <div className="flex flex-col items-center border border-primary p-1">
      <div className="text-sm font-extrabold text-primary">{timeRemaining.seconds}</div>
      <div className="text-xs text-gray-600">Seconds</div>
    </div>
  </div>
</div>

  );
};

export default Countdown;
