const initialState = {
    wishlists: {} // { userEmail: [products] }
};

const handleWishlist = (state = initialState, action) => {
    const { userEmail, product } = action.payload || {};
    console.log("email",userEmail);
    switch (action.type) {
        case "ADD_WISHLIST_ITEM":
            return {
                ...state,
                wishlists: {
                    ...state.wishlists,
                    [userEmail]: state.wishlists[userEmail] ? [...state.wishlists[userEmail], product] : [product]
                }
            };
        case "REMOVE_WISHLIST_ITEM":
            return {
                ...state,
                wishlists: {
                    ...state.wishlists,
                    [userEmail]: state.wishlists[userEmail].filter((x) => x.id !== product.id)
                }
            };
        case "CLEAR_WISHLIST":
            return {
                ...state,
                wishlists: {
                    ...state.wishlists,
                    [userEmail]: []
                }
            };
        default:
            return state;
    }
}

export default handleWishlist;
