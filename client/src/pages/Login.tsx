import Joi from 'joi';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { errorToast, postLogin } from '../apis';
import Header from '../components/common/Header';
import AuthState from '../utils/common/auth-state';
import { AuthResponse_LoginUser } from '@com.xcodeclazz/address-table-server';
import { AuthPayloadJoi_LoginUser } from '@com.xcodeclazz/address-table-server/build/payloads/auth';
import { IonButton, IonContent, IonPage, IonLabel, IonInput, IonButtons, IonGrid, IonRow, IonCol, IonThumbnail, IonSpinner } from '@ionic/react';

import "./Login.css";

const Login: React.FC<{}> = props => {
    const history = useHistory();
    const authState = new AuthState();
    const emailRef = React.createRef<HTMLIonInputElement>();
    const passwordRef = React.createRef<HTMLIonInputElement>();
    const [loading, setLoading] = useState<boolean>(false);

    const onLoginHandler = () => {
        const email = emailRef.current?.value?.toString();
        const password = passwordRef.current?.value?.toString();
        if (!email || !password) return;

        const { error, value } = Joi.object(AuthPayloadJoi_LoginUser).validate({ email, password });
        if (!error) {
            setLoading(true);
            postLogin(value, res => {
                authState.saveToken(res.headers['base64']);
                authState.saveUser(res?.data as AuthResponse_LoginUser);
                history.replace('/');
            }, error => {
                errorToast(error);
                setLoading(false);
            });
        }
    }

    return (
        <IonPage>
            <Header settingIcon backBtn="/" />
            <IonContent className='ion-padding'>
                <section className='h-full w-full'>
                    <IonGrid className='h-full'>
                        <IonRow className='h-full'>
                            <IonCol size='12' sizeMd='6'>
                                <section className='h-full flex flex-col items-center justify-center ion-padding'>
                                    <IonThumbnail>
                                        <img alt="avatar" src="/assets/icon/xcodeclazz.png" />
                                    </IonThumbnail>
                                    <h1 className='text-4xl md:text-5xl'>
                                        <IonLabel color="secondary" className='font-bold'>x</IonLabel>CodeClazz
                                    </h1>
                                    <small className='text-center text-md md:text-lg'>Learn To Code</small>
                                </section>
                            </IonCol>
                            <IonCol size='12' sizeMd='6' className='flex justify-center md:items-center'>
                                <section className='w-full lg:w-2/3'>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonInput ref={emailRef} label="Email" labelPlacement="floating" fill="outline" placeholder="Your email address" type='email'></IonInput>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonInput ref={passwordRef} label="Password" labelPlacement="floating" fill="outline" placeholder="**********" type='password'></IonInput>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonButtons className='w-full flex justify-end'>
                                                    <IonButton fill="outline" onClick={onLoginHandler}>
                                                        Login{loading && <IonSpinner name="dots" />}
                                                    </IonButton>
                                                </IonButtons>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </section>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </section>
            </IonContent>
        </IonPage>
    )
};

export default Login;