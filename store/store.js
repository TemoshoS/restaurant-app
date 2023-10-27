import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import restaurantsReducer from '../reducers/restaurantsReducer';
import reserveReducer from '../reducers/reserveReducer';
import authReducer from '../reducers/authReducer';


const rootReducer = combineReducers({
  restaurants: restaurantsReducer,
  reservation: reserveReducer,
  auth: authReducer,
 
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
