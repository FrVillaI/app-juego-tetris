import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../config/Config";
import * as Font from 'expo-font';

// Interfaz para los datos de puntuación
interface Score {
  nick: string;
  score: number;
}

const ListaPuntuacionScreen: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]); // Estado para los puntajes
  const [fontLoaded, setFontLoaded] = useState(false); // Estado para verificar si la fuente se ha cargado

  // Cargar la fuente y los puntajes cuando se monta el componente
  useEffect(() => {
    loadFont(); 
    fetchScores();
  }, []);

  // Cargar la fuente personalizada
  const loadFont = async () => {
    await Font.loadAsync({
      'TetrisFont': require('../assets/fonts/Tetris.ttf'),
    });
    setFontLoaded(true);
  };

  // Obtener los puntajes desde Firebase
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
      scoresData.sort((a, b) => b.score - a.score); // Ordenar los puntajes de mayor a menor
      setScores(scoresData);
    });

    return () => {
      unsubscribe(); // Limpiar la suscripción cuando el componente se desmonte
    };
  };

  // Función para obtener un color aleatorio
  const getRandomColor = () => {
    const colors = ["#1DFAE7", "#00FF76", "#FFE000", "#FF0000", "#FF00CA"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // Renderizar cada elemento de la lista
  const renderItem = ({ item, index }: { item: Score; index: number }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.rank, { color: getRandomColor() }]}>{index + 1}</Text>
      <Text style={[styles.userName, { color: getRandomColor() }]}>{item.nick}</Text>
      <Text style={[styles.score, { color: getRandomColor() }]}>{item.score}</Text>
    </View>
  );

  // Mostrar un placeholder mientras se carga la fuente
  if (!fontLoaded) {
    return null;
  }

  return (
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
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000000",
    paddingTop: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 30,
    fontFamily: 'TetrisFont',
    marginTop: 10,
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
});

export default ListaPuntuacionScreen;
