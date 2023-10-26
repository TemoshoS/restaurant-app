import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import restaurantsReducer from '../reducers/restaurantsReducer';
import reserveReducer from '../reducers/reserveReducer';

const rootReducer = combineReducers({
  restaurants: restaurantsReducer,
  reservation: reserveReducer,
 
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
