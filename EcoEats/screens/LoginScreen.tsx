import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Image } from 'react-native';
import { Appearance } from 'react-native';

const colorScheme = Appearance.getColorScheme();

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Perform login logic here
        console.log('Logging in...');
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
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
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
});

export default LoginScreen;