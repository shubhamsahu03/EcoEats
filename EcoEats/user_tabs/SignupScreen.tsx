import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Image, Alert } from 'react-native';
import { Appearance } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//import { firebaseConfig } from 'firebaseConfig';
//import { initializeApp } from '@firebase/app';

const colorScheme = Appearance.getColorScheme();

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    const [name, setname] = useState('');

    const [open, setOpen] = useState(false);
    const [userType, setUserType] = useState('');
    const [items, setItems] = useState([
        {label: 'User', value: 'user'},
        {label: 'Vendor', value: 'vendor'},
    ]);

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

        firestore()
        .collection('Users')
        .doc(
            auth().currentUser?.uid
        )
        .set({
            name: name,
            email: email,
            userType: userType,
        })
        .then(() => {
            console.log('User added!');
        })
        .catch(error => {
            console.error('Error adding user: ', error);
        });
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/login.png')}
                style={{ width: 100, height: 100, marginBottom: 24 }}
            />
            <View style={styles.dropdown}>
                <DropDownPicker
                    open={open}
                    value={userType}
                    items={items}
                    setOpen={setOpen}
                    setValue={setUserType}
                    setItems={setItems}
                    placeholder="Select User Type"
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Name"
                secureTextEntry
                value={name}
                onChangeText={setname}
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
    dropdown:{
        width: '100%',
        marginBottom: 12,
    },
    button:{
        marginTop: 12,
        width: '50%',
    }
});

export default SignupScreen;