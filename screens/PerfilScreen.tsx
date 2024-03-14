import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Modal, Image, } from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { auth } from '../config/Config';
import { getAuth, signOut, updateProfile as updateProfileAuth } from 'firebase/auth';
import { storage } from '../config/Config';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LogBox } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreAllLogs(true);
import * as Font from 'expo-font';

Font.loadAsync({
  'OLD SPORT ATHLETIC Font': require('../assets/fonts/OldSport02AthleticNcv-E0gj.ttf'),
});
const backgroundImage = require('../assets/fongoPe.jpg');
const backgroundModalImage = require('../assets/fondoP.jpg');

export default function PerfilScreen({ navigation }: any) {
  const [nick, setNick] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImagen] = useState('');
  const [cameraImage, setCameraImage] = useState('');

  const [userProfilePicture, setUserProfilePicture] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const storedImageURL = await AsyncStorage.getItem(`profilePictureURL_${user.uid}`);

        if (storedImageURL) {
          setUserProfilePicture(storedImageURL);
        }

        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);

        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setNick(userData.nick);
              setCorreo(userData.correo);
              setEdad(userData.edad);
              setNombre(userData.nombre);

              // Set the profile picture URL for the current user
              setUserProfilePicture(userData.profilePicture || storedImageURL || '');
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }
    };

    fetchData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const pickImageOrTakePhoto = async () => {
    Alert.alert(
      'Seleccionar fuente',
      '¿Cómo quieres obtener la imagen?',
      [
        {
          text: 'Seleccionar de la galería',
          onPress: () => pickImage(),
        },
        {
          text: 'Cargar Imagen',
          onPress: () => subirImagen('Avatar1'), // Lógica para cargar imagen
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  async function subirImagen(nombre: string) {
    const storageReference = storageRef(storage, `usuarios/${auth.currentUser?.uid}/${auth.currentUser?.uid}_${nombre}`);
    const source = cameraImage || image;

    try {
      const response = await fetch(source);
      const blob = await response.blob();

      await uploadBytes(storageReference, blob, {
        contentType: 'image/jpg',
      });

      console.log('La imagen se subió con éxito');
      const photoURL = await getDownloadURL(storageReference);

      // Almacenar la URL localmente with user UID appended
      await AsyncStorage.setItem(`profilePictureURL_${auth.currentUser?.uid}`, photoURL);

      // Actualizar la URL de la imagen en la base de datos
      const db = getDatabase();
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        update(userRef, { profilePicture: photoURL });
      }

      Alert.alert('Éxito', 'Imagen cargada correctamente');

      return photoURL;
    } catch (error) {
      console.error(error);

      return null;
    }
  }


  function cerrarSesion() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        console.error('Error cerrando sesión:', error);
      });
  }

  function updateProfile() {
    const db = getDatabase();
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(db, `users/${user.uid}`);

      subirImagen('Avatar1').then((photoURL) => {
        update(userRef, {
          edad: edad,
          nombre: nombre,
          nick: nick,
          correo: correo,
          profilePicture: photoURL // Actualizar la URL de la imagen de perfil
        })
          .then(() => {
            setModalVisible(false);
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
          })
          .catch((error) => {
            console.error('Error updating profile:', error);
          });

        updateProfileAuth(user, {
          displayName: nombre,
          photoURL: photoURL,
        })
          .then(() => {
            console.log('User profile updated successfully');
          })
          .catch((error) => {
            console.error('Error updating user profile:', error);
          });
      });
    }
  }


  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>PERFIL DE USUARIO</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImageOrTakePhoto}>
            {cameraImage || image || userProfilePicture ? (
              <Image source={{ uri: cameraImage || image || userProfilePicture }} style={styles.circularImage} />
            ) : (
              <View style={styles.circularPlaceholder}>
                <Fontisto name="person" size={40} color="black" />
              </View>
            )}

          </TouchableOpacity>

          {/* Agregar el ícono de la cámara a la derecha de la imagen */}
          <TouchableOpacity style={styles.cameraIconContainer} onPress={takePhoto}>
            <FontAwesome name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>


        <View style={styles.infoContainer}>
          <Text style={styles.label}>NOMBRE :  {nombre}</Text>
          <Text style={styles.label}>NICK :   {nick}</Text>
          <Text style={styles.label}>CORREO : {correo}</Text>
          <Text style={styles.label}>EDAD :  {edad}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>EDITAR</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer} />

        <TouchableOpacity style={styles.buttonDel} onPress={cerrarSesion}>
          <Text style={styles.buttonTextDel}>CERRAR SECICIÓN</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <ImageBackground source={backgroundModalImage} style={styles.backgroundImage}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>ACTUALIZAR  DATOS</Text>
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
              <TouchableOpacity style={styles.button} onPress={updateProfile}>
                <Text style={styles.buttonText}>ACTUALIZAR</Text>
              </TouchableOpacity>

              <View style={styles.infoContainer} />

              <TouchableOpacity style={styles.buttonDel} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonTextDel}>CANCELAR</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
    margin: 8,
  },
  circularPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#c7c6c2',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
   
    fontFamily: 'OLD SPORT ATHLETIC Font',
    color: 'white',
  },
  infoContainer: {
    marginBottom: 22,
   
 
  },
  label: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: 'white',
    fontFamily: 'OLD SPORT ATHLETIC Font',
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
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#92fa7a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  buttonText: {
  
    fontSize: 22,
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'OLD SPORT ATHLETIC Font',
  },
  buttonDel: {
    backgroundColor: '#ff334b',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  buttonTextDel: {
    color: '#000000',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'OLD SPORT ATHLETIC Font',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circularImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 75,
    marginVertical: 20,
  },
  selectImageText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    
    marginTop: 20,
  },
  img: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
    borderRadius: 20,
    marginVertical: 20,
  },
});