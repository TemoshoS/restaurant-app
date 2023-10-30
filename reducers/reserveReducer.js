import { RESERVE_SUCCESS, RESERVE_FAILURE, FETCH_PAST_RESERVATIONS } from "../actions/reserveAction";

const initialState = {
  reservationSuccess: null,
  reservationError: null,
  pastReservations: [],
};

const reserveReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESERVE_SUCCESS:
      return { ...state, reservationSuccess: action.payload, reservationError: null };
    case RESERVE_FAILURE:
      return { ...state, reservationSuccess: null, reservationError: action.payload };
    case FETCH_PAST_RESERVATIONS:
      return {...state, pastReservations: action.payload};
    default:
      return state;
  }
};

export default reserveReducer;