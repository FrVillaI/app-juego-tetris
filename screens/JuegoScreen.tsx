// TetrisGames.tsx
import React, { useEffect, useState } from "react";
import { AppRegistry, StyleSheet, Text, View, Modal, Button } from "react-native";
import { TouchableOpacity, GestureHandlerRootView } from "react-native-gesture-handler";

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
  }

  generatePiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.piece = {
      x: Math.floor(BOARD_X / 2),
      y: 0,
      shape,
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
        this.board[newY][newX] = remove ? 0 : stick ? 2 : shape[y][x];
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

        if (this.board[newY][newX] === 2) {
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
      return;
    }

    this.place({ remove: true });
    this.piece.x += dx;
    this.piece.y += dy;
    this.place();
  }

  rotate() {
    const newShape: number[][] = [];
    for (let i = 0; this.piece.shape[0] && i < this.piece.shape[0].length; i++) {
      const newRow: number[] = [];
      for (let j = this.piece.shape.length - 1; j >= 0; j--) {
        newRow.push(this.piece.shape[j][i]);
      }
      newShape.push(newRow);
    }

    const rotatedPiece = { ...this.piece, shape: newShape };

    if (this.check({ dy: 0 }, rotatedPiece)) {
      this.place({ remove: true });
      this.piece = rotatedPiece;
      this.place();
    }
  }

  increaseFallSpeed() {
    this.fallSpeed = Math.max(this.fallSpeed - 100, 100);
  }
}

const tetris = new Tetris();

const COLORS = ["green", "blue", "red", "orange", "purple"]; // Agrega más colores según sea necesario

const TetrisGames: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [_, render] = useState({});

  useEffect(() => {
    const fall = () => {
      tetris.move({ dy: 1 });
      render({});
      if (tetris.gameOver) {
        // Show modal when the game is over
        setShowModal(true);
      } else {
        setTimeout(fall, tetris.fallSpeed);
      }
    };

    fall();
  }, []);

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

  const handleStartGame = () => {
    tetris.gameOver = false;
    tetris.score = 0;
    tetris.board = Array(BOARD_Y).fill("").map(() => Array(BOARD_X).fill(0));
    tetris.generatePiece();
    setShowModal(false);
    render({});
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
        <Text>Tetris</Text>
        <Text>Score: {tetris.score}</Text>
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
              <Button title="Restart" onPress={handleRestart} />
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

const App = () => (
  <GestureHandlerRootView>
    <TetrisGames />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent("YourAppName", () => App);
