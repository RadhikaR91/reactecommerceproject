// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

export const clearCart = () => {
    return {
        type: "CLEAR_CART"
    }
}

export const addWishlistItem = (userEmail ,product) => {
    return {
        type: "ADD_WISHLIST_ITEM",
        payload: {userEmail ,product}
    }
}

export const removeWishlistItem = (userEmail ,product) => {
    return {
        type: "REMOVE_WISHLIST_ITEM",
        payload: {userEmail ,product}
    }
}

export const clearWishlist = () => {
    return {
        type: "CLEAR_WISHLIST"
    }
}
