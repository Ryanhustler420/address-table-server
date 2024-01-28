import _ from 'lodash';
import Joi from 'joi';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { hash } from '../utils/common/helper';
import Header from '../components/common/Header';
import AuthState from '../utils/common/auth-state';
import { errorToast, postRegisterUser } from '../apis';
import BirthdayDateTimePicker from '../components/BirthdayDateTimePicker';
import { AuthResponse_RegisterUser } from '@com.xcodeclazz/address-table-server';
import { Genders } from "@com.xcodeclazz/address-table-server/build/constants/users";
import { AuthPayloadJoi_RegisterUser, AuthPayload_RegisterUser } from "@com.xcodeclazz/address-table-server/build/payloads/auth";
import { IonButtons, IonContent, IonPage, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonThumbnail, IonGrid, IonCol, IonRow, IonCheckbox, IonSpinner } from '@ionic/react';

import "./Register.css";

const Register: React.FC<{}> = props => {
    const history = useHistory();
    const authState = new AuthState();
    const cityRef = React.createRef<HTMLIonInputElement>();
    const nameRef = React.createRef<HTMLIonInputElement>();
    const emailRef = React.createRef<HTMLIonInputElement>();
    const phoneRef = React.createRef<HTMLIonInputElement>();
    const stateRef = React.createRef<HTMLIonInputElement>();
    const genderRef = React.createRef<HTMLIonSelectElement>();
    const addressRef = React.createRef<HTMLIonInputElement>();
    const countryRef = React.createRef<HTMLIonInputElement>();
    const passwordRef = React.createRef<HTMLIonInputElement>();

    const [birthday, setBirthday] = useState<string>('');
    const [avatar, setAvatar] = useState<string>(`https://gravatar.com/avatar/${hash(Math.random().toString())}?s=800&d=robohash&r=x`);

    const [loading, setLoading] = useState<boolean>(false);
    const [avatarChanging, setAvatarChanging] = useState<boolean>(false);
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

    const setNewAvatar = () => {
        setAvatarChanging(true);
        setAvatar(`https://gravatar.com/avatar/${hash(Math.random().toString())}?s=800&d=robohash&r=x`);
    };

    const onRegisterHandler = async () => {
        const city = cityRef.current?.value?.toString();
        const name = nameRef.current?.value?.toString();
        const email = emailRef.current?.value?.toString();
        const phone = phoneRef.current?.value?.toString();
        const state = stateRef.current?.value?.toString();
        const gender = genderRef.current?.value?.toString() as Genders;
        const address = addressRef.current?.value?.toString();
        const country = countryRef.current?.value?.toString();
        const password = passwordRef.current?.value?.toString();
        if (!city || !name || !email || !phone || !state || !gender || !address || !country || !password) return;

        const data: AuthPayload_RegisterUser = { address, avatar, city, country, dob: birthday, gender, name, email, password, phone, state };
        
        const { error, value } = Joi.object(AuthPayloadJoi_RegisterUser).validate(data);
        if (!error) {
            setLoading(true);
            postRegisterUser(value, res => {
                authState.saveToken(res.headers['base64']);
                authState.saveUser(res?.data as AuthResponse_RegisterUser);
                history.replace("/");
            }, error => {
                errorToast(error);
                setLoading(false);
            });
        }
    };

    return (
        <IonPage>
            <Header themeBtn settingIcon backBtn="/" />
            <IonContent fullscreen className="ion-padding">
                <section className='h-full w-full'>
                    <IonGrid className='h-full'>
                        <IonRow className='h-full'>
                            <IonCol size='12' sizeMd='6'>
                                <section className='h-full flex flex-col items-center justify-center ion-padding'>
                                    <IonThumbnail onClick={setNewAvatar} onLoad={e => setAvatarChanging(false)}><img alt="avatar" src={avatar} /></IonThumbnail>
                                    <h1 className='text-4xl md:text-5xl'>
                                        <IonLabel color="secondary" className='font-bold'>x</IonLabel>CodeClazz
                                    </h1>
                                    <small className='text-center text-md md:text-lg'>Tap on Image</small>
                                    {avatarChanging && <IonSpinner color="primary" name="dots"/>}
                                </section>
                            </IonCol>
                            <IonCol size='12' sizeMd='6' className='flex justify-center md:items-center'>
                                <section className='w-full lg:w-2/3'>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonInput ref={nameRef} label="Name" labelPlacement="floating" fill="outline" placeholder="Full Name"></IonInput>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonInput ref={addressRef} label="Address" labelPlacement="floating" fill="outline" placeholder="Address"></IonInput>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonInput ref={cityRef} label="City" labelPlacement="floating" fill="outline" placeholder="Ex. Jamshedpur"></IonInput>
                                            </IonCol>
                                            <IonCol>
                                                <IonInput ref={stateRef} label="State" labelPlacement="floating" fill="outline" placeholder="Ex. Jharkhand"></IonInput>
                                            </IonCol>
                                            <IonCol>
                                                <IonInput ref={countryRef} label="Country" labelPlacement="floating" fill="outline" placeholder="Ex. India"></IonInput>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonInput ref={phoneRef} label="Phone" labelPlacement="floating" fill="outline" placeholder="Phone" type="number"></IonInput>
                                            </IonCol>
                                            <IonCol>
                                                <IonSelect ref={genderRef} labelPlacement='floating' placeholder="Gender" fill='outline'>
                                                    <IonSelectOption value="male">Male</IonSelectOption>
                                                    <IonSelectOption value="female">Female</IonSelectOption>
                                                    <IonSelectOption value="other">Other</IonSelectOption>
                                                </IonSelect>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonInput ref={emailRef} label="Email" labelPlacement="floating" fill="outline" placeholder="Your email address" type='email'></IonInput>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonInput ref={passwordRef} label="Password" labelPlacement="floating" fill="outline" type='password' placeholder="**********"></IonInput>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol className='flex flex-row justify-between items-center'>
                                                <IonLabel>{birthday ? birthday : 'Date of Birth'}</IonLabel>
                                                <IonButtons>
                                                    <IonButton fill="outline" onClick={() => setDatePickerOpen(true)}>Select</IonButton>
                                                </IonButtons>
                                            </IonCol>
                                        </IonRow>
                                        <br />
                                        <IonRow>
                                            <IonCol>
                                                <IonCheckbox>I agree to the terms and conditions</IonCheckbox>
                                            </IonCol>
                                        </IonRow>
                                        <IonButton expand='block' fill="outline" onClick={onRegisterHandler}>
                                            Create Profile
                                            {loading && <IonSpinner name="dots" />}
                                        </IonButton>
                                    </IonGrid>
                                    <BirthdayDateTimePicker isOpen={datePickerOpen} onCancel={() => setDatePickerOpen(false)} onSelected={(date: string) => { setBirthday(date); setDatePickerOpen(false); }} />
                                </section>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </section>                
            </IonContent>
        </IonPage>
    )
};

export default Register;