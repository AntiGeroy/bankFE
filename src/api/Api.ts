import  {GridDataRequest} from "../gridomizer/domain/GridData";
import {Address, Client, File} from "../Types";

const axios = require('axios').default;

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

export interface FetchGridRequest {
    gridName : string
}

export interface FetchUserRequest {
    clientId : string
}

export interface FetchAccountRequest {
    accountId : string
}

export interface FetchAddressRequest {
    addressId : string
}


class Api {

    public static freezeAccount = (request : {accountId : number}) : Promise<any> => {
      return instance.post("api/ucty/zmrazit", request);
    };

    public static unfreezeAccount = (request : {accountId : number}) : Promise<any> => {
        return instance.post("api/ucty/rozmrazit", request);
    };

    public static fetchGridConfig = (request : FetchGridRequest) : Promise<any> => {
        return instance.get(("api/core/grids/" + request.gridName));
    };

    public static fetchGridData = (request : GridDataRequest, gridName : string) : Promise<any> => {
        return instance.post("api/core/grids/" + gridName + "/values", request)
    };

    public static fetchClientData = (request : FetchUserRequest) : Promise<any> => {
        return instance.get('api/klienti/' + request.clientId);
    };

    public static addNewTransaction = (request : any) : Promise<any> => {
        return instance.post('api/transakce/novy', request);
    };

    public static fetchAccountData = (request : FetchAccountRequest) : Promise<any> => {
        return instance.get('api/ucty/' + request.accountId);
    };

    public static addNewAccount = (request : any) : Promise<any> => {
        return instance.post('api/ucty/novy', request);
    };

    public static updateClientData = (request : Client) : Promise<any> => {
        return instance.put('api/klienti/' + request.clientId, request);
    };

    public static createNewAddress = (request : Address) : Promise<any> => {
        return instance.post('api/adresy/novy', request);
    };

    public static saveNewDocument = (request : File, fileData : any) : Promise<any> => {
        const formData = new FormData();
        formData.append('file', fileData);
        formData.append('name', request.name ? request.name : '');
        formData.append('clientId', request.clientId ? String(request.clientId) : '');
        formData.append('typeId', request.type ? String(request.type) : '');

        const config = {headers: {'content-type': 'multipart/form-data'}};

        return instance.post('api/dokumenty/novy', formData, config);
    };

    public static fetchAddressData = (request : FetchAddressRequest) : Promise<any> => {
        return instance.get('api/adresy/' + request.addressId);
    };
}

export default Api;