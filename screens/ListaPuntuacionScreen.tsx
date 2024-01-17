import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../config/Config'
import { getDatabase, ref, onValue } from "firebase/database";

export default function ListaPuntuacionScreen() {
  const [Usuario, setUsuario] = useState()

  useEffect(() => {

    function Leer() {
      const starCountRef = ref(db, 'puntuaciones/');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        const dataTemp: any = Object.keys(data).map((key) => ({
          key, ...data[key]
        }))
        console.log(dataTemp)
        setUsuario(dataTemp)
      });
    }
    Leer()
  }, [])

  return (
    <View>
      <FlatList
        data={Usuario}
        renderItem={({ item }) => (
          <View>
            <Text>Player1: {item.nick}</Text>
            <Text>Score: {item.puntuacion}</Text>
          </View>
        )}
      />

    </View>
  )
}

const styles = StyleSheet.create({})
