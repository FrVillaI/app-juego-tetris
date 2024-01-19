// TetrisGames.tsx
import React, { useEffect, useState } from "react";
import { AppRegistry, StyleSheet, Text, View, Modal, Button } from "react-native";
import { TouchableOpacity, GestureHandlerRootView } from "react-native-gesture-handler";
import { getDatabase, ref, get, update,set  } from 'firebase/database';
import { db } from "../config/Config";
import { auth } from '../config/Config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { Audio } from 'expo-av';


const BOARD_X = 8;
const BOARD_Y = 15;

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

const COLORS = ["green", "blue", "red", "orange", "purple"]; // Agrega más colores según sea necesario

const TetrisGames: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [_, render] = useState({});
  const [puntaje, setpuntaje] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [tetris, setTetris] = useState(new Tetris());

  const handleStartGame = () => {
    setGameStarted(true);
  };

  function writeUserData(score:any) {
    const db = getDatabase();
    const user = auth.currentUser;
    update(ref(db, 'users/' + user?.uid), {
      score:tetris.score
  });

  }


  useEffect(() => {
    if (gameStarted) { // Modificado para ejecutarse solo si el juego ha comenzado
      const fall = () => {
        tetris.move({ dy: 1 });
        render({});
        if (tetris.gameOver) {
          setShowModal(true);
        } else {
          setpuntaje(tetris.score);
          writeUserData(puntaje)
          setTimeout(fall, tetris.fallSpeed);
        }
      };

      fall();
    }
  }, [gameStarted]);

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

  const handleRestart = () => {
    tetris.gameOver = false;
    tetris.score = 0;
    tetris.board = Array(BOARD_Y).fill("").map(() => Array(BOARD_X).fill(0));
    tetris.generatePiece();
    setShowModal(false);
    render({});
  };

  const handleRestartGame = () => {

    setGameStarted(false); // Detener el juego
    setShowModal(false); // Ocultar el modal
    setTetris(new Tetris()); // Crear una nueva instancia de Tetris
    render({}); // Forzar la actualización del componente
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
    <GestureHandlerRootView style={styles.container}>
      <>
        <Text style={styles.title}>Score: {tetris.score}</Text>
        <View style={styles.board}>
          {tetris.board.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((cell, j) => (
                <View key={j} style={cellStyles(cell, i)} />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleStartGame} style={styles.startButton}>
            <Text>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMoveLeft} style={styles.button}>
            <Text>🢀</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMoveRight} style={styles.button}>
            <Text>🢂</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRotate} style={styles.button}>
            <Text>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFallSpeedUp} style={styles.button}>
            <Text>⏬</Text>
          </TouchableOpacity>
        </View>

        {/* Game Over Modal */}
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
              <Button title="Restart" onPress={handleRestartGame} />
            </View>
          </View>
        </Modal>
      </>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  score: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  board: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
  startButton: {
    backgroundColor: "lightgreen",
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
    fontSize: 18,
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
