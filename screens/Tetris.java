import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.Arrays;
import java.util.Random;

public class Tetris extends JFrame implements ActionListener, KeyListener {

    private static final int WIDTH = 10;
    private static final int HEIGHT = 20;
    private static final int BLOCK_SIZE = 30;
    private static final int DELAY = 300;

    private Timer timer;
    private boolean[][] grid;
    private int currentPieceRow, currentPieceCol;
    private int[][] currentPiece;
    private int score;

    private JPanel gamePanel;

    public Tetris() {
        setTitle("Tetris");
        setSize(WIDTH * BLOCK_SIZE + 100, (HEIGHT + 1) * BLOCK_SIZE);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        grid = new boolean[HEIGHT][WIDTH];
        currentPieceRow = 0;
        currentPieceCol = WIDTH / 2 - 1;
        score = 0;

        timer = new Timer(DELAY, this);
        timer.start();

        addKeyListener(this);
        setFocusable(true);

        generateRandomPiece();

        // Agregar botones
        JButton leftButton = new JButton("⬅");
        leftButton.addActionListener(e -> moveLeft());
        leftButton.setFocusPainted(false);
        leftButton.setBackground(Color.BLACK);
        leftButton.setForeground(Color.WHITE);

        JButton rightButton = new JButton("⮕");
        rightButton.addActionListener(e -> moveRight());
        rightButton.setFocusPainted(false);
        rightButton.setBackground(Color.BLACK);
        rightButton.setForeground(Color.WHITE);

        JButton downButton = new JButton("⬇");
        downButton.addActionListener(e -> moveDown());
        downButton.setFocusPainted(false);
        downButton.setBackground(Color.BLACK);
        downButton.setForeground(Color.WHITE);

        JButton rotateButton = new JButton("↻");
        rotateButton.addActionListener(e -> rotatePiece());
        rotateButton.setFocusPainted(false);
        rotateButton.setBackground(Color.BLACK);
        rotateButton.setForeground(Color.WHITE);

        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new GridLayout(4, 1));
        buttonPanel.add(leftButton);
        buttonPanel.add(rightButton);
        buttonPanel.add(downButton);
        buttonPanel.add(rotateButton);

        gamePanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                drawPiece(g);
                drawGrid(g);
                drawScore(g);
            }
        };
        gamePanel.setPreferredSize(new Dimension(WIDTH * BLOCK_SIZE, HEIGHT * BLOCK_SIZE));
        gamePanel.setBackground(Color.BLACK);

        JPanel mainPanel = new JPanel(new BorderLayout());
        mainPanel.add(gamePanel, BorderLayout.CENTER);
        mainPanel.add(buttonPanel, BorderLayout.WEST);  // Colocar el panel de botones al lado izquierdo

        // Establecer el color de fondo a negro
        mainPanel.setBackground(Color.BLACK);

        add(mainPanel);

        setVisible(true);
    }

    private void generateRandomPiece() {
        Random random = new Random();
        int pieceType = random.nextInt(7);
        currentPiece = Tetrominoes.getPiece(pieceType);
    }

    private void moveLeft() {
        if (canMove(currentPiece, currentPieceRow, currentPieceCol - 1)) {
            currentPieceCol--;
        }
        gamePanel.repaint();
    }

    private void moveRight() {
        if (canMove(currentPiece, currentPieceRow, currentPieceCol + 1)) {
            currentPieceCol++;
        }
        gamePanel.repaint();
    }

    private void moveDown() {
        if (canMove(currentPiece, currentPieceRow + 1, currentPieceCol)) {
            currentPieceRow++;
        } else {
            mergePiece();
            checkLines();
            generateRandomPiece();
            currentPieceRow = 0;
            currentPieceCol = WIDTH / 2 - 1;
            if (!canMove(currentPiece, currentPieceRow, currentPieceCol)) {
                gameOver();
            }
        }
        gamePanel.repaint();
    }

    private void rotatePiece() {
        int[][] newPiece = new int[currentPiece[0].length][currentPiece.length];
        for (int i = 0; i < currentPiece.length; i++) {
            for (int j = 0; j < currentPiece[i].length; j++) {
                newPiece[j][currentPiece.length - 1 - i] = currentPiece[i][j];
            }
        }
        if (canMove(newPiece, currentPieceRow, currentPieceCol)) {
            currentPiece = newPiece;
        }
        gamePanel.repaint();
    }

    private void mergePiece() {
        for (int i = 0; i < currentPiece.length; i++) {
            for (int j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] == 1) {
                    grid[currentPieceRow + i][currentPieceCol + j] = true;
                }
            }
        }
    }

    private void checkLines() {
        for (int i = HEIGHT - 1; i >= 0; i--) {
            boolean lineFull = true;
            for (int j = 0; j < WIDTH; j++) {
                if (!grid[i][j]) {
                    lineFull = false;
                    break;
                }
            }
            if (lineFull) {
                removeLine(i);
                score++;
            }
        }
    }

    private void removeLine(int line) {
        for (int i = line; i > 0; i--) {
            System.arraycopy(grid[i - 1], 0, grid[i], 0, WIDTH);
        }
        Arrays.fill(grid[0], false);
    }

    private boolean canMove(int[][] piece, int row, int col) {
        for (int i = 0; i < piece.length; i++) {
            for (int j = 0; j < piece[i].length; j++) {
                if (piece[i][j] == 1) {
                    int newRow = row + i;
                    int newCol = col + j;

                    // Verificar límites generales
                    if (newRow < 0 || newRow >= HEIGHT || newCol < 0 || newCol >= WIDTH || grid[newRow][newCol]) {
                        return false;
                    }

                    // Verificar límite izquierdo específico para bloquearse al llegar al borde izquierdo
                    if (newCol < 0) {
                        return false;
                    }

                    // Verificar límite derecho específico para bloquearse al llegar al borde derecho
                    if (newCol >= WIDTH) {
                        return false;
                    }

                    // Verificar límite superior específico para bloquearse al llegar al borde superior
                    if (newRow < 0) {
                        return false;
                    }

                    // Verificar límite inferior específico para bloquearse al llegar al borde inferior
                    if (newRow >= HEIGHT) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private void gameOver() {
        timer.stop();
        JOptionPane.showMessageDialog(this, "Game Over! Your score is: " + score, "Game Over", JOptionPane.INFORMATION_MESSAGE);
        System.exit(0);
    }

    private void drawPiece(Graphics g) {
        for (int i = 0; i < currentPiece.length; i++) {
            for (int j = 0; j < currentPiece[i].length; j++) {
                if (currentPiece[i][j] == 1) {
                    g.setColor(getPieceColor());
                    g.fillRect((currentPieceCol + j) * BLOCK_SIZE, (currentPieceRow + i) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    g.setColor(Color.BLACK);
                    g.drawRect((currentPieceCol + j) * BLOCK_SIZE, (currentPieceRow + i) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    private void drawGrid(Graphics g) {
        for (int i = 0; i < HEIGHT; i++) {
            for (int j = 0; j < WIDTH; j++) {
                if (grid[i][j]) {
                    g.setColor(Color.RED);
                    g.fillRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    g.setColor(Color.BLACK);
                    g.drawRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    private void drawScore(Graphics g) {
        g.setColor(Color.WHITE);
        g.drawString("Score: " + score, BLOCK_SIZE, BLOCK_SIZE - 10);
    }

    private Color getPieceColor() {
        Random random = new Random();
        return new Color(random.nextInt(256), random.nextInt(256), random.nextInt(256));
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        moveDown();
        gamePanel.repaint();
    }

    @Override
    public void keyPressed(KeyEvent e) {
        // No es necesario manejar las teclas aquí si ya se están manejando mediante los botones.
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new Tetris());
    }
}

class Tetrominoes {
    static int[][] getPiece(int type) {
        int[][] piece;
        switch (type) {
            case 0:
                piece = new int[][]{{1, 1, 1, 1}};
                break;
            case 1:
                piece = new int[][]{{1, 1, 1}, {1}};
                break;
            case 2:
                piece = new int[][]{{1, 1, 1}, {0, 0, 1}};
                break;
            case 3:
                piece = new int[][]{{1, 1, 1}, {0, 1}};
                break;
            case 4:
                piece = new int[][]{{1, 1, 1}, {1, 0}};
                break;
            case 5:
                piece = new int[][]{{1, 1}, {1, 1}};
                break;
            default:
                piece = new int[][]{{1, 1, 1, 1}};
        }
        return piece;
    }
}
