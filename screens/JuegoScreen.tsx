import React, { useEffect, useState } from "react";
import { AppRegistry, StyleSheet, Text, View, Modal, Button } from "react-native";
import { TouchableOpacity, GestureHandlerRootView } from "react-native-gesture-handler";
import { db } from "../config/Config";
import { ref, set, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { Audio } from 'expo-av';

const BOARD_X = 10;
const BOARD_Y = 16;

const SHAPES: number[][][] = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
];

interface TetrisPiece {
  x: number;
  y: number;
  shape: number[][];
}

class Tetris {
  board: number[][];
  piece: TetrisPiece;
  gameOver: boolean;
  score: number;
  fallSpeed: number;
  private backupBoard: number[][];

  constructor() {
    this.board = Array(BOARD_Y).fill("").map(() => Array(BOARD_X).fill(0));
    this.piece = {
      x: 0,
      y: 0,
      shape: [[]],
    };
    this.gameOver = false;
    this.score = 0;
    this.fallSpeed = 1000;
    this.generatePiece();
    this.backupBoard = this.cloneBoard();
  }

  generatePiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.piece = {
      x: Math.floor(BOARD_X / 2),
      y: 0,
      shape: this.cloneShape(shape),
    };

    if (!this.check()) {
      this.gameOver = true;
    } else {
      this.place();
    }
  }

  place({ remove = false, stick = false } = {}) {
    const { shape } = this.piece;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        const newY = this.piece.y + y;
        const newX = this.piece.x + x;

        if (shape[y][x] === 1) {
          this.board[newY][newX] = remove ? 0 : stick ? 2 : 1;
        }
      }
    }
  }

  check({ dx = 0, dy = 0 } = {}, rotatedPiece?: TetrisPiece) {
    const { shape } = rotatedPiece || this.piece;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[0].length; x++) {
        const newY = (rotatedPiece ? rotatedPiece.y : this.piece.y) + y + dy;
        const newX = (rotatedPiece ? rotatedPiece.x : this.piece.x) + x + dx;

        if (newX < 0 || newX >= BOARD_X) {
          return false;
        }
        if (newY >= BOARD_Y) {
          return false;
        }

        if (shape[y][x] === 1 && this.board[newY][newX] === 2) {
          return false;
        }
      }
    }
    return true;
  }

  clearLines() {
    let linesCleared = 0;
    this.board.forEach((row, i) => {
      if (row.every((cell) => cell === 2)) {
        this.board.splice(i, 1);
        this.board.unshift(Array(BOARD_X).fill(0));
        linesCleared++;
      }
    });

    if (linesCleared > 0) {
      this.score += linesCleared * 100;
    }
  }

  move({ dx = 0, dy = 0 }) {
    const valid = this.check({ dx, dy });

    if (!valid && dy) {
      this.place({ stick: true });
      this.clearLines();
      this.generatePiece();
      return;
    }

    if (!valid) {
      this.board = this.cloneBoard();
      return;
    }

    this.place({ remove: true });
    this.piece.x += dx;
    this.piece.y += dy;
    this.place();
  }

  rotate() {
    const newShape = this.rotateShape(this.piece.shape);

    const rotatedPiece = { ...this.piece, shape: this.cloneShape(newShape) };

    if (this.check({ dy: 0 }, rotatedPiece)) {
      this.place({ remove: true });
      this.piece = rotatedPiece;
      this.place();
    }
  }

  rotateShape(original: number[][]): number[][] {
    const rows = original.length;
    const cols = original[0].length;
    const newShape: number[][] = [];

    for (let i = 0; i < cols; i++) {
      const newRow: number[] = [];
      for (let j = rows - 1; j >= 0; j--) {
        newRow.push(original[j][i]);
      }
      newShape.push(newRow);
    }

    return newShape;
  }

  increaseFallSpeed() {
    this.fallSpeed = Math.max(this.fallSpeed - 100, 100);
  }
  updateScore(userId: string, userName: string) {
    if (userName) {
      const scoreRef = ref(db, `scores/${userId}`);
      set(scoreRef, {
        userName: userName,
        score: this.score,
      });
    } else {

    }
  }

  private cloneBoard(): number[][] {
    return this.board.map(row => [...row]);
  }

  private cloneShape(original: number[][]): number[][] {
    return original.map(row => [...row]);
  }
}

const tetris = new Tetris();

const COLORS = ["green", "blue", "red", "orange", "purple"];

const TetrisGames: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showStartGameModal, setShowStartGameModal] = useState(true);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [_, render] = useState({});
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  async function playSound() {
    if (sound !== null) {
      if (!musicPlaying) {
        await sound.playAsync();
        setMusicPlaying(true);
      } else {
        await sound.stopAsync();
        setMusicPlaying(false);
      }
    }
  }

  const [falling, setFalling] = useState(false);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        setUserId(userId);

        const userRef = ref(db, `users/${userId}`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserName(userData.nombre);
          }
        });

        const autoFall = () => {
          tetris.move({ dy: 1 });
          if (!tetris.gameOver) {
            setTimeout(autoFall, tetris.fallSpeed);
          } else {
            tetris.updateScore(userId, userName);
            setShowModal(true);

            // Stop the sound when the game is over
            if (sound) {
              sound.stopAsync();
            }
          }
        };

        if (falling) {
          autoFall();
        }
      }
    });

    const loadSound = async () => {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(require('../assets/TeS.mp3'));
      setSound(sound);

      console.log('Sound loaded');
    };


    return () => unsubscribe();
  }, [userName, falling]);

  const startFalling = () => {
    setFalling(true);
    setShowStartGameModal(false);
    autoFall(); // Inicia el movimiento automático hacia abajo
    playSound(); // Inicia la música
  };


  const autoFall = () => {
    tetris.move({ dy: 1 });
    render({});
    if (!tetris.gameOver) {
      setTimeout(autoFall, tetris.fallSpeed);
    } else {
      tetris.updateScore(userId, userName);
      setShowModal(true);
    }
  };

  const handleMoveLeft = () => {
    tetris.move({ dx: -1 });
    render({});
  };

  const handleMoveRight = () => {
    tetris.move({ dx: 1 });
    render({});
  };

  const handleRotate = () => {
    tetris.rotate();
    render({});
  };

  const handleFallSpeedUp = () => {
    tetris.increaseFallSpeed();
  };

  const handleRestart = async () => {
    tetris.gameOver = false;
    tetris.score = 0;
    tetris.board = Array(BOARD_Y).fill("").map(() => Array(BOARD_X).fill(0));
    tetris.generatePiece();
    tetris.updateScore(userId, userName);
    setShowModal(false);
    setFalling(false);
    render({});
    startFalling();
    await playSound();
  };

  const handleStartGame = async () => {
    tetris.gameOver = false;
    tetris.score = 0;
    tetris.board = Array(BOARD_Y).fill("").map(() => Array(BOARD_X).fill(0));
    tetris.generatePiece();
    tetris.updateScore(userId, userName);
    setShowStartGameModal(false);
    setFalling(false);
    render({});
    
    // Detener la música con un pequeño retardo
    if (sound) {
      await sound.stopAsync();
      await new Promise(resolve => setTimeout(resolve, 500)); // Ajusta el retardo según sea necesario
  
      // Reiniciar la música y comenzar el juego
      await playSound();
      startFalling();
    }
  };

  const cellStyles = (cell: number, y: number) => {
    let backgroundColor;
    if (cell === 1) {
      backgroundColor = "silver";
    } else if (cell === 2) {
      backgroundColor = COLORS[y % COLORS.length];
    } else {
      backgroundColor = "black";
    }

    return {
      width: 40,
      height: 40,
      borderWidth: 1,
      borderColor: "white",
      backgroundColor,
    };
  };

  return (
    <GestureHandlerRootView>
      <>
        <Text style={styles.scoreText}>Tetris</Text>
        <Text style={styles.scoreText}>Score: {tetris.score}</Text>
        <View>
          {tetris.board.map((row, i) => (
            <View key={i} style={{ flexDirection: "row" }}>
              {row.map((cell, j) => (
                <View key={j} style={cellStyles(cell, i)} />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleMoveLeft} style={styles.button}>
            <Text><FontAwesome name="arrow-left" size={24} color="black" /></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMoveRight} style={styles.button}>
            <Text><FontAwesome name="arrow-right" size={24} color="black" /></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRotate} style={styles.button}>
            <Text><Fontisto name="arrow-return-left" size={24} color="black" /></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFallSpeedUp} style={styles.button}>
            <Text><Entypo name="arrow-down" size={24} color="black" /></Text>
          </TouchableOpacity>
        </View>


        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.scoreText}>Score: {tetris.score}</Text>

              <Button title="Restart" onPress={handleRestart} />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showStartGameModal}
          onRequestClose={() => setShowStartGameModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.gameStartText}>¡Empezar Juego!</Text>
              <Button title="Comenzar" onPress={startFalling} />
            </View>
          </View>
        </Modal>
      </>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24, // Tamaño más grande
    fontWeight: "bold", // Negrita
    textAlign: 'center',
  },
  gameStartText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default TetrisGames;