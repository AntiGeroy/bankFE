import React from "react";
import {CircularProgress} from "@material-ui/core";
import Api from "../../api/Api";
import {Account, Address, UserData} from "../../Types";
import './AccountInfo.css';
import AccountInfoCard from "../accountInfoCard/AccountInfoCard";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import UserContext from "../../UserContext";
import MessageBox from "../messageBox/MessageBox";
import TransactionDialog from "../dialogs/transactionDialog/TransactionDialog";
import SimpleDialog from "../dialogs/simpleDialog/SimpleDialog";
import {SearchCondition} from "../../gridomizer/domain/GridData";
import RoutableGrid from "../routableGrid/RoutableGrid";
import {SEARCHTYPE} from "../../gridomizer/domain/GridConfig";

interface AddressInfoProps{
    match : any,
}

interface AccountInfoState {
    loading : boolean,
    account : Account | undefined,
    message? : any,
    transactionsGridKey : number,
    cardsGridKey : number,
    showNewTransactionDialog : boolean,
    showFreezeAccountDialog : boolean,
    showUnfreezeAccountDialog : boolean
}


class AccountInfo extends React.Component<AddressInfoProps, AccountInfoState>{

    static contextType = UserContext;

    constructor(props : any, context : any) {
        super(props, context);
        this.state = {
            account : undefined,
            loading : true,
            transactionsGridKey : 1,
            cardsGridKey : 1,
            showNewTransactionDialog : false,
            showFreezeAccountDialog : false,
            showUnfreezeAccountDialog : false
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

    renderButtons() {

        const {user} : {user : UserData;} = this.context;

        let newCreditButton = null;

        const account : any = this.state.account;

        let effectiveUser = {...user};

        if (user.emulate){
            effectiveUser.login = user.emulate.login;
            effectiveUser.clientId = user.emulate.clientId;
            effectiveUser.role = user.emulate.role;
        }

        if (this.state.account?.accountType === 'U' && effectiveUser.role === 'ADMIN'){
            newCreditButton = <Button variant="contained" color="primary">
                Nový úvěr
            </Button>
        }

        console.error("ACCOUNT: ", account);

        return (
            <div className='buttonBlockClientInfo'>
                {account.state === "Aktivní účet" && effectiveUser.role === "USER"? <Button variant="contained" color="primary" onClick={this.openAddNewTransactionDialog}>
                    Nová transakce
                </Button> : null}

                {account.state === "Aktivní účet" ? <Button variant="contained" color="primary" onClick={this.openFreezeAccountDialog}>
                    Zmrazit účet
                </Button> : <Button variant="contained" color="primary" onClick={this.openUnfreezeAccountDialog}>
                    Rozmrazit účet
                </Button>}

                <Button variant="contained" color="primary">
                    Terminovat účet
                </Button>

                {account.state === "Aktivní účet" && effectiveUser.role === "ADMIN" ? <Button variant="contained" color="primary">
                    Nová karta
                </Button> : null}

                {newCreditButton}
            </div>
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
        let payedCreditsGrid : any = null;

        if (account.accountType === "U") {
            creditsGrid = <RoutableGrid gridName='Credits' label={"Úvěry"} searchConditions={creditsSearchConditions} key={'CGK-' + 1} linkToRoute={'uvery/'}/>;
            payedCreditsGrid = <RoutableGrid gridName='PayedCredits' label={"Zaplacené úvěry"} searchConditions={creditsSearchConditions} key={'PCGK-' + 1}/>;
        }

        return (
            <div className='accountInfo'>

                <div className='separator'/>

                <Button variant='contained' color='primary' component={Link} to={{pathname : '/clients/' + account.clientId}} className='accountInfoLink'>
                    K údajům o majiteli účtu
                </Button>

                {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}

                <AccountInfoCard
                    key={'AIC-' + this.state.transactionsGridKey}
                    accountNumber={account.accountNumber}
                    stateInfo={account.state}
                    clientId={account.clientId}
                    accountId={account.accountId}
                    remainder={account.remainder}
                    accountType={account.accountType}
                    limit={account.limit}
                    rate={account.rate}
                    timePeriod={account.timePeriod}
                />

                {this.renderButtons()}

                <div className='separator'/>
                <RoutableGrid gridName='AccountCards' searchConditions={cardsSearchConditions} key={'ACGK-' + this.state.cardsGridKey} linkToRoute='cards/'/>
                <div className='separator'/>
                {creditsGrid}
                {account.accountType === "U" ? <div className='separator'/> : null}
                {payedCreditsGrid}
                {account.accountType === "U" ? <div className='separator'/> : null}
                <RoutableGrid gridName='Transactions' searchConditions={transactionsSearchConditions} key={'TGK-' + this.state.transactionsGridKey}/>
                <div className='separator'/>
                <TransactionDialog setKey={this.setTransactionsGridKey} open={this.state.showNewTransactionDialog}
                                   setMessage={this.setMessage} setError={this.setError} fromAccountNumber={account.accountNumber}
                                   handleClose={this.closeAddNewTransactionDialog}
                                   setRemainder={this.setRemainder}
                                   remainder={account.remainder}
                />
                <SimpleDialog open={this.state.showFreezeAccountDialog} title={"Zmražení účtu"}
                              prompt={"Opravdu chcete tento účet zmrazit?"} handleOk={this.freezeAccount}
                              handleCancel={this.closeFreezeAccountDialog}
                />
                <SimpleDialog open={this.state.showUnfreezeAccountDialog} title={"Rozmražení účtu"}
                              prompt={"Opravdu chcete tento účet rozmrazit?"} handleOk={this.unfreezeAccount}
                              handleCancel={this.closeUnfreezeAccountDialog}
                />
            </div>
        );

    }

}

export default AccountInfo;