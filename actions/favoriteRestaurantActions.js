import { db } from "../config/firebase";
import { collection ,getDocs} from "firebase/firestore";

export const FETCH_FAV_RESTAURANTS = 'FETCH_FAV_RESTAURANTS';

export const fetchFavouriteRestaurants = () => {
  return async (dispatch) => {
    const restaurantsCollection = collection(db, 'favouriteRestaurants');
    const snapshot = await getDocs(restaurantsCollection);
    const favRestaurants = [];
    snapshot.forEach((doc) => {
      favRestaurants.push(doc.data());
    });
    dispatch({ type: FETCH_FAV_RESTAURANTS, payload: favRestaurants });
  };
};