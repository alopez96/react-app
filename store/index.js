import { combineReducers ,createStore } from 'redux';
import userReducer from '../reducers/user';
import schoolReducer from '../reducers/school';
import interestReducer from '../reducers/interest';
import { saleListReducer, saleItemReducer, 
        saleCategoryReducer, modalReducer } from '../reducers/sale';

const allReducers = combineReducers({
    user: userReducer,
    school: schoolReducer,
    interest: interestReducer,
    saleList: saleListReducer,
    saleItem: saleItemReducer,
    saleCategory: saleCategoryReducer,
    isModalVisible: modalReducer
})

export default store = createStore(allReducers)