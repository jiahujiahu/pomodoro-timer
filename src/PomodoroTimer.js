import React, {useState, useEffect, useRef} from 'react';
import animeImage from './anime_image.jpg';
import bgm from './anime_bgm.mp3';
import notificationSound from './notification_sound.mp3';
import './PomodoroTimer.css'; // Import the CSS file for styling

const WORK_MODE = {
    WORK: 'WORK',
    SHORT_BREAK: 'SHORT_BREAK',
    LONG_BREAK: 'LONG_BREAK'
}

const INITIAL_TIME = {
    ['WORK']: 25,
    ['SHORT_BREAK']: 5,
    ['LONG_BREAK']: 15
}
const PomodoroTimer = () => {
    const [cycles, setCycles] = useState(4); // Number of Pomodoro cycles
    const [currentCycle, setCurrentCycle] = useState(1);
    const [time, setTime] = useState(INITIAL_TIME.WORK); 
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [startMode, setStartMode] = useState(WORK_MODE.WORK); // Initial start mode: 'work', 'shortBreak', 'longBreak'
    const audioRef = useRef(new Audio(bgm));
    const notificationSoundRef = useRef(new Audio(notificationSound));

    useEffect(() => {
        let interval = null;

        if (isActive && time > 0) {
            // Timer is active and time is not up
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (!isActive && time > 0) {
            // Time is not active and time is not up

        } else if (time === 0) {
            // Timer is not active and time is up
            clearInterval(interval);
            playNotificationSound();
            if (startMode !== WORK_MODE.WORK) {
                // Handle break time completion
                if (currentCycle < cycles) {
                    // Start the next work cycle
                    setCurrentCycle((prevCycle) => prevCycle + 1);
                    setMode(WORK_MODE.WORK);
                    setIsActive(true);
                    playBackgroundMusic();
                } else {
                    // All cycles completed, reset the timer
                    setCurrentCycle(1);
                    setMode(WORK_MODE.WORK);
                }
            } else {
                // Handle work time completion, start the break
                setMode(WORK_MODE.SHORT_BREAK);
                setIsActive(true);
                playBackgroundMusic();
            }
        }

        return () => clearInterval(interval);
    }, [isActive, time, currentCycle, cycles, isPaused]);

    const setMode = (mode) => {
        setIsActive(false);
        setIsPaused(false);
        setStartMode(mode);
        setTime(INITIAL_TIME[mode]);
        pauseBackgroundMusic();
    }

    const startTimer = () => {
        // Start the work timer
        setIsActive(true);
        playBackgroundMusic();
    };

    const pauseResumeTimer = () => {
        if (isActive) { 
            pauseBackgroundMusic();
        } else { 
            playBackgroundMusic();
        }
        setIsActive(!isActive);
        setIsPaused(!isPaused);
    };

    const skipTimer = () => {
        // skip the time
        setTime(0);
    };


    const resetTimer = () => {
        // Reset the time
        setMode(startMode);
        setIsActive(false);
        setIsPaused(false);
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
                {!isPaused && !isActive ?
                    <button className="btn start-btn" onClick={startTimer}>Start</button> :
                    <>
                        <button className="btn pause-btn"
                            onClick={pauseResumeTimer}>{isActive ? 'Pause' : 'Resume'}
                        </button>
                        <button className="btn reset-btn" onClick={skipTimer}>Skip</button>
                    </>
                }
                <button className="btn start-btn" onClick={() => setMode(WORK_MODE.WORK)}
                        disabled={startMode === WORK_MODE.WORK}>Pomodoro
                </button>
                <button className="btn start-btn" onClick={() => setMode(WORK_MODE.SHORT_BREAK)}
                        disabled={startMode === WORK_MODE.SHORT_BREAK}>Short Break
                </button>
                <button className="btn start-btn" onClick={() => setMode(WORK_MODE.LONG_BREAK)}
                        disabled={startMode === WORK_MODE.LONG_BREAK}>Long Break
                </button>
                <button className="btn reset-btn" onClick={resetTimer}>Reset</button>
            </div>
            <div className="cycle-info">
                <p>Current Cycle: {currentCycle}</p>
                <p>Total Cycles: {cycles}</p>
            </div>
            <img className="anime-image" src={animeImage} alt="Anime"/>
        </div>
    );
};

export default PomodoroTimer;
