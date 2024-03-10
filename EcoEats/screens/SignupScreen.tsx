import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Image } from 'react-native';
import { Appearance } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import { firebaseConfig } from 'firebaseConfig';
//import { initializeApp } from '@firebase/app';

const colorScheme = Appearance.getColorScheme();

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    
    //const navigation = useNavigation();
    const handleLogin = () => {
        // Perform login logic here
        console.log('moving to login screen');
        navigation.navigate('Login');
        
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/login.png')}
                style={{ width: 200, height: 200, marginBottom: 24 }}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
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
                <Button title="Signup" onPress={handleLogin} />
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