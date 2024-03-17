import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface UserInfo {
    name: string;
    email: string;
    userType: string;
    orders: [];
}

interface VendorInfo {
    name: string,
    email: string,
    userType: string,
    items: [],
    ordersReceived: [],
}

const InfoScreen: React.FC = () => {
    const [userType, setUserType] = useState('');
    const [userInfo, setUserInfo] = useState<UserInfo|null>(null);
    const [vendorInfo, setVendorInfo] = useState<VendorInfo|null>(null);

    useEffect(() => {
        // Fetch user information once when the component mounts
        const fetchUserInfo = async () => {
            const user = auth().currentUser;
            if (user) {
                const doc = await firestore().collection('Users').doc(user.uid).get();
                const userData = doc.data();
                console.log(user.uid);
                if (userData) {
                    if (userData.userType === 'user') {
                        setUserType('user');
                        setUserInfo(userData as UserInfo);
                    } else if (userData.userType === 'vendor') {
                        setUserType('vendor');
                        setVendorInfo(userData as VendorInfo);
                    }
                }
            } else {
                setUserType('none');
            }
        };

        fetchUserInfo(); // Call the fetchUserInfo function when the component mounts

        // Listen for authentication state changes
        const vendor_login=async()=>{
           const users=await firestore().collection
        }
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (!user) {
                setUserType('none');
            }
        });

        return () => {
            unsubscribe(); // Unsubscribe from the auth state listener when the component unmounts
        };
    }, []);
    
    if (userType === 'user') {
        return(
                <View style={styles.container}>
                    <Text style={styles.header}>User Information</Text>
                    <Text style ={styles.boxeditem}>Name: {userInfo?.name}</Text>
                    <Text style ={styles.boxeditem}>Email: {userInfo?.email}</Text>
                    <Text style ={styles.boxeditem}>User Type: {userInfo?.userType}</Text>
                    <View style={styles.orders}>
                        <Text style={styles.header}>Orders</Text>
                        <FlatList
                            data={userInfo?.orders}
                            renderItem={({ item }) => (
                                <Text>{item}</Text>
                            )}
                        />
                    </View>
                </View>
            );
        } 
        else if (userType === 'vendor') {
            return(
                <View style={styles.container}>
                    <Text style={styles.header}>Vendor Information</Text>
                    <Text style ={styles.boxeditem}>Name: {vendorInfo?.name}</Text>
                    <Text style ={styles.boxeditem}>Email: {vendorInfo?.email}</Text>
                    <Text style ={styles.boxeditem}>User Type: {vendorInfo?.userType}</Text>
                    <View style={styles.orders}>
                        <Text style={styles.header}>Orders Received</Text>
                        {vendorInfo?.ordersReceived.length === 0 ? (
                            <Text style={styles.redText}>No orders received</Text>
                        ) : (
                            <FlatList
                                data={vendorInfo?.ordersReceived}
                                renderItem={({ item }) => (
                                    <Text>{item}</Text>
                                )}
                            />
                        )}
                    </View>
                    <View style={styles.items}>
                    <Text style={styles.header}>Items</Text>
                        {vendorInfo?.items.length === 0 ? (
                            <Text style={styles.redText}>No items</Text>
                        )
                        :(<FlatList
                            data={vendorInfo?.items}
                            renderItem={({ item }) => (
                                <Text>{item}</Text>
                            )}
                        />
                        )}
                    </View>
                </View>
            );
        } 
        else {
            return(
                <View style={styles.container}>
                    <Text style={styles.redText}>No user signed in</Text>
                </View>
            );
        }
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#f5f5f5',
            flex: 1,
            padding: 16,
        },
        header: {
            color: '#333',
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 12,
        },
        boxeditem: {
            fontSize: 18,
            fontFamily: 'Arial',
            backgroundColor: '#fff',
            color: '#333',
            padding: 15,
            marginBottom: 15,
            borderRadius: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 3,
        },
        redText:{
            color: 'red',
            fontSize: 18,
            fontWeight: 'bold',
        },
        orders: {
            flex: 1,
            marginTop: 16,
        },
        items: {
            flex: 1,
            marginTop: 16,
        },
        listItem: {
            backgroundColor: '#fff',
            padding: 16,
            marginBottom: 16,
            borderRadius: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 3,
        },
    });

export default InfoScreen;
