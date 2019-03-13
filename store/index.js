import { combineReducers ,createStore } from 'redux';
import userReducer from '../reducers/user';
import schoolReducer from '../reducers/school';
import interestReduer from '../reducers/interest';

const allReducers = combineReducers({
    user: userReducer,
    school: schoolReducer,
    interest: interestReduer
})

export default store = createStore(allReducers)