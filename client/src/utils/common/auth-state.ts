import { UserAttrs } from '@com.xcodeclazz/monolithic-common';
import _ from 'lodash';

export default class AuthState {

    saveToken(token: string): void {
        this.save('l', token);
    }
    getToken(): string | null {
        return this.get('l');
    }

    saveUser(cache: UserAttrs | null): void {
        this.save('x', btoa(JSON.stringify(cache)));
    }

    validateUser() {
        let token = this.getToken();
        let user = this.getUser() as UserAttrs | null;
        if (user != null && token != null) return true;
        return false;
    };

    getUser(): UserAttrs | null{
        if (this.get('x') == null) return null;
        try {
            return JSON.parse(atob(this.get('x')!.toString()));
        } catch {
            return null;
        }
    }

    get(key: string): string | null {
        if (localStorage.getItem(key)) return localStorage.getItem(key);
        return null;
    }

    save(key: string, value: any): void {
        if (value == null) return;
        localStorage.setItem(key, value);
    }

    delete = (key: string) => localStorage.removeItem(key);
    clean = () => localStorage.clear();
}