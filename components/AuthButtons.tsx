import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';

interface AuthButtonsProps {
    loginText?: string;
    registerText?: string;
    onLoginPress: () => void;
    onRegisterPress: () => void;
    style?: any;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
    loginText = 'Iniciar sesión',
    registerText = 'Regístrarse',
    onLoginPress,
    onRegisterPress,
    style,
}) => {
    return (
        <View style={[styles.buttonContainer, style]}>
            <TouchableOpacity style={styles.buttonLogin} onPress={onLoginPress}>
                <Text style={styles.buttonText}>{loginText}</Text>
            </TouchableOpacity>
            <View style={styles.buttonSpacer} />
            <TouchableOpacity style={styles.buttonRegister} onPress={onRegisterPress}>
                <Text style={styles.buttonText}>{registerText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonSpacer: {
        width: 10,
    },
    buttonLogin: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonRegister: {
        backgroundColor: '#c70f0f',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AuthButtons;
