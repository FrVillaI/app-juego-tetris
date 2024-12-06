import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  mostrarContrasenia: boolean;
  iconoMostrarContrasenia: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChangeText,
  mostrarContrasenia,
  iconoMostrarContrasenia,
}) => {
  return (
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.inputPassword}
        placeholder="Ingresa tu Contraseña"
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={!mostrarContrasenia}
      />
      <TouchableOpacity onPress={iconoMostrarContrasenia} style={styles.showPasswordIcon}>
        <Text style={styles.eyeIcon}>{mostrarContrasenia ? '👁️' : '👁️‍🗨️'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    width: '80%',
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    opacity: 0.8,
    fontSize: 16,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  showPasswordIcon: {
    height: 40,
    backgroundColor: 'white',
    opacity: 0.8,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
  },
});

export default PasswordInput;
