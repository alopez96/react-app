export const saleListReducer = (state = [], action) => {
    switch(action.type){
        case 'SALE_LIST':{
            return [... action.payload.saleList ]
        }
        default: 
            return state
    }
}

export const saleItemReducer = (state = [], action) => {
    switch(action.type){
        case 'SALE_ITEM':{
            return action.payload.saleItem
        }
        default: 
            return state
    }
}

export const itemIndexReducer = (state = [], action) => {
    switch(action.type){
        case 'ITEM_INDEX':{
            return action.payload.itemIndex
        }
        default: 
            return state
    }
}


export const saleCategoryReducer = (state = [], action) => {
    switch(action.type){
        case 'SALE_CATEGORY':{
            return action.payload.saleCategory
        }
        default:
            return state
    }
}