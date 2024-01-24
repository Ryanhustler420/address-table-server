import _ from 'lodash';
import { routes } from './routes';
import Capacitor from '../utils/Capacitor';
import AuthState from '../utils/common/auth-state';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

const authState = new AuthState();

const handle = (response: HttpResponse, cb: (response: HttpResponse) => void) => {
    switch(response.status) {
        case 401:
            authState.saveUser(null);
            authState.saveToken('');
            cb(response);
            break;
        case 200:
        case 201:
            cb(response);
            break;
        default:
            throw { response };
    }
}

export const getCurrentUser = _.debounce((cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.get({
        url: routes.GET_CURRENT_USER,
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const errorToast = _.debounce((error: any) => {
    // @ts-ignore
    const message = _.first(error.response?.data.errors)?.message;
    if (message) Capacitor.toast(message, "long");
});

const commonHeader = () => {
    return {
        'Content-Type': 'application/json',
        'base64': authState.getToken() || '',
    };
}