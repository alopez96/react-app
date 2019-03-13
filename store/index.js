import { combineReducers ,createStore } from 'redux';
import userReducer from '../reducers/user';
import schoolReducer from '../reducers/school';

const allReducers = combineReducers({
    user: userReducer,
    school: schoolReducer
})

export default store = createStore(allReducers)