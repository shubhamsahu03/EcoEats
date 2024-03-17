import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SearchScreen:React.FC<{ navigation: any }> = ({ navigation }) => {
    const [data, setData] = useState<{ id: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const response = await firestore().collection('Items').get();
        //console.log(response.docs.toString());
        const val=response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        for (var i=0; i<val.length; i++){
            console.log(val[i]);
        }
        //const fetchedData = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        //setData([...data, ...fetchedData]);
        setIsLoading(false);
    };

    const renderItem = (item) => (
        <View style={{ padding: 16 }}>
            <Text>{item.title}</Text>
            {/* Render other data from the item */}
        </View>
    );

    const renderFooter = () => {
        if (!isLoading) return null;

        return (
            <View style={{ paddingVertical: 20 }}>
                {/* Render a loading indicator */}
            </View>
        );
    };

    const handleLoadMore = () => {
        if (!isLoading) {
            fetchData();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
};

export default SearchScreen;