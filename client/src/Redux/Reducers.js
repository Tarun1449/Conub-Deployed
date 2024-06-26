const initialState = {
        email: '',
        name: '',
        
    };
    const rootReducer = (state = initialState, action) => {
        switch (action.type) {
        case 'SET_EMAIL_AND_NAME':
            return {
            ...state,
            email: action.payload.email,
            name: action.payload.name,
            };
        default:
            return state;
        }
    };
    export default rootReducer;