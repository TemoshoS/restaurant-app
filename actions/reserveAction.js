import { db } from "../config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const RESERVE_SUCCESS = "RESERVE_SUCCESS";
export const RESERVE_FAILURE = "RESERVE_FAILURE";

export const FETCH_PAST_RESERVATIONS = 'ETCH_PAST_RESERVATIONS';


export const reserveTable = (reservationData) => {
  return async (dispatch) => {
    try {
      // Save the reservation data to Firestore
      const ordersCollection = collection(db, "Orders");
      const docRef = await addDoc(ordersCollection, reservationData);
      
      
      dispatch({ type: RESERVE_SUCCESS, payload: docRef });
    } catch (error) {
     
      dispatch({ type: RESERVE_FAILURE, payload: error.message });
    }
  };
};

export const fetchPastReservations =()=>{
  return async (dispatch) => {
    const reservationsCollection = collection(db, 'Orders');
    const snapshot = await getDocs(reservationsCollection);
    const pastReservations=[];
    snapshot.forEach((doc) => {
      pastReservations.push(doc.data());
    });
    dispatch({ type: FETCH_PAST_RESERVATIONS, payload: pastReservations });
  }
}
