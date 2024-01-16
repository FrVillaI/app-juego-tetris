import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

interface HighScore {
  player: string;
  score: number;
}

const HighScores: React.FC = () => {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [newScore, setNewScore] = useState<number | null>(null);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyCr3icEja3B45Z1hBGSF1mii696EXFIT9o",
      authDomain: "taller-173fd.firebaseapp.com",
      databaseURL: "https://taller-173fd-default-rtdb.firebaseio.com",
      projectId: "taller-173fd",
      storageBucket: "taller-173fd.appspot.com",
      messagingSenderId: "349541614927",
      appId: "1:349541614927:web:7197ed0dcf6599d0f1b13a"
    };
    
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    const scoresRef = firebase.database().ref('highScores');

    const handleSnapshot = (snapshot: firebase.database.DataSnapshot | null) => {
      try {
        const scoresData = snapshot?.val();
        if (scoresData) {
          const scoresArray = Object.values(scoresData) as HighScore[];
          setHighScores(scoresArray.sort((a, b) => b.score - a.score));
        }
      } catch (error) {
        console.error('Error fetching scores from Firebase:', error);
      }
    };

    scoresRef.on('value', handleSnapshot);

    return () => {
      scoresRef.off('value', handleSnapshot);
    };
  }, []);

  const handleSaveScore = () => {
    if (newScore !== null) {
      const playerName = prompt('Enter your name:');
      if (playerName) {
        const scoresRef = firebase.database().ref('highScores');
        scoresRef.push({ player: playerName, score: newScore });
        setNewScore(null);
      }
    }
  };
  return (
    <div>
      <h1>All Scores</h1>
      <ul>
        {highScores.map((score, index) => (
          <li key={index}>
            {score.player}: {score.score}
          </li>
        ))}
      </ul>
      <div>
        <h2>Your Score: {newScore !== null ? newScore : 'N/A'}</h2>
        <button onClick={() => setNewScore(Math.floor(Math.random() * 100))}>
          Generate Random Score
        </button>
        <button onClick={handleSaveScore}>Save Score</button>
      </div>
    </div>
  );
};

export default HighScores;