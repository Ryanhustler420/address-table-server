import Joi from "joi";
import _ from "lodash";
import moment from "moment";
import Header from "../components/common/Header";
import AuthState from "../utils/common/auth-state";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeOutline, openOutline } from "ionicons/icons";
import { RenderAttrs } from "@com.xcodeclazz/address-table-server";
import { Roles } from "@com.xcodeclazz/monolithic-common/build/constants/users";
import { deleteRenderDelete, errorToast, getRenders, postRenderCreate } from "../apis";
import { insertRender, removeRender, saveRenders } from "../redux/reducers/renderState";
import { RenderPayload_CreateRender, RenderPayloadJoi_CreateRender } from "@com.xcodeclazz/address-table-server/build/payloads/render";
import {
  IonCol,
  IonRow,
  IonGrid,
  IonPage,
  IonList,
  IonItem,
  IonChip,
  IonIcon,
  IonInput,
  IonLabel,
  IonButton,
  IonContent,
  IonSpinner,
  IonButtons,
  IonRefresher,
  IonSearchbar,
  IonListHeader,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";

const Dashboard: React.FC<{}> = (props) => {
  const dispatch = useDispatch();
  const authState = new AuthState();
  const renders_state: RenderAttrs[] = useSelector((state: any) => state.renderState.renders);

  const [isCreating, setCreating] = useState<boolean>(false);
  const [isFetching, setFetching] = useState<boolean>(false);

  const urlRef = React.createRef<HTMLIonInputElement>();
  const tagsRef = React.createRef<HTMLIonInputElement>();
  const emailRef = React.createRef<HTMLIonInputElement>();
  const capacityRef = React.createRef<HTMLIonInputElement>();
  const serviceIdRef = React.createRef<HTMLIonInputElement>();
  const authTokenRef = React.createRef<HTMLIonInputElement>();
  const imageNameRef = React.createRef<HTMLIonInputElement>();

  useEffect(() => { getRendersList(); }, []);

  const isAdmin = () => authState.getUser()?.roles?.includes(Roles.ADMIN);
  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => getRendersList(event);
  const clearForm = () => {
    if (urlRef.current) urlRef.current.value = "";
    if (tagsRef.current) tagsRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (capacityRef.current) capacityRef.current.value = "";
    if (serviceIdRef.current) serviceIdRef.current.value = "";
    if (authTokenRef.current) authTokenRef.current.value = "";
    if (imageNameRef.current) imageNameRef.current.value = "";
  };
  const onDeleteHandler = (render: RenderAttrs) => {
    setFetching(true);
    deleteRenderDelete({ url: render.url }, response => {
      dispatch(removeRender({ url: render.url }));
      setFetching(false);
    }, error => {
      setFetching(false);
      errorToast(error);
    });
  };
  const onCreateHandler = () => {
    const url = urlRef.current?.value?.toString();
    const tags = tagsRef.current?.value?.toString();
    const email = emailRef.current?.value?.toString();
    const capacity = capacityRef.current?.value?.toString();
    const serviceId = serviceIdRef.current?.value?.toString();
    const authToken = authTokenRef.current?.value?.toString();
    const imageName = imageNameRef.current?.value?.toString();
    if (
      !url ||
      !tags ||
      !email ||
      !capacity ||
      !serviceId ||
      !authToken ||
      !imageName
    ) {
      return;
    }

    const data: RenderPayload_CreateRender = {
      url,
      email,
      imageName,
      authToken,
      serviceId,
      isActive: true,
      isLocked: false,
      capacity: +capacity,
      tags: tags.split(","),
    };
    const { error, value } = Joi.object(RenderPayloadJoi_CreateRender).validate(data);
    if (!error) {
      setCreating(true);
      postRenderCreate(value, (response) => {
        dispatch(insertRender({ render: response.data }));
        setCreating(false);
      }, (error) => {
        setCreating(false);
        errorToast(error);
      });
    }
  };

  const getRendersList = (event?: CustomEvent<RefresherEventDetail>) => {
    setFetching(true);
    getRenders(response => {
      dispatch(saveRenders({ renders: response.data }));
      event?.detail?.complete();
      setFetching(false);
    }, error => {
      event?.detail?.complete();
      setFetching(false);
      errorToast(error);
    });
  };

  return (
    <IonPage>
      <Header logoutIcon />
      <IonContent fullscreen>
        <IonRefresher
          slot="fixed"
          pullFactor={0.5}
          pullMin={100}
          pullMax={200}
          onIonRefresh={handleRefresh}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonGrid className="overflow-hidden h-full bg-yellow-500/20">
          <IonRow className="h-full overflow-scroll">
            <IonCol size="4">
              <IonList className="h-full rounded-lg">
                <IonListHeader>
                  <IonLabel>Render Web Service</IonLabel>
                </IonListHeader>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        ref={urlRef}
                        label="Url"
                        type="email"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Url"
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        ref={capacityRef}
                        type="number"
                        label="Capacity"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Capacity"
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        ref={emailRef}
                        label="Email"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Email"
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        ref={tagsRef}
                        label="Tags"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Tags, Comma Seperated"
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        ref={serviceIdRef}
                        label="Srv"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Srv"
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        ref={authTokenRef}
                        label="Auth Token"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Auth Token"
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        ref={imageNameRef}
                        label="Image Name"
                        labelPlacement="floating"
                        fill="outline"
                        placeholder="Image Name"
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonButtons>
                        <IonButton disabled>
                          {isCreating && <IonSpinner name="dots" />}
                        </IonButton>
                      </IonButtons>
                    </IonCol>
                    <IonCol>
                      <IonButtons>
                        <IonButton
                          color="primary"
                          disabled={!isAdmin()}
                          onClick={onCreateHandler}
                        >
                          Create Render
                        </IonButton>
                        <IonButton onClick={clearForm}>Clear Form</IonButton>
                      </IonButtons>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonList>
            </IonCol>
            <IonCol size="8" className="h-full overflow-scroll">
              <IonList lines="none" className="rounded-lg h-full overflow-scroll ion-no-padding">
                <IonSearchbar placeholder={`${renders_state.length} Running Instaces`} />
                {isFetching && <IonItem><IonSpinner name="dots" /></IonItem>}
                {!isFetching && renders_state.length == 0 && <IonItem><h1>You don't have any target machine. Create one!</h1></IonItem>}
                {_.map(renders_state, (el, idx) => (
                  <IonItem button key={idx} color={!el.isActive ? "danger" : ""}>
                    <IonButton fill="clear" href={`${el.url}`} target="_blank">
                      <IonIcon slot="icon-only" icon={openOutline} />
                    </IonButton>
                    <IonLabel className="font-bold underline">{el.url}</IonLabel>
                    <IonChip color="success">Cap: {el.capacity}</IonChip>
                    {_.map(el.tags, (ell, idxx) => (<IonButton fill="clear" disabled key={idxx}>{ell}</IonButton>))}
                    {/* @ts-ignore */}
                    <IonButton fill="clear">{moment(el?.createdAt).fromNow()}</IonButton>
                    <IonButton fill="clear" onClick={e => onDeleteHandler(el)}>
                      <IonIcon slot="icon-only" icon={closeOutline} />
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
