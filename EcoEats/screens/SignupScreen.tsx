import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Image, Alert } from 'react-native';
import { Appearance } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
//import { firebaseConfig } from 'firebaseConfig';
//import { initializeApp } from '@firebase/app';

const colorScheme = Appearance.getColorScheme();

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    

    const handleLogin = () => {
        console.log('moving to login screen');
        navigation.navigate('Login');
        
    };

    const handleSignup = ( password: string, email: string) => {
        console.log('Signing up...');
        auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            console.log('User account created & signed in!');
            navigation.navigate('Info');
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            if(error.code === 'auth/weak-password'){
                Alert.alert('Weak Password', 'Please choose a stronger password.');
            }
            console.error(error);
        });
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/login.png')}
                style={{ width: 200, height: 200, marginBottom: 24 }}
            />
             <TextInput
                style={styles.input}
                placeholder="Email"
                secureTextEntry
                value={email}
                onChangeText={setemail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <View style={styles.button}>
                <Button title="Login" onPress={handleLogin} />
            </View>
            <View style={styles.button}>
                <Button title="Signup" onPress={() => handleSignup(password, email)} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        backgroundColor: 'black',
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    button:{
        marginTop: 12,
        width: '50%',
    }
});

export default SignupScreen;