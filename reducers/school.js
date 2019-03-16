const schoolReducer = (state = [], action) => {
    switch(action.type){
        case 'UPDATE_SCHOOL':{
            return action.payload.school
        }
        default: 
            return state
    }
}

export default schoolReducer