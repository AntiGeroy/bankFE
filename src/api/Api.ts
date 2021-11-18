import GridData, {GridDataRequest, SearchCondition} from "../gridomizer/domain/GridData";
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

/*export interface FetchGridDataRequest {
    gridName : string,
    offset : number;
    count : number;
    searchConditions : SearchCondition[]
    sortConditions : SortCondition[]
}*/


class Api {

    public static fetchGridConfig = (request : FetchGridRequest) : Promise<any> => {
        return instance.get(("api/core/grids/" + request.gridName));
    };

    public static fetchGridData = (request : GridDataRequest, gridName : string) : Promise<any> => {
        return instance.post("api/core/grids/" + gridName + "/values", request)
    };

    public static fetchClientData = (request : FetchUserRequest) : Promise<any> => {
        return instance.get('api/klienti/' + request.clientId);
    };

    public static updateClientData = (request : Client) : Promise<any> => {
        return instance.put('api/klienti/' + request.clientId, request);
    };

    public static createNewAddress = (request : Address) : Promise<any> => {
        return instance.post('api/adresy/novy', request);
    };

    public static saveNewDocument = (request : File, fileData : any) : Promise<any> => {

        const formData = new FormData();
        console.error("SENDING DATA : ", fileData);
        formData.append('file', fileData);
        formData.append('name', request.name ? request.name : '');
        formData.append('clientId', request.clientId ? String(request.clientId) : '');
        formData.append('typeId', request.type ? String(request.type) : '');

        const config = {headers: {'content-type': 'multipart/form-data'}};

        return instance.post('api/dokumenty/novy', formData, config);
    }
}

export default Api;