const interestReducer = (state = [], action) => {
    switch(action.type){
        case 'INTEREST_TYPE':{
            return action.payload.interest
        }
        default: 
            return state
    }
}

export default interestReducer