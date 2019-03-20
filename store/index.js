import { combineReducers ,createStore } from 'redux';
import userReducer from '../reducers/user';
import schoolReducer from '../reducers/school';
import interestReducer from '../reducers/interest';
import { saleListReducer, saleItemReducer,
        itemIndexReducer, saleCategoryReducer } from '../reducers/sale';

const allReducers = combineReducers({
    user: userReducer,
    school: schoolReducer,
    interest: interestReducer,
    saleList: saleListReducer,
    saleItem: saleItemReducer,
    itemIndex: itemIndexReducer,
    saleCategory: saleCategoryReducer
})

export default store = createStore(allReducers)