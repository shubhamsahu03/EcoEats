import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Image, Alert } from 'react-native';
import { Appearance } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const colorScheme = Appearance.getColorScheme();
const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //performs logic after login button is pressed
    const handleLogin = (email:string,password:string) => {
        auth()
        .signInWithEmailAndPassword(email, password)
        .then(()=>{
            const usertType=firestore()
            .collection('Users')
            .doc(auth().currentUser?.uid).get().then((doc)=>{
                if(doc.exists){
                    console.log('Document data:', doc.data());
                    const userType=doc.data()?.userType;
                    console.log('User Type:', userType);
                    if(userType==='user'){
                        navigation.navigate('Search');
                    }
                    else if(userType==='vendor'){
                        navigation.navigate('Info');
                    }
                }
                else{
                    console.log('No such document!');
                }
            })
            .catch((error)=>{
                console.log('Error getting document:', error);
            });
        })
        .catch(error => {
            if (error.code === 'auth/invalid-email') {
                Alert.alert('That email address is invalid!');
            }
            if (error.code === 'auth/user-not-found') {
                Alert.alert('No user found for this email. Please Signup.');
            }
            if (error.code === 'auth/wrong-password') {
                Alert.alert('Wrong password.');
            }
            console.error(error);
        });
        console.log("Email: " + email+ " Password: " + password);
        
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
