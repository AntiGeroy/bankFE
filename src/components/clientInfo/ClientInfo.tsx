import React from "react";
import './ClientInfo.css';
import ClientInfoCard from "../clientInfoCard/ClientInfoCard";
import RoutableGrid from '../routableGrid/RoutableGrid';
import {SearchCondition} from "../../gridomizer/domain/GridData";
import {SEARCHTYPE} from "../../gridomizer/domain/GridConfig";
import {CircularProgress} from "@material-ui/core";
import Api from "../../api/Api";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import MessageBox, {MessageBoxProps} from "../messageBox/MessageBox";

interface ClientInfoProps{
    match : any
}

export interface Client {
    clientId : number,
    name : string,
    surname : string,
    phoneNumber : string,
    birthNumber : string
}

export interface Address {
    addressId : number,
    clientId : number,
    houseNumber : string,
    street : string,
    town : string,
    postalCode : string,
    countryCode : string;
}

interface ClientInfoState {
    loading : boolean,
    client : Client | undefined,
    showChangeDataDialog : boolean,
    message? : any
}

interface ChangeClientDataDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setClient : any,
    client : Client
}

interface ChangeClientDataDialogState {
    fields : Client,
    nameError : string,
    surnameError : string,
    contactNumberError : string,
    birthNumberError : string,
}

interface AddNewAddressDialogProps {
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    address : Address
}

interface AddNewAddressDialogState {
    fields :  Address,
    houseNumberError : string,
    streetError : string,
    townError : string,
    postalCodeError : string,
    countryCodeError : string;
}

class ChangeClientDataDialog extends React.Component<ChangeClientDataDialogProps, ChangeClientDataDialogState>{

    state = {
        fields : this.props.client,
        nameError : '',
        surnameError : '',
        contactNumberError : '',
        birthNumberError : '',
    };

    setName = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, name : event.target.value}, nameError : ''});
    };

    setSurname = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, surname : event.target.value}, surnameError : ''});
    };

    setContactNumber = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, phoneNumber : event.target.value}, contactNumberError : ''});
    };

    setBirthNumber = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, birthNumber : event.target.value}, birthNumberError : ''});
    };

    validate = () : any => {

        let nameError = '';
        let surnameError = '';
        let contactNumberError = '';
        let birthNumberError = '';

        if (this.state.fields.name.length === 0){
            nameError = 'Jméno nesmí být prázdné';
        }

        if (this.state.fields.surname.length === 0){
            surnameError = 'Přijmení nesmí být prázdné';
        }

        if (this.state.fields.phoneNumber.length === 0){
            contactNumberError = 'Kontaktní číslo nesmí být prázdné';
        }
        else if (isNaN(Number(this.state.fields.phoneNumber))){
            contactNumberError = 'Kontaktní číslo nesmí obsahovat písmena';
        }

        if (this.state.fields.birthNumber.length === 0){
            birthNumberError = 'Rodné číslo nesmí být prázdné';
        }
        else if (isNaN(Number(this.state.fields.birthNumber))){
            birthNumberError = 'Rodné číslo nesmí obsahovat písmena';
        }

        return {
            nameError : nameError,
            surnameError : surnameError,
            contactNumberError : contactNumberError,
            birthNumberError : birthNumberError
        };

    };

    onSubmit = () : void => {
        const errors = this.validate();

        const {nameError, surnameError, birthNumberError, contactNumberError} = errors;
        if (nameError.length > 0 || surnameError.length > 0 || birthNumberError.length > 0 || contactNumberError.length > 0){
            this.setState({
                nameError : nameError,
                surnameError : surnameError,
                contactNumberError : contactNumberError,
                birthNumberError : birthNumberError}, () => {return});
        }
        else{
            const modifiedClientData : Client = this.state.fields;

            Api.updateClientData(modifiedClientData).then(response => {
                this.props.setMessage('Údaje byly úšpěšně změněny');
                this.props.setClient(response.data);
            }).catch(error => {
                this.props.setError('Došlo k chybě při změně údajů');
            });

            this.props.handleClose();
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        const {nameError, surnameError, birthNumberError, contactNumberError} = this.state;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Změna údajů</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte nové hodnoty pro libovolné položky dole
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Jméno"
                        type="text"
                        fullWidth
                        value={this.state.fields.name}
                        onChange={this.setName}
                        error={nameError.length > 0}
                        helperText={nameError}
                    />

                    <TextField
                        margin="dense"
                        id="surname"
                        label="Přijmení"
                        type="text"
                        fullWidth
                        value={this.state.fields.surname}
                        onChange={this.setSurname}
                        error={surnameError.length > 0}
                        helperText={surnameError}
                    />

                    <TextField
                        margin="dense"
                        id="contactNumber"
                        label="Kontaktní číslo"
                        type="tel"
                        fullWidth
                        value={this.state.fields.phoneNumber}
                        onChange={this.setContactNumber}
                        error={contactNumberError.length > 0}
                        helperText={contactNumberError}
                    />

                    <TextField
                        margin="dense"
                        id="birthNumber"
                        label="Rodné číslo"
                        type="tel"
                        fullWidth
                        value={this.state.fields.birthNumber}
                        onChange={this.setBirthNumber}
                        error={birthNumberError.length > 0}
                        helperText={birthNumberError}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        this.setState({
                            fields : this.props.client,
                            nameError : '',
                            surnameError : '',
                            contactNumberError : '',
                            birthNumberError : ''}, () => {this.props.handleClose()})}}
                            color="secondary">
                        Zahodit zmény
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Podtvrdit změny
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


}

class AddNewAddressDialog extends React.Component<AddNewAddressDialogProps, AddNewAddressDialogState>{

    state = {
        fields : this.props.address,
        houseNumberError : '',
        streetError : '',
        townError : '',
        postalCodeError : '',
        countryCodeError : ''
    };

    setHouseNumber = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, houseNumber : event.target.value}, houseNumberError : ''});
    };

    setStreet = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, street : event.target.value}, streetError : ''});
    };

    setTown = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, town : event.target.value}, townError : ''});
    };

    setPostalCode = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, postalCode : event.target.value}, postalCodeError : ''});
    };

    setCountryCode = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, countryCode : event.target.value}, countryCodeError : ''});
    };

    validate = () : any => {
        let houseNumberError = '';
        let streetError = '';
        let townError  = '';
        let postalCodeError = '';
        let countryCodeError = '';

        if (this.state.fields.houseNumber.length === 0){
            houseNumberError = 'Číslo popisné nesmí být prázdné';
        }
        else if (isNaN(Number(this.state.fields.houseNumber))){
            houseNumberError = 'Císlo popisné nesmí obsahovat písmena';
        }

        if (this.state.fields.street.length === 0){
            streetError = 'Ulice nesmí být prázdná';
        }

        if (this.state.fields.town.length === 0){
            townError = 'Měst nesmí být prázdné';
        }

        if (this.state.fields.postalCode.length === 0){
            postalCodeError = "PSČ nesmí být prázdné";
        }
        else if (isNaN(Number(this.state.fields.postalCode))){
            postalCodeError = "PSČ nesmí obsahovat písmena";
        }

        if (this.state.fields.countryCode.length === 0){
            countryCodeError = "Kód země nesmí být prázdný";
        }
        else if (this.state.fields.countryCode.length < 2 || this.state.fields.countryCode.length > 3){
            countryCodeError = "Kód země musí obsahovat 2 nebo 3 písmena";
        }
        else if (isNaN(Number(this.state.fields.countryCode))){
            countryCodeError = "Kód země nesmí obsahovat písmena";
        }


        return {
            houseNumberError : houseNumberError,
            streetError : streetError,
            townError : townError,
            postalCodeError : postalCodeError,
            countryCodeError : countryCodeError
        };

    };

    onSubmit = () : void => {
        const errors = this.validate();

        const {houseNumberError, streetError, townError, postalCodeError, countryCodeError} = errors;
        if (houseNumberError.length > 0 || streetError.length > 0 || townError.length > 0 || postalCodeError.length > 0 || countryCodeError.length > 0){
            this.setState({
                houseNumberError : houseNumberError,
                streetError : streetError,
                townError : townError,
                postalCodeError : postalCodeError,
                countryCodeError : countryCodeError
            }, () => {return});
        }
        else{
            const modifiedAddressData : Address = this.state.fields;

            /*Api.then(response => {
                this.props.setMessage('Nová adresa byla úspěšné přidana.');
            }).catch(error => {
                this.props.setError('Při vložení adrese došlo k chybě');
            });*/

            this.props.handleClose();
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        const {houseNumberError, streetError, townError, postalCodeError, countryCodeError} = this.state;

        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Nová adresa</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte údaje pro novou adresu
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="houseNumber"
                        label="Číslo popisné"
                        type="text"
                        fullWidth
                        value={this.state.fields.houseNumber}
                        onChange={this.setHouseNumber}
                        error={houseNumberError.length > 0}
                        helperText={houseNumberError}
                    />

                    <TextField
                        margin="dense"
                        id="street"
                        label="Ulice"
                        type="text"
                        fullWidth
                        value={this.state.fields.street}
                        onChange={this.setStreet}
                        error={streetError.length > 0}
                        helperText={streetError}
                    />

                    <TextField
                        margin="dense"
                        id="town"
                        label="Město"
                        type="text"
                        fullWidth
                        value={this.state.fields.town}
                        onChange={this.setTown}
                        error={townError.length > 0}
                        helperText={townError}
                    />

                    <TextField
                        margin="dense"
                        id="postalCode"
                        label="PSČ"
                        type="tel"
                        fullWidth
                        value={this.state.fields.postalCode}
                        onChange={this.setPostalCode}
                        error={postalCodeError.length > 0}
                        helperText={postalCodeError}
                    />

                    <TextField
                        margin="dense"
                        id="countryCode"
                        label="Kód země"
                        type="text"
                        fullWidth
                        value={this.state.fields.countryCode}
                        onChange={this.setCountryCode}
                        error={countryCodeError.length > 0}
                        helperText={countryCodeError}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        this.setState({
                            fields : this.props.address,
                            houseNumberError : '',
                            streetError : '',
                            townError : '',
                            countryCodeError : '',
                            postalCodeError : ''
                        }, () => {this.props.handleClose()})}}
                            color="secondary">
                        Zahodit zmény
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Vložit adresu
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }


}

class ClientInfo extends React.Component<ClientInfoProps, ClientInfoState>{

    constructor(props: ClientInfoProps, context: any) {
        super(props, context);
        this.state = {loading : true, client: undefined, showChangeDataDialog : false};
    }

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };

    private setClient = (client : Client) : void => {
      this.setState({client : client});
    };

    private setMessage = (message : string) : void => {
        console.error("SETTING MESSAGE: ", message);
        this.setState({message : {message : message, type : "info"}})
    };

    private setError = (message : string) : void => {
        this.setState({message : {message : message, type : "error"}})
    };

    private closeChangeClientDataDialog = () : void => {
        this.setState({showChangeDataDialog : false});
    };

    private openChangeClientDataDialog = () : void => {
        this.setState({showChangeDataDialog : true});
    };

    componentDidMount(): void {
        Api.fetchClientData({clientId : this.props.match.params.clientID}).then( response => {
                this.setState(
                    {
                        loading : false,
                        client : response.data
                    }
                );
            }
        );
    }

    renderButtons() {

        return (
          <div className='buttonBlockClientInfo'>
              <Button variant="contained" color="primary" onClick={this.openChangeClientDataDialog}>
                  Editovat údaje
              </Button>
              <Button variant="contained" color="primary" >
                  Přidat novou adresu
              </Button>
              <Button variant="contained" color="primary" >
                  Otevřit nový účet
              </Button>
              <Button variant="contained" color="primary" >
                  Přidat nový dokument
              </Button>
          </div>
        );

    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        const addressSearchConditions : SearchCondition[] = [];

        const idAddresssearchCondition : SearchCondition = {searchType : SEARCHTYPE.EQUALS, fieldName : "clientId", value1 : this.props.match.params.clientID};

        addressSearchConditions.push(idAddresssearchCondition);

        const accountSearchConditions : SearchCondition[] = [];

        const idAcoountSearchCondition : SearchCondition = {searchType : SEARCHTYPE.EQUALS, fieldName : "clientId", value1 : this.props.match.params.clientID};

        accountSearchConditions.push(idAcoountSearchCondition);

        addressSearchConditions.push(idAddresssearchCondition);

        if (this.state.loading){
            return <CircularProgress />;
        }

        const client : any  = this.state.client;


        return (
            <div className='clientInfo'>
                {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}
                <ClientInfoCard id={client?.id} name={client?.name} surname={client?.surname} birthNumber={client?.birthNumber} phoneNumber={client?.phoneNumber}/>
                {this.renderButtons()}
                <div className='separator'/>
                <RoutableGrid gridName='Addresses' searchConditions={addressSearchConditions}/>
                <div className='separator'/>
                <RoutableGrid gridName='Accounts' searchConditions={accountSearchConditions}/>
                <ChangeClientDataDialog open={this.state.showChangeDataDialog} handleClose={this.closeChangeClientDataDialog} client={client}
                                            setMessage={this.setMessage} setError={this.setError} setClient={this.setClient}
                />
                {/*<AddNewAddressDialog open={this.state.showAddNewAdressDialog} handleClose={this.closeAddNewAddressDialog}
                                     setMessage={this.setMessage} setError={this.setMessage} address={{}}/>*/}
            </div>
        );
    }


}

export default ClientInfo;