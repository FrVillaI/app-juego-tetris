import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../config/Config";


// Interfaz para los datos de puntuación
interface Score {
  nick: string;
  score: number;
}

const ListaPuntuacionScreen: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  // Cargar la fuente y los puntajes cuando se monta el componente
  useEffect(() => {
    fetchScores();
  }, []);

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
      scoresData.sort((a, b) => b.score - a.score);
      setScores(scoresData);
    });

    return () => {
      unsubscribe();
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


  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: getRandomColor() }]}>SCORE RANKING</Text>
      <FlatList
        data={scores}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.nick + index.toString()} 
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
