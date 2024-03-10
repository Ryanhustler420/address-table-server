import _ from 'lodash';
import { routes } from './routes';
import Capacitor from '../utils/Capacitor';
import AuthState from '../utils/common/auth-state';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { RenderPayload_CreateRender, RenderPayload_DeleteRender } from '@com.xcodeclazz/address-table-server';
import { CompilersPayload_Cpp, CompilersPayload_Java, CompilersPayload_Python, CompilersPayload_Node } from '@com.xcodeclazz/compile-run-v2';
import { AuthPayload_LoginUser, AuthPayload_MakeUserAdmin, AuthPayload_RegisterUser, AuthPayload_RemoveUserAdmin } from '@com.xcodeclazz/monolithic-common/build/payloads/auth';

const authState = new AuthState();

const handle = (response: HttpResponse, cb: (response: HttpResponse) => void) => {
    const statusCode = response.status;
    if (statusCode >= 200 && statusCode <= 399) return cb(response);
    else if (statusCode >= 400 && statusCode <= 499) throw { response };
    else if (statusCode >= 500 && statusCode <= 599) throw { response };
    throw { response };
};

export const getCurrentUser = _.debounce((cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.get({
        url: routes.GET_AUTH_CURRENT_USER,
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postRemoveAdmin = _.debounce(( data: AuthPayload_RemoveUserAdmin, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_AUTH_REMOVE_ADMIN,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postMakeAdmin = _.debounce(( data: AuthPayload_MakeUserAdmin, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_AUTH_MAKE_ADMIN,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postRegisterUser = _.debounce(( data: AuthPayload_RegisterUser, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_AUTH_REGISTER,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postLogout = _.debounce(( cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_AUTH_LOGOUT,
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postLogin = _.debounce(( data: AuthPayload_LoginUser, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_AUTH_LOGIN,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postCompileCpp = _.debounce(( data: CompilersPayload_Cpp, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_COMPILERS_CPP,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postCompileJava = _.debounce(( data: CompilersPayload_Java, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_COMPILERS_CPP,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postCompileNode = _.debounce(( data: CompilersPayload_Node, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_COMPILERS_NODE,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postCompilePython = _.debounce(( data: CompilersPayload_Python, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_COMPILERS_PYTHON,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const getRenders = _.debounce((cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.get({
        url: routes.GET_RENDER_RENDERS,
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const getRendersCount = _.debounce((cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.get({
        url: routes.GET_RENDER_RENDERS_COUNT,
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postRenderCreate = _.debounce(( data: RenderPayload_CreateRender, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_RENDER_CREATE_RENDER,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const deleteRenderDelete = _.debounce(( data: RenderPayload_DeleteRender, cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.delete({
        url: routes.POST_RENDER_CREATE_RENDER,
        data: JSON.stringify(data),
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postPingRenders = _.debounce(( cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_RENDER_PING_RENDERS,
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const postRedeployRenders = _.debounce(( cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.post({
        url: routes.POST_RENDER_REDEPLOY_RENDERS,
        headers: commonHeader(),
    }).then(e => handle(e, cb)).catch(err);
});

export const getRandomProgrammingJoke = _.debounce(( cb: (response: HttpResponse) => void, err: (e: any) => void) => {
    CapacitorHttp.get({
        url: "https://official-joke-api.appspot.com/jokes/programming/random",
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