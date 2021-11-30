import  {GridDataRequest} from "../gridomizer/domain/GridData";
import {Address, Client, ClientAddress, File, UserData} from "../Types";

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

export interface FetchCardRequest {
    cardId : string
}

export interface FetchCreditRequest {
    creditId : string
}

export interface UpdateClientAddressRequest {
    addressId : string,
    clientId : string,
    state : number
}

export interface AuthRequest {
    username : string,
    password : string
}

export type UserRole = 'ADMIN' | 'USER';

export interface NewUserRequest {
    login : string,
    password : string,
    role : UserRole,
    registeredBy : number
    clientId? : number | null
}

class Api {

    public static changePassword = (request : any, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.post("api/auth/changePassword/" , request, config);
    };

    public static blockUserById = (request : number, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get("api/auth/blockUser/" + request, config);
    };

    public static unblockUserById = (request : number, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get("api/auth/unblockUser/" + request, config);
    };

    public static resetUserPasswordById = (request : number, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get("api/auth/reset/" + request, config);
    };

    public static getUserById = (request : number, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get("api/auth/getUser/" + request, config);
    };

    public static addNewAdminUser = (request : NewUserRequest, token : string): Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.post("api/auth/new", request, config);
    };

    public static authenticateUser = (request : AuthRequest): Promise<any> => {
        return instance.post("api/auth/login", request);
    };

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

    public static fetchClientData = (request : FetchUserRequest, token : string) : Promise<any> => {
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        };

        return instance.get('api/klienti/' + request.clientId, config);
    };

    public static addNewTransaction = (request : any) : Promise<any> => {
        return instance.post('api/transakce/novy', request);
    };

    public static fetchCardData = (request : FetchCardRequest) : Promise<any> => {
        return instance.get('api/karty/' + request.cardId);
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

    public static updateClientAddressState = (request : ClientAddress) : Promise<any> => {
        return instance.put('api/klienti/addressState', request);
    };

    public static createNewAddress = (request : Address) : Promise<any> => {
        return instance.post('api/adresy/novy', request);
    };

    public static updateAddressData = (request : Address) : Promise<any> =>{
        return instance.put('api/adresy/' + request.addressId, request);
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

    public static fetchClientsOnAddress = (request : FetchAddressRequest) : Promise<any> => {
        return instance.get('api/klienti/batch/' + request.addressId);
    };
}

export default Api;