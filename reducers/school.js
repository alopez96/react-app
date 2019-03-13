const schoolReducer = (state = [], action) => {
    switch(action.type){
        case 'SCHOOL_TYPE':{
            return action.payload.school
        }
        default: 
            return state
    }
}

export default schoolReducer