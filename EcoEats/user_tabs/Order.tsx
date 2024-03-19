import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Image, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type Items = {
    name: string;
    description: string;
    image: string;
};

type Order = {
    vendorID: string;
    items: Items[];
    location: FirebaseFirestoreTypes.GeoPoint;
};

const OrderPage: React.FC<{ navigation: any }> = ({ navigation }) => {
    const userId = auth().currentUser?.uid;
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string>('');
    const [vendorName, setVendorName] = useState<string>('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userRef = firestore().collection('Users').doc(userId);
                const userSnapshot = await userRef.get();

                if (userSnapshot.exists) {
                    const userData = userSnapshot.data();
                    const userOrders = userData?.orders || [];
                    setOrders(userOrders);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to fetch orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const handleShowMap = (address: FirebaseFirestoreTypes.GeoPoint) => {
        const location = `${address.latitude},${address.longitude}`;
        const url = `https://www.google.com/maps/search/?api=1&query=${location}`;
        Linking.openURL(url);
    };

    const renderOrderItem = ({ item }: { item: Order }) => {
        const updateVendorName = (vendorID:string) => {
                    firestore().collection('Users').doc(vendorID).get().then((doc) => {
                        if (doc.exists) {
                            const data = doc.data();
                            setVendorName(data?.name);
                        }
                    });
        }
        updateVendorName(item.vendorID);
        return(
        <View style={styles.orderContainer}>
            <Text style={styles.orderTitle}>Vendor ID: {vendorName}</Text>
            <FlatList
                data={item.items}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemName}>Name: {item.name}</Text>
                        <Text style={styles.itemDescription}>Description: {item.description}</Text>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                    </View>
                )}
                keyExtractor={(item) => item.name}
            />
            <View style={styles.mapButton}>
            <Button title="Show Map" onPress={() => handleShowMap(item.location)} />
            </View>
        </View>
    );
};

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.vendorID}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    orderContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
    },
    orderTitle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    itemContainer: {
        marginBottom: 12,
    },
    itemName: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDescription: {
        color: '#333',
        fontSize: 14,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginTop: 8,
    },
    mapButton: {
        marginTop: 10,
        alignSelf: 'flex-start',
    },
});

export default OrderPage;