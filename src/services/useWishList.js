import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://9xjub0al8c.execute-api.us-east-1.amazonaws.com/Test'; // Replace with your actual API base URL

export const useWishlist = (userEmail) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const encodedEmail = encodeURIComponent(userEmail);
                const response = await fetch(`${API_BASE_URL}/wishlist/items?userEmail=${encodedEmail}`);
                const data = await response.json();
                setWishlist(data);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [userEmail]);

    const addToWishlist = async (productId, productName ,productImage) => {
        try {
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail, productId, productName ,productImage}),
            });

            if (response.ok) {
                alert("Added successfully");
                const updatedItem = { productId, productName, productImage };
                setWishlist(prev => [...prev, updatedItem]);
            } else {
                alert("error");
                console.error('Error adding to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    

    const isInWishlist = (productId) => {
        console.log("wishlist",wishlist);
        return wishlist.some(item => item.productId === productId);
    };

    return { wishlist, addToWishlist,  isInWishlist, loading };
};
