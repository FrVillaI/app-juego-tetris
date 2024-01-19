import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';



const backgroundImage = require('../assets/fondo_tetris.jpg');
const logoImage = require('../assets/logo.png');


export default function ComJueScree({ navigation }: any) {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Image source={logoImage} style={styles.logoImage} />

            <TouchableOpacity style={styles.buttonR} >
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    title: {
        marginTop: 100,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#ffffff',
    },
    buttonR: {
        backgroundColor: '#0fc73a',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    }, logoImage: {
        width: 300,
        height: 80,
        marginBottom: 40,
    },
})
