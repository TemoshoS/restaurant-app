import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export const FETCH_FAVORITE_RESTAURANTS = 'FETCH_FAVORITE_RESTAURANTS';

export const fetchFavoriteRestaurants = (userId) => {
  return async (dispatch) => {
    const favoriteRestaurantsCollection = collection(db, 'favouriteRestaurants');
    const snapshot = await getDocs(favoriteRestaurantsCollection);


    const favoriteRestaurants = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === userId) {
        favoriteRestaurants.push(data);
      }
    });

    dispatch({ type: FETCH_FAVORITE_RESTAURANTS, payload: favoriteRestaurants });
  };
};
