import React from "react";
import {CircularProgress} from "@material-ui/core";
import Api from "../../api/Api";
import {Account, Address} from "../../Types";
import './AccountInfo.css';
import AccountInfoCard from "../accountInfoCard/AccountInfoCard";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

interface AddressInfoProps{
    match : any,
}

interface AccountInfoState {
    loading : boolean,
    account : Account | undefined,
}


class AccountInfo extends React.Component<AddressInfoProps, AccountInfoState>{


    constructor(props : any, context : any) {
        super(props, context);
        this.state = {
            account : undefined,
            loading : true
        }
    }


    componentDidMount(): void {
        Api.fetchAccountData({accountId : this.props.match.params.accountId}).then( response => {
                this.setState(
                    {
                        loading : false,
                        account : response.data
                    }
                );
            }
        );
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        if (this.state.loading){
            return <CircularProgress />;
        }

        const account : any  = this.state.account;

        console.error("FETCHED ACCOUNT: ", account);

        return (
            <div className='accountInfo'>


                <div className='separator'/>

                <Button variant='contained' color='primary' component={Link} to={{pathname : '/clients/' + account.clientId}} className='accountInfoLink'>
                    K údajům o majiteli účtu
                </Button>

                <AccountInfoCard accountNumber={account.accountNumber}
                                 stateInfo={account.state}
                                 clientId={account.clientId}
                                 accountId={account.accountId}
                                 remainder={account.remainder}
                                 accountType={account.accountType}
                                 limit={account.limit}
                                 rate={account.rate}
                                 timePeriod={account.timePeriod}/>
            </div>
        );

    }

}

export default AccountInfo;