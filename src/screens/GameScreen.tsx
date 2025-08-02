import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Animated,
  PanResponder 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Shape {
  id: string;
  type: 'square' | 'triangle' | 'circle';
  x: number;
  y: Animated.Value;
  color: string;
  size: number;
  speed: number;
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
const shapeTypes: Array<'square' | 'triangle' | 'circle'> = ['square', 'triangle', 'circle'];

export default function GameScreen() {
  const [score, setScore] = useState(0);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [gameRunning, setGameRunning] = useState(false);

  const createShape = (): Shape => {
    const size = Math.random() * 40 + 30; // Random size between 30-70
    return {
      id: Math.random().toString(),
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      x: Math.random() * (screenWidth - size),
      y: new Animated.Value(-size),
      color: colors[Math.floor(Math.random() * colors.length)],
      size,
      speed: Math.random() * 2 + 1, // Random speed between 1-3
    };
  };

  const animateShape = (shape: Shape) => {
    Animated.timing(shape.y, {
      toValue: screenHeight + shape.size,
      duration: (screenHeight + shape.size * 2) / shape.speed * 16, // Adjust for smooth animation
      useNativeDriver: false,
    }).start(() => {
      // Remove shape when it reaches bottom
      setShapes(prevShapes => prevShapes.filter(s => s.id !== shape.id));
    });
  };

  const startGame = () => {
    setGameRunning(true);
    setScore(0);
    setShapes([]);
  };

  const stopGame = () => {
    setGameRunning(false);
    setShapes([]);
  };

  const handleShapeTap = (shapeId: string) => {
    setShapes(prevShapes => prevShapes.filter(s => s.id !== shapeId));
    setScore(prevScore => prevScore + 10);
  };

  useEffect(() => {
    if (gameRunning) {
      const interval = setInterval(() => {
        const newShape = createShape();
        setShapes(prevShapes => [...prevShapes, newShape]);
        animateShape(newShape);
      }, 1000); // Create new shape every second

      return () => clearInterval(interval);
    }
  }, [gameRunning]);

  const renderShape = (shape: Shape) => {
    const shapeStyle = {
      position: 'absolute' as const,
      left: shape.x,
      width: shape.size,
      height: shape.size,
      backgroundColor: shape.color,
    };

    const animatedStyle = {
      transform: [{ translateY: shape.y }],
    };

    if (shape.type === 'square') {
      return (
        <Animated.View key={shape.id} style={[shapeStyle, animatedStyle]}>
          <TouchableOpacity
            style={[styles.square, { backgroundColor: shape.color, width: shape.size, height: shape.size }]}
            onPress={() => handleShapeTap(shape.id)}
          />
        </Animated.View>
      );
    } else if (shape.type === 'triangle') {
      return (
        <Animated.View key={shape.id} style={[shapeStyle, animatedStyle]}>
          <TouchableOpacity
            style={[
              styles.triangle,
              {
                width: 0,
                height: 0,
                borderLeftWidth: shape.size / 2,
                borderRightWidth: shape.size / 2,
                borderBottomWidth: shape.size,
                borderBottomColor: shape.color,
              }
            ]}
            onPress={() => handleShapeTap(shape.id)}
          />
        </Animated.View>
      );
    } else {
      return (
        <Animated.View key={shape.id} style={[shapeStyle, animatedStyle]}>
          <TouchableOpacity
            style={[
              styles.circle,
              {
                backgroundColor: shape.color,
                width: shape.size,
                height: shape.size,
                borderRadius: shape.size / 2,
              }
            ]}
            onPress={() => handleShapeTap(shape.id)}
          />
        </Animated.View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {shapes.map(renderShape)}
      </View>

      {/* Game Controls */}
      <View style={styles.controlsContainer}>
        {!gameRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={stopGame}>
            <Text style={styles.buttonText}>Stop Game</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scoreContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#16213e',
  },
  scoreText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  controlsContainer: {
    padding: 20,
    backgroundColor: '#16213e',
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  square: {
    borderRadius: 5,
  },
  triangle: {
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  circle: {
    // borderRadius is set dynamically
  },
});
