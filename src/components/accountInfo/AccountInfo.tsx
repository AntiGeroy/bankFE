import React from "react";
import {CircularProgress} from "@material-ui/core";
import Api from "../../api/Api";
import {Account, Address} from "../../Types";
import './AccountInfo.css';
import AccountInfoCard from "../accountInfoCard/AccountInfoCard";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {SearchCondition} from "../../gridomizer/domain/GridData";

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

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };

    private setMessage = (message : string) : void => {
        this.setState({message : {message : message, type : "info"}})
    };

    private setRemainder = (newRemainder : number) : void => {
        const account : any = this.state.account;
        account.remainder = newRemainder;
        this.setState({account : account});
    };

    private setError = (message : string) : void => {
        this.setState({message : {message : message, type : "error"}})
    };

    private generateRandomNumber = (min : number, max : number, except : number) =>  {
        let result : number;
        do {
            result = Math.floor(Math.random() * (max - min) + min);
        } while (result === except);
        return result;
    };

    private setCardsGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.transactionsGridKey);
        this.setState({cardsGridKey : key});
    };

    private setTransactionsGridKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.transactionsGridKey);
        this.setState({transactionsGridKey : key});
    };

    private closeAddNewTransactionDialog = () : void => {
        this.setState({showNewTransactionDialog : false});
    };

    private openAddNewTransactionDialog = () : void => {
        this.setState({showNewTransactionDialog : true});
    };

    private closeFreezeAccountDialog = () : void => {
        this.setState({showFreezeAccountDialog : false});
    };

    private openFreezeAccountDialog = () : void => {
        this.setState({showFreezeAccountDialog : true});
    };

    private closeUnfreezeAccountDialog = () : void => {
        this.setState({showUnfreezeAccountDialog : false});
    };

    private openUnfreezeAccountDialog = () : void => {
        this.setState({showUnfreezeAccountDialog : true});
    };

    private freezeAccount = () : void => {
        const accountToFreeze : any = this.state.account;
        Api.freezeAccount({accountId : accountToFreeze.accountId}).then(response => {
            this.setMessage("Účet byl úspěšně zmražen");
            accountToFreeze.state = "Dočasně zmražený účet";
            console.error("ACCOUNT: ", accountToFreeze);
            this.setState({account : accountToFreeze});
        }).catch(error => {
            this.setError("Při zmražení účtu došlo k chybě");
        });

        this.setCardsGridKey();
        this.setState({showFreezeAccountDialog : false});
    };

    private unfreezeAccount = () : void => {
        const accountToUnfreeze : any = this.state.account;
        Api.unfreezeAccount({accountId : accountToUnfreeze.accountId}).then(response => {
            this.setMessage("Účet byl úspěšně rozmražen");
            accountToUnfreeze.state = "Aktivní účet";
            console.error("ACCOUNT: ", accountToUnfreeze);
            this.setState({account : accountToUnfreeze});
        }).catch(error => {
            this.setError("Při zmražení účtu došlo k chybě");
        });

        this.setCardsGridKey();
        this.setState({showUnfreezeAccountDialog : false});
    };

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

        const cardsSearchConditions : SearchCondition[] = [];

        const idAccountSearchCondition : SearchCondition = {searchType : SEARCHTYPE.EQUALS,
            fieldName : "accountId", value1 : this.props.match.params.accountId};

        cardsSearchConditions.push(idAccountSearchCondition);

        const transactionsSearchConditions : SearchCondition[] = [];
        transactionsSearchConditions.push(idAccountSearchCondition);

        const creditsSearchConditions : SearchCondition[] = [];
        creditsSearchConditions.push(idAccountSearchCondition);

        let creditsGrid : any = null;

        if (account.accountType === "U") {
            creditsGrid = <RoutableGrid gridName='Credits' searchConditions={creditsSearchConditions} key={'CGK-' + 1} linkToRoute={'uvery/'}/>;
        }
>>>>>>> Stashed changes

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