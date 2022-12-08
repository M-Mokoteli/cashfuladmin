import Types from './../actions/Types';
import { Reducer } from "react";
import { AlertColor } from "../actions/AppAction";

export interface iAppState {
    loading: boolean
    message?: string
    type?: AlertColor
}

export const initAppState = {
    loading: false,
    message: undefined,
    type: undefined
} as iAppState;


export interface iAppAction {
    type: Types,
    payload?: iAppState
}

const AppReducer: Reducer<iAppState, iAppAction> = (state, action) => {
    switch (action.type) {
        case Types.SET_MESSAGE:
            return {
                loading: action.payload?.loading ?? false,
                message: action.payload?.message,
                type: action.payload?.type
            };
        case Types.REMOVE_MESSAGE:
            return initAppState;
        case Types.LOADING:
            return {
                ...state,
                loading: action.payload?.loading ?? false
            };
        default:
            return state;
    }
};

export default AppReducer;