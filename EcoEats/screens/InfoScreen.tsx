
import React, { useEffect, useState } from 'react';

interface UserInfo {
    name: string;
    age: number;
    email: string;
    // Add more properties as needed
}

interface InfoScreenProps {
    username: string;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ username }) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        // Fetch user info based on the username
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`/api/users/${username}`);
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [username]);

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>User Info for {username}</h2>
            <p>Name: {userInfo.name}</p>
            <p>Age: {userInfo.age}</p>
            <p>Email: {userInfo.email}</p>
            {/* Add more info as needed */}
        </div>
    );
};

export default InfoScreen;