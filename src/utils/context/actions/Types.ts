enum Types {
    //app global state
    LOADING = "LOADING",
    STOP_LOADING = "STOP_LOADING",
    SET_MESSAGE = "SET_MESSAGE",
    REMOVE_MESSAGE = "REMOVE_RESPONSE",
    RELOAD = "RELOAD",
    //list
    GET_DATA = "GET_DATA",
    ADD_DATA = "ADD_DATA",
    UPDATE_DATA = "UPDATE_DATA",
    DELETE_DATA = "DELETE_DATA",
    //optional
    DARK_THEME = "DARK_THEME",
    //payload structure
    // UPDATE_PAYLOAD: <T>(id_field: string, obj: T) => {
    //     return {
    //         obj,
    //         id_field
    //     }
    // }
}

export default Types;