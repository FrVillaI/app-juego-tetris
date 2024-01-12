import { Alert, Button, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native'
import { auth } from '../config/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth, signOut } from 'firebase/auth';
import { onValue, ref, remove, set, update } from "firebase/database";
import { db } from '../config/Config';

//Registro
export const registroUser = (correo: any, contrasenia: any, { navigation }: any) => {
    createUserWithEmailAndPassword(auth, correo, contrasenia)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            //console.log("REGISTRO CORRECTO")
            Alert.alert('REGISTRO CORRECTO, INICIE SECION');
            navigation.navigate('Inciar_Secion')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            switch (errorCode) {
                case 'auth/invalid-email':
                    Alert.alert('ERROR, EMAIL NO VALIDO');
                    break;
                case 'auth/missing-password':
                    Alert.alert('ERROR, Ingrese la contraseña');
                    break;
                case 'auth/weak-password':
                    Alert.alert('ERROR, CONTRASEÑA MUY DEVIL MINIMO 6 CARACTERES')
                    break;
                case 'auth/email-already-in-use':
                    Alert.alert('ERROR, EMAIL YA UTILIZADO');
                    break;
                default:
                    Alert.alert('ERROR, REVISE LOS DATOS');
                    break;
            }
        });
}

///Login
export const loginUser = (correo: any, contrasenia: any, { navigation }: any) => {
    signInWithEmailAndPassword(auth, correo, contrasenia)
        .then((userCredential) => {
            const user = userCredential.user;
            navigation.navigate('Tabs');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            switch (errorCode) {
                case 'auth/invalid-credential':
                    Alert.alert('ERROR, CREDENCIALES INCORRECTAS');
                    break;
                case 'auth/missing-password':
                    Alert.alert('ERROR, Ingrese la contraseña');
                    break;
                default:
                    Alert.alert('ERROR, REVISE SUS CREDENCIALES');
                    break;
            }
        });
}

//LogOut
export const cerrarSesion = ({ navigation }: any) => {
    const auth = getAuth();
    signOut(auth).then(() => {
        // Cierre de sesión exitoso.
        navigation.navigate('Login');
    }).catch((error) => {
        // Se produjo un error.
    });
}

//Create- set - guardar
export const guardarInfUser = (nick: string, email: string, edad: string,nombre:string) => {
    set(ref(db, 'usuarios/' + nick), {
        correo_elec: email,
        edad: edad,
        nombre:nombre
    });
};

//Update -uptadet -actualizar
export const updateInUsario = (nick: string, nombre:string,edad: string) => {
    update(ref(db, 'usuarios/' + nick), {
        edad: edad,
        nombre:nombre
    });
}