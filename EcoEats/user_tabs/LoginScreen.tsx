import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Appearance } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const colorScheme = Appearance.getColorScheme();
const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //performs logic after login button is pressed
    const handleLogin = (email:string,password:string) => {
        console.log('Logging in...');
        console.log("Email: " + email+ " Password: " + password);
        navigation.navigate('Info');
        
    };

    const handleSignup = () => {
        console.log('moving to signup screen');
        navigation.navigate('Signup');
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/login.png')}
                style={{ width: 100, height: 100, marginBottom: 24 }}
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
                <Button title="Login" onPress={()=>handleLogin(email,password)} />
            </View>
            <View style={styles.button}>
                <Button title="Go to Signup" onPress={handleSignup} />
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