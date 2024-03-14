import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ImageBackground } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../config/Config";
import * as Font from 'expo-font';

interface Score {
  nick: string;
  score: number;
}

const backgroundImage = require('../assets/fondo_tetris.jpg');

const ListaPuntuacionScreen: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    loadFont(); // Cargar la fuente cuando se monte el componente
    fetchScores(); // Cargar los puntajes
  }, []);

  const loadFont = async () => {
    await Font.loadAsync({
      'TetrisFont': require('../assets/fonts/Tetris.ttf'),
    });
    setFontLoaded(true);
  };

  const fetchScores = () => {
    const scoresRef = ref(db, "users");

    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const scoresData: Score[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        scoresData.push({
          nick: data.nick,
          score: data.score,
        });
      });
      scoresData.sort((a, b) => b.score - a.score);
      setScores(scoresData);
    });

    return () => {
      unsubscribe();
    };
  };

  const getRandomColor = () => {
    const colors = ["#1DFAE7", "#00FF76", "#FFE000", "#FF0000", "#FF00CA"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const renderItem = ({ item, index }: { item: Score; index: number }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.rank, { color: getRandomColor() }]}>{index + 1}</Text>
      <Text style={[styles.userName, { color: getRandomColor() }]}>{item.nick}</Text>
      <Text style={[styles.score, { color: getRandomColor() }]}>{item.score}</Text>
    </View>
  );

  if (!fontLoaded) {
    return null; // Muestra un placeholder mientras se carga la fuente
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>

        <Text style={[styles.title, { color: getRandomColor() }]}>SCORE RANKING</Text>
        <FlatList
          data={scores}
          renderItem={renderItem}
          keyExtractor={(item) => item.nick}
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Text style={[styles.rank, { color: getRandomColor() }]}>RANK</Text>
              <Text style={[styles.userName, { color: getRandomColor() }]}>NAME</Text>
              <Text style={[styles.score, { color: getRandomColor() }]}>SCORE</Text>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000000",
    paddingTop: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 30,
    fontFamily: 'TetrisFont',
    marginTop: 50,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
  rank: {
    fontSize: 18,
    fontFamily: 'TetrisFont',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'TetrisFont',
  },
  score: {
    fontSize: 18,
    fontFamily: 'TetrisFont',
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F39C12",
    fontFamily: 'TetrisFont',
  },
});

export default ListaPuntuacionScreen;
