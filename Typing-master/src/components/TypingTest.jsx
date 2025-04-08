import React, { useEffect, useState } from "react";

const SENTENCE_BANK = [
  "Hello world!",
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes a person perfect in every field.",
  "Typing fast requires consistent training and focus.",
  "React is a powerful JavaScript library for building UIs.",
  "Discipline is the bridge between goals and accomplishment.",
  "Hard work beats talent when talent doesn't work hard.",
  "Never give up, because great things take time.",
  "Consistency is the key to long term success.",
  "Dream big and dare to fail.",
  "Small habits lead to big results.",
  "Learning never exhausts the mind.",
  "Your only limit is your mind.",
  "Stay focused and never quit.",
  "Speed comes with practice and patience.",
];

const TypingTest = () => {
  const [sentence, setSentence] = useState(getRandomSentence());
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [bestWPM, setBestWPM] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  function getRandomSentence() {
    return SENTENCE_BANK[Math.floor(Math.random() * SENTENCE_BANK.length)];
  }

  useEffect(() => {
    if (startTime && !isFinished) {
      const id = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      setIntervalId(id);
    }
    return () => clearInterval(intervalId);
  }, [startTime]);

  const getWPM = () => {
    const words = sentence.trim().split(" ").length;
    const minutes = timer / 60;
    return Math.max(0, Math.round(words / minutes || 0));
  };

  const getAccuracy = () => {
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === sentence[i]) correct++;
    }
    return Math.round((correct / sentence.length) * 100);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());
    setInput(value);

    if (value === sentence) {
      clearInterval(intervalId);
      setIsFinished(true);
      const wpm = getWPM();
      const accuracy = getAccuracy();
      setBestWPM(Math.max(bestWPM, wpm));
      setBestAccuracy(Math.max(bestAccuracy, accuracy));
      if (soundOn) playBeep();
      if (autoNext) {
        setTimeout(() => resetTest(getRandomSentence()), 3000);
      }
    }
  };

  const resetTest = (newSentence = sentence) => {
    setSentence(newSentence);
    setInput("");
    setStartTime(null);
    setTimer(0);
    setIsFinished(false);
  };

  const playBeep = () => {
    const audio = new Audio("https://www.soundjay.com/buttons/beep-07.mp3");
    audio.play();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-center">🔥 Advanced Typing Speed Tester</h1>

      {/* Sentence display */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono leading-relaxed text-lg sm:text-xl">
        {sentence.split("").map((char, idx) => {
          let style = "";
          if (idx < input.length) {
            style = char === input[idx] ? "text-green-500" : "text-red-500";
          } else if (idx === input.length) {
            style = "underline text-blue-600";
          }
          return (
            <span key={idx} className={style}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Input box */}
      <textarea
        rows={3}
        className="w-full border border-gray-300 dark:border-gray-700 rounded p-3 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring focus:ring-blue-500"
        value={input}
        onChange={handleChange}
        placeholder="Start typing here..."
        disabled={isFinished && autoNext}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <Stat label="Time" value={`${timer}s`} />
        <Stat label="WPM" value={isFinished ? getWPM() : "-"} />
        <Stat label="Accuracy" value={isFinished ? `${getAccuracy()}%` : "-"} />
        <Stat label="Progress" value={`${input.length}/${sentence.length}`} />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(input.length / sentence.length) * 100}%` }}
        />
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 gap-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <Stat label="Best WPM" value={bestWPM} />
        <Stat label="Best Accuracy" value={`${bestAccuracy}%`} />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <button
          onClick={() => resetTest(getRandomSentence())}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          New Sentence
        </button>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={autoNext} onChange={() => setAutoNext(!autoNext)} />
            Auto Next
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={soundOn} onChange={() => setSoundOn(!soundOn)} />
            Sound On Finish
          </label>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <p className="text-sm">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default TypingTest;
