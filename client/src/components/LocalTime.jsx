import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Karachi',
});

const now = () => formatter.format(new Date());

// Current time in Karachi, updated every 15 seconds.
export default function LocalTime() {
  const [time, setTime] = useState(now);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(now()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  return <time className="local-time">{time}</time>;
}
