import Types from './Types';
import React from 'react';
import { iAppAction } from './../reducers/AppReducer';

export enum AlertColor {
    DANGER = "danger", SUCCESS = "success", PRIMARY = "primary", INFO = "info", NONE = ""
}

class AppAction {
    dispatch: React.Dispatch<iAppAction>;

    constructor(dispatch: React.Dispatch<iAppAction>) {
        this.dispatch = dispatch;
    }
    /**
     * @param {boolean} status - status of the loading (true/false)
     * @description set to true/false to start/stop loading status in global applicaiton state (context api)
     */
    LOADING = (status = false) => {
        this.dispatch({
            type: Types.LOADING,
            payload: {
                loading: status
            }
        });
    };

    /**
     * @param {AlertColor} type - color of the snackbar
     * @param {string} message - set this message into snackbar
     * @param {boolean} loading - set to true/false to start/stop loading
     * @description set snackbar message also set app loading status in global applicaiton state (context api)
     */
    SET_MESSAGE = (type: AlertColor, message: string, loading = false) => {
        this.dispatch({
            type: Types.SET_MESSAGE,
            payload: {
                loading: loading,
                message: message,
                type: type
            }
        });
    };
    /**
     * @description remove message from snackbar in global applicaiton state (context api)
     */
    REMOVE_MESSAGE = () => {
        this.dispatch({
            type: Types.SET_MESSAGE
        });
    };

}

export default AppAction;