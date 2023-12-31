import { FETCH_FAV_RESTAURANTS } from "../actions/favoriteRestaurantActions";


const initialState = {
    favRestaurants: [],
};

const favRestaurantsReducer = (state = initialState, action) =>{

    switch (action.type) {
        case FETCH_FAV_RESTAURANTS:
          return { ...state, favRestaurants: action.payload };
        default:
          return state;
      }


};

export default favRestaurantsReducer;
  