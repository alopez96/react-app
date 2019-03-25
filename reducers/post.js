//reducer to update post list
export const postListReducer = (state = [], action) => {
    switch(action.type){
        case 'POST_LIST':{
            return [... action.payload.postList ]
        }
        default: 
            return state
    }
}

//reducer to select specific post
export const postReducer = (state = [], action) => {
    switch(action.type){
        case 'SELECT_POST':{
            return action.payload.post
        }
        default: 
            return state
    }
}
