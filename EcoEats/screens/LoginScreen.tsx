import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Image } from 'react-native';
import { Appearance } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const colorScheme = Appearance.getColorScheme();

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const navigation = useNavigation();
    const handleLogin = () => {
        // Perform login logic here
        console.log('Logging in...');
        navigation.navigate('Info');
        
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
                value={email}
                onChangeText={setEmail}
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
        width: '50%'
    }
});

export default LoginScreen;