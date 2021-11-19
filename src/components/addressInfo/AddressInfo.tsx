import React from "react";
import Api from "../../api/Api";
import {CircularProgress} from "@material-ui/core";
import MessageBox from "../messageBox/MessageBox";
import Button from "@material-ui/core/Button";
import AddressInfoCard from "../addrressInfoCard/AddressInfoCard";
import RoutableGrid from "../routableGrid/RoutableGrid";
import {SearchCondition} from "../../gridomizer/domain/GridData";
import {SEARCHTYPE} from "../../gridomizer/domain/GridConfig";
import {Address} from "../../Types";

interface AddressInfoProps{
    match : any
}

interface AddressInfoState{
    loading : boolean,
    address : Address | undefined,
    showChangeDataDialog : boolean,
    message? : any
}

class AddressInfo extends React.Component<AddressInfoProps, AddressInfoState>{

    constructor(props: AddressInfoProps, context: any) {
        super(props, context);
        this.state = {loading : true, address: undefined, showChangeDataDialog : false};
    }

    componentDidMount(): void {
        Api.fetchAddressData({addressId : this.props.match.params.addressID}).then( response => {
                this.setState(
                    {
                        loading : false,
                        address : response.data
                    }
                );
            }
        );
    }

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };

    renderButtons() {
        return (
            <div className='buttonBlockClientInfo'>
                <Button variant="contained" color="primary" >
                    Editovat údaje
                </Button>
                <Button variant="contained" color="primary" >
                    СПАСИБО МАМЕ
                </Button>
            </div>
        );
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} |
        Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        const addressClientSearchConditions : SearchCondition[] = [];

        const idAddressSearchClientsCondition : SearchCondition = {searchType : SEARCHTYPE.EQUALS,
            fieldName : "addressId", value1 : this.props.match.params.addressID};

        addressClientSearchConditions.push(idAddressSearchClientsCondition);

        if (this.state.loading){
            return <CircularProgress />;
        }

        const address : any  = this.state.address;

        return (
            <div className='clientInfo'>
                {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type}
                                                  onClose={this.onCloseMessageBox}/> : null}

                <AddressInfoCard addressId={address?.addressId} clientId={address?.clientId}
                                 houseNumber={address?.houseNumber} street={address?.street} town={address?.town}
                                 postalCode={address?.postalCode} countryCode={address?.countryCode}/>

                {this.renderButtons()}
                <div className='separator'/>

                <RoutableGrid gridName='ClientAddresses' searchConditions={addressClientSearchConditions} linkToRoute={'clients/' + this.state.address?.clientId}/>
            </div>
        );
    }
}

export default AddressInfo;