const saleListReducer = (state = [], action) => {
    switch(action.type){
        case 'SALE_LIST':{
            return [... action.payload.saleList ]
        }
        default: 
            return state
    }
}

export default saleListReducer