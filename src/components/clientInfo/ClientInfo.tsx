import React from "react";
import './ClientInfo.css';
import ClientInfoCard from "../clientInfoCard/ClientInfoCard";
import RoutableGrid from '../routableGrid/RoutableGrid';
import {SearchCondition} from "../../gridomizer/domain/GridData";
import {SEARCHTYPE} from "../../gridomizer/domain/GridConfig";
import {CircularProgress} from "@material-ui/core";
import Api from "../../api/Api";
import Button from "@material-ui/core/Button";
import MessageBox, {MessageBoxProps} from "../messageBox/MessageBox";
import FileDialog from '../dialogs/fileDialog/FileDialog';
import {Client} from "../../Types";
import ClientDataDialog from "../dialogs/clientDataDialog/ClientDataDialog";
import AddressDialog from "../dialogs/addressDialog/AdressDialog";

interface ClientInfoProps{
    match : any
}

interface ClientInfoState {
    loading : boolean,
    client : Client | undefined,
    showChangeDataDialog : boolean,
    showAddNewAdressDialog : boolean,
    showAddNewFileDialog : boolean,
    message? : any
    addressesGridKey : number,
    filesGridKey : number
}

class ClientInfo extends React.Component<ClientInfoProps, ClientInfoState>{

    constructor(props: ClientInfoProps, context: any) {
        super(props, context);
        this.state = {
            loading : true,
            client: undefined,
            showChangeDataDialog : false,
            showAddNewAdressDialog : false,
            addressesGridKey: 1,
            filesGridKey: 1,
            showAddNewFileDialog : false};
    }

    private generateRandomNumber = (min : number, max : number, except : number) =>  {
        let result : number;
        do {
            result = Math.floor(Math.random() * (max - min) + min);
        } while (result === except);
        return result;
    };

    private setAddressGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.addressesGridKey);
        this.setState({addressesGridKey : key});
    };

    private setFileGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.addressesGridKey);
        this.setState({filesGridKey : key});
    };

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

    private closeAddNewFileDialog = () : void => {
        this.setState({showAddNewFileDialog : false});
    };

    private openAddNewFileDialog = () : void => {
        this.setState({showAddNewFileDialog : true});
    };

    private closeChangeClientDataDialog = () : void => {
        this.setState({showChangeDataDialog : false});
    };

    private openChangeClientDataDialog = () : void => {
        this.setState({showChangeDataDialog : true});
    };

    private closeAddNewAddressDialog = () : void => {
        this.setState({showAddNewAdressDialog : false});
    };

    private openAddNewAddressDialog = () : void => {
        this.setState({showAddNewAdressDialog : true});
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
              <Button variant="contained" color="primary" onClick={this.openAddNewAddressDialog}>
                  Přidat novou adresu
              </Button>
              <Button variant="contained" color="primary" >
                  Otevřit nový účet
              </Button>
              <Button variant="contained" color="primary"  onClick={this.openAddNewFileDialog}>
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

        const idAccountSearchCondition : SearchCondition = {searchType : SEARCHTYPE.EQUALS, fieldName : "clientId", value1 : this.props.match.params.clientID};

        accountSearchConditions.push(idAccountSearchCondition);

        addressSearchConditions.push(idAddresssearchCondition);

        const documentSearchConditions : SearchCondition[] = [];

        const clientIdDocumentSearchConditions : SearchCondition = {searchType : SEARCHTYPE.EQUALS, fieldName : "clientId", value1 : this.props.match.params.clientID};


        documentSearchConditions.push(clientIdDocumentSearchConditions);

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
                    <RoutableGrid gridName='Addresses' searchConditions={addressSearchConditions} key={'AGK-' + this.state.addressesGridKey}/>
                    <div className='separator'/>
                    <RoutableGrid gridName='Accounts' searchConditions={accountSearchConditions} linkToRoute={'ucty/'}/>
                    <div className='separator'/>
                    <RoutableGrid gridName='Documents' searchConditions={documentSearchConditions} key={'DGK-' + this.state.filesGridKey}/>

                    <ClientDataDialog open={this.state.showChangeDataDialog} handleClose={this.closeChangeClientDataDialog} client={client}
                                            setMessage={this.setMessage} setError={this.setError} setClient={this.setClient}
                    />
                    <AddressDialog open={this.state.showAddNewAdressDialog} handleClose={this.closeAddNewAddressDialog} setKey={this.setAddressGridKey}
                                     setMessage={this.setMessage} setError={this.setError} address={{clientId: this.props.match.params.clientID}}
                    />

                    <FileDialog open={this.state.showAddNewFileDialog}
                                handleClose={this.closeAddNewFileDialog}
                                setMessage={this.setMessage}
                                setError={this.setError}
                                setKey={this.setFileGridKey} file={{clientId: this.props.match.params.clientID}}/>
            </div>
        );
    }


}

export default ClientInfo;