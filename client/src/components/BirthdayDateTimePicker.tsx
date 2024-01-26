import moment from 'moment';
import React, { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonDatetime, IonFooter } from '@ionic/react';

const BirthdayDateTimePicker: React.FC<{
    isOpen: boolean;
    onCancel: () => void;
    onSelected: (date: string) => void;
}> = props => {
    const [selectedDate, setSelectedDate] = useState<string>('Nothing Selected');
    const submitHandler = () => props.onSelected(selectedDate);

    return (
        <IonModal isOpen={props.isOpen} onDidDismiss={props.onCancel}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Birthday</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={props.onCancel}>Cancel</IonButton>
                        <IonButton onClick={submitHandler}>Done</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonDatetime
                    min="1947-03-01T00:00:00" max={moment().add({ year: -6 }).toISOString()}
                    onIonChange={e => setSelectedDate(e.target.value?.toString() || '')}
                    style={{ margin: 'auto' }}
                ></IonDatetime>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <IonTitle>{selectedDate}</IonTitle>
                </IonToolbar>
            </IonFooter>
        </IonModal>
    );
}

export default BirthdayDateTimePicker;