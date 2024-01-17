import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../config/Config";

interface Score {
  userName: string;
  score: number;
}

const ListaPuntuacionScreen: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const scoresRef = ref(db, "scores");

    const unsubscribe = onValue(scoresRef, (snapshot) => {
      const scoresData: Score[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        scoresData.push({
          userName: data.userName,
          score: data.score,
        });
      });
      scoresData.sort((a, b) => b.score - a.score);
      setScores(scoresData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }: { item: Score }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.userName}>📌 {item.userName}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
<Text></Text>
<Text></Text>
<Text></Text>
<Text></Text>
<Text></Text>
<Text></Text>
<Text></Text>
<Text></Text>
      <Text style={styles.title}>Puntuaciones</Text>
      <FlatList
        data={scores}
        renderItem={renderItem}
        keyExtractor={(item) => item.userName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", 
  },
  itemContainer: {
    padding: 12,
    backgroundColor: "#ebe3bd", 
    borderRadius: 6,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userName: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default ListaPuntuacionScreen;
