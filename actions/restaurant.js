import { db } from "../config/firebase";
import { collection ,getDocs} from "firebase/firestore";

export const FETCH_RESTAURANTS = 'FETCH_RESTAURANTS';

export const fetchRestaurants = () => {
  return async (dispatch) => {
    const restaurantsCollection = collection(db, 'restaurants');
    const snapshot = await getDocs(restaurantsCollection);
    const restaurants = [];
    snapshot.forEach((doc) => {
      restaurants.push(doc.data());
    });
    dispatch({ type: FETCH_RESTAURANTS, payload: restaurants });
  };
};