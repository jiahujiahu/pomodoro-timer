import React, { useState, useEffect, useRef } from 'react';
import animeImage from './anime_image.jpg';
import bgm from './anime_bgm.mp3';
import notificationSound from './notification_sound.mp3';
import './PomodoroTimer.css'; // Import the CSS file for styling

const PomodoroTimer = () => {
  const [workTime, setWorkTime] = useState(1500); // Initial work time in seconds (25 minutes)
  const [shortBreakTime, setShortBreakTime] = useState(30); // Short break time in seconds (5 minutes)
  const [longBreakTime, setLongBreakTime] = useState(900); // Long break time in seconds (15 minutes)
  const [cycles, setCycles] = useState(4); // Number of Pomodoro cycles
  const [currentCycle, setCurrentCycle] = useState(1);
  const [time, setTime] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [startMode, setStartMode] = useState('work'); // Initial start mode: 'work', 'shortBreak', 'longBreak'
  const audioRef = useRef(new Audio(bgm));
  const notificationSoundRef = useRef(new Audio(notificationSound));

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      // Timer is active and time is not up
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && time === 0) {
      // Timer is not active and time is up
      clearInterval(interval);
      if (isBreak) {
        // Handle break time completion
        if (currentCycle < cycles) {
          // Start the next work cycle
          setCurrentCycle((prevCycle) => prevCycle + 1);
          setTime(workTime);
        } else {
          // All cycles completed, reset the timer
          setCurrentCycle(1);
          setTime(workTime);
          setIsActive(false);
          setIsBreak(false);
          pauseBackgroundMusic();
          playNotificationSound();
        }
      } else {
        // Handle work time completion, start the break
        setIsActive(true);
        setIsBreak(true);
        setTime(shortBreakTime);
        playBackgroundMusic();
      }
    }

    return () => clearInterval(interval);
  }, [isActive, time, workTime, shortBreakTime, longBreakTime, currentCycle, cycles, isBreak]);

  const startWorkTimer = () => {
    // Start the work timer
    setStartMode('work');
    setIsActive(true);
    setIsBreak(false);
    setTime(workTime);
    playBackgroundMusic();
  };

  const startShortBreakTimer = () => {
    // Start the short break timer
    setStartMode('shortBreak');
    setIsActive(true);
    setIsBreak(true);
    setTime(shortBreakTime);
    playBackgroundMusic();
  };

  const startLongBreakTimer = () => {
    // Start the long break timer
    setStartMode('longBreak');
    setIsActive(true);
    setIsBreak(true);
    setTime(longBreakTime);
    playBackgroundMusic();
  };

  const pauseTimer = () => {
    // Pause the timer
    setIsActive(false);
    pauseBackgroundMusic();
  };

  const resetTimer = () => {
    // Reset the timer
    setTime(workTime);
    setIsActive(false);
    setIsBreak(false);
    pauseBackgroundMusic();
  };

  const formatTime = (time) => {
    // Format time as MM:SS
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const playBackgroundMusic = () => {
    // Play the background music
    audioRef.current.loop = true;
    audioRef.current.play();
  };

  const pauseBackgroundMusic = () => {
    // Pause the background music
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const playNotificationSound = () => {
    // Play the notification sound
    notificationSoundRef.current.play();
  };

  return (
    <div className="pomodoro-container">
      <h1 className="heading">Pomodoro Timer</h1>
      <div className="timer">{formatTime(time)}</div>
      <div className="controls">
        {!isActive && !isBreak && (
          <>
            <button className="btn start-btn" onClick={startWorkTimer}>Start Work</button>
            <button className="btn start-btn" onClick={startShortBreakTimer}>Start Short Break</button>
            <button className="btn start-btn" onClick={startLongBreakTimer}>Start Long Break</button>
          </>
        )}
        {!isActive && isBreak && (
          <>
            {startMode === 'shortBreak' && (
              <button className="btn start-btn active" onClick={startShortBreakTimer}>Start Short Break</button>
            )}
            {startMode === 'longBreak' && (
              <button className="btn start-btn active" onClick={startLongBreakTimer}>Start Long Break</button>
            )}
          </>
        )}
        {isActive && (
          <button className="btn pause-btn" onClick={pauseTimer}>Pause</button>
        )}
        <button className="btn reset-btn" onClick={resetTimer}>Reset</button>
      </div>
      <div className="cycle-info">
        <p>Current Cycle: {currentCycle}</p>
        <p>Total Cycles: {cycles}</p>
      </div>
      <img className="anime-image" src={animeImage} alt="Anime" />
    </div>
  );
};

export default PomodoroTimer;