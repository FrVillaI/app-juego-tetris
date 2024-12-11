import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Modal, Image, } from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { auth } from '../config/Config';
import { getAuth, signOut, updateProfile as updateProfileAuth } from 'firebase/auth';
import { storage } from '../config/Config';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imagenes } from '../assets/imagenes'
import CustomInput from '../components/CustomTextInput';

export default function PerfilScreen({ navigation }: any) {
  const [nick, setNick] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImagen] = useState('');
  const [userProfilePicture, setUserProfilePicture] = useState('');

  //Cargar datos del usuario con el que inicio sesion
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const storedImageURL = await AsyncStorage.getItem(`profilePictureURL_${user.uid}`);
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);

        if (storedImageURL) setUserProfilePicture(storedImageURL);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setNick(userData.nick);
            setCorreo(userData.correo);
            setEdad(userData.edad);
            setNombre(userData.nombre);
            setUserProfilePicture(userData.profilePicture || storedImageURL || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, []);

  //Funcion para cargar escoger como subir la foto de perfil
  const elegirImagenPerfil = async () => {
    Alert.alert(
      'Actualizar Foto de Perfil',
      '¿Cómo quieres obtener la imagen?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Tomar foto',
          onPress: tomarFoto,
        },
        {
          text: 'Seleccionar de la galería',
          onPress: elegirImagen,
        },
      ],
      { cancelable: true }
    );
  };

  //Funcion para elegir la foto de perfil desde la galeria
  const elegirImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      setImagen(uri);
      await subirImagen('Avatar', uri);
    }
  };

  //Funcion para tomar la foto de perfil
  const tomarFoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      setImagen(uri);
      await subirImagen('Avatar', uri);
    }
  };

  //Funcion para cargar la foto de perfil
  async function subirImagen(nombre: string, source: string) {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No hay un usuario autenticado.');
      return null;
    }

    const storageReference = storageRef(
      storage,
      `usuarios/${user.uid}/${user.uid}_${nombre}`
    );

    try {
      const response = await fetch(source);
      const blob = await response.blob();

      // Subir la imagen al almacenamiento
      await uploadBytes(storageReference, blob, { contentType: 'image/jpg' });

      console.log('Imagen subida con éxito.');
      const photoURL = await getDownloadURL(storageReference);

      // Guardar la URL localmente
      await AsyncStorage.setItem(`profilePictureURL_${user.uid}`, photoURL);

      // Actualizar la URL de la imagen en la base de datos
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { profilePicture: photoURL });

      // Actualizar también en Firebase Authentication
      await updateProfileAuth(user, { photoURL });

      Alert.alert('Éxito', 'Imagen de perfil actualizada correctamente.');
      return photoURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      Alert.alert('Error', 'No se pudo subir la imagen.');
      return null;
    }
  }

  //Funcion para cerrar sesion
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

  //Funcion para utilizar únicamente los datos
  async function actualizarDatos() {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'No hay un usuario autenticado.');
      return;
    }

    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);

    try {
      // Actualiza los datos en la base de datos
      await update(userRef, {
        edad: edad,
        nombre: nombre,
        nick: nick,
        correo: correo,
      });

      // Actualiza los datos en Firebase Authentication
      await updateProfileAuth(user, {
        displayName: nombre,
      });

      Alert.alert('Éxito', 'Datos del perfil actualizados correctamente.');
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar los datos.');
    }
  }

  return (
    <ImageBackground source={imagenes.backgroundPerfil} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>PERFIL DE USUARIO</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity>
            {image || userProfilePicture ? (
              <Image source={{ uri: userProfilePicture || image }} style={styles.circularImage} />
            ) : (
              <View style={styles.circularPlaceholder}>
                <Fontisto name="person" size={40} color="black" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraIconContainer} onPress={elegirImagenPerfil}>
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
          <ImageBackground source={imagenes.backgroundPerfilModal} style={styles.backgroundImage}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>ACTUALIZAR  DATOS</Text>

              <CustomInput
                placeholder="Nuevo Nombre"
                onChangeText={setNombre}
                value={nombre}
              />

              <CustomInput
                placeholder="Nueva Edad"
                onChangeText={setEdad}
                value={edad}
              />

              <TouchableOpacity style={styles.button} onPress={actualizarDatos}>
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