import { FETCH_FAVORITE_RESTAURANTS } from "../actions/favoriteRestaurantActions";

const initialState = {
  favoriteRestaurants: [],
};

const favoriteRestaurantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FAVORITE_RESTAURANTS:
      return { ...state, favoriteRestaurants: action.payload };
    default:
      return state;
  }
};

export default favoriteRestaurantsReducer;
