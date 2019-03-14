const schoolReducer = (state = [], action) => {
    switch(action.type){
        case 'SCHOOL_TYPE':{
            console.log('school', action.payload.school)
            return action.payload.school
        }
        default: 
            return state
    }
}

export default schoolReducer