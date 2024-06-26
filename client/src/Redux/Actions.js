export const setEmailAndName = (email, name) => {
        return {
        type: 'SET_EMAIL_AND_NAME',
        payload: { email, name }
        };
    };