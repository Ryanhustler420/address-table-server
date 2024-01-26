import { UserAttrs } from '@com.xcodeclazz/address-table-server';
import _ from 'lodash';

export default class AuthState {

    saveToken(token: string): void {
        this.save('lock', token);
    }
    getToken(): string | null {
        return this.get('lock');
    }

    saveUser(cache: UserAttrs | null): void {
        this.save('auth_table', JSON.stringify(cache));
    }

    validateUser() {
        let token = this.getToken();
        let user = this.getUser() as UserAttrs;
        if (user != null && token != null) return true;
        return false;
    };

    getUser(): UserAttrs | null{
        if (this.get('auth_table') == null) return null;
        try {
            return JSON.parse(this.get('auth_table')!.toString());
        } catch (err) {
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