import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { auth } from '../config/Config';

export default function PerfilScreen() {
  const [nick, setNick] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setNick(userData.nick);
            setCorreo(userData.correo);
            setEdad(userData.edad);
            setNombre(userData.nombre);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  function updateProfile() {
    const db = getDatabase();
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      update(userRef, { edad, nombre }) // Agrega nombre al objeto que se actualiza
        .then(() => {
          Alert.alert('Éxito', 'Perfil actualizado correctamente');
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nick: {nick}</Text>
        <Text style={styles.label}>Correo: {correo}</Text>
      </View>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(texto) => setNombre(texto)}
        value={nombre}
      />
      <Text style={styles.label}>Edad:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(texto) => setEdad(texto)}
        value={edad}
      />
      <TouchableOpacity style={styles.button} onPress={() => updateProfile()}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e6f7ff',
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
    borderColor: '#3498db',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    borderColor: '#3498db',
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: '#3498db',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});