import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Modal, Button } from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { auth } from '../config/Config';
import { getAuth, signOut } from 'firebase/auth';

const backgroundImage = require('../assets/fongoPe.jpg');
const backgroundModalImage = require('../assets/fondoP.jpg');


export default function PerfilScreen({ navigation }: any) {
  const [nick, setNick] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
      update(userRef, { edad, nombre, nick, correo })
        .then(() => {
          Alert.alert('Éxito', 'Perfil actualizado correctamente');
          setModalVisible(false);
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    }
  }

  function cerrarSesion() {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Cierre de sesión exitoso.
      navigation.navigate('Welcome');
    }).catch((error) => {
      // Se produjo un error.
    });
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Perfil de Usuario</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nombre: {nombre}</Text>
          <Text style={styles.label}>Nick: {nick}</Text>
          <Text style={styles.label}>Correo: {correo}</Text>
          <Text style={styles.label}>Edad: {edad}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <View style={styles.infoContainer}/>
        <TouchableOpacity style={styles.buttonDel} onPress={() => cerrarSesion()}>
          <Text style={styles.buttonTextDel}>Cerrar Sesion</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <ImageBackground
            source={backgroundModalImage}
            style={styles.backgroundImage}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Actualizar Datos</Text>
              <TextInput
                style={styles.input}
                placeholder="Nuevo Nombre"
                value={nombre}
                onChangeText={(texto) => setNombre(texto)}
              />
              <TextInput
                style={styles.input}
                placeholder="Nueva Edad"
                value={edad}
                onChangeText={(texto) => setEdad(texto)}
              />
              <TouchableOpacity style={styles.button} onPress={() => updateProfile()}>
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
              <View style={styles.infoContainer} />
              <TouchableOpacity style={styles.buttonDel} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonTextDel}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semi-transparente
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: '#ffffff',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    opacity: 0.8,
    fontSize: 16,
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
  buttonTextDel: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonDel: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});