import {GridConfig, SortCondition} from "../gridomizer/domain/GridConfig";
import GridData, {GridDataRequest, SearchCondition} from "../gridomizer/domain/GridData";
import ClientInfo, {Client} from "../components/clientInfo/ClientInfo";

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
        console.error("API : ", request);
        return instance.put('api/klienti/' + request.clientId, request);
    };

}

export default Api;