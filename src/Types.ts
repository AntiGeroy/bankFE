export interface File {
    name? : string
    content? : any
    clientId? : number
    type? : number
}

export interface Client {
    clientId : number,
    name : string,
    surname : string,
    phoneNumber : string,
    birthNumber : string
}

export interface Address {
    addressId? : number,
    clientId : number,
    houseNumber? : string,
    street? : string,
    town? : string,
    postalCode? : string,
    countryCode? : string;
}
