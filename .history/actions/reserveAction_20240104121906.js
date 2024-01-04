import { db } from "../config/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export const RESERVE_SUCCESS = "RESERVE_SUCCESS";
export const RESERVE_FAILURE = "RESERVE_FAILURE";
export const FETCH_ALL_RESERVATIONS = 'FETCH_ALL_RESERVATIONS';
export const FETCH_PAST_RESERVATIONS = 'ETCH_PAST_RESERVATIONS';


export const reserveTable = (reservationData) => {
  return async (dispatch) => {
    try {
      
      const ordersCollection = collection(db, "Orders");
      const docRef = await addDoc(ordersCollection, reservationData);
      
      
      dispatch({ type: RESERVE_SUCCESS, payload: docRef });
    } catch (error) {
     
      dispatch({ type: RESERVE_FAILURE, payload: error.message });
    }
  };
};

export const fetchPastReservations = (userId) => {
  return async (dispatch) => {
    try {
     
      //query to fetch reservations based on the userId
      const reservationsCollection = collection(db, 'Orders');
      const userQuery = query(reservationsCollection, where('userId', '==', userId));

      const snapshot = await getDocs(userQuery);

      const pastReservations = [];
      snapshot.forEach((doc) => {
        pastReservations.push(doc.data());
      });

      
      dispatch({ type: FETCH_PAST_RESERVATIONS, payload: pastReservations });
    } catch (error) {
      // Handle errors
      console.error('Error fetching past reservations:', error); 
    }
  };
}


export const fetchAllReservations = () => {
  return async (dispatch) => {
    try {
      // Query to fetch all reservations
      const reservationsCollection = collection(db, 'Orders');
      const snapshot = await getDocs(reservationsCollection);
      const allReservations = [];

      snapshot.forEach((doc) => {
        allReservations.push(doc.data());
      });

      dispatch({ type: FETCH_ALL_RESERVATIONS, payload: allReservations });
    } catch (error) {
      console.error('Error fetching all reservations:', error);
    }
  };
};
