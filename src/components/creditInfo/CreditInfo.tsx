import React from "react";
import {Credit} from "../../Types";
import {CircularProgress} from "@material-ui/core";
import MessageBox from "../messageBox/MessageBox";
import CreditInfoCard from "../creditInfoCard/CreditInfoCard";
import Api from "../../api/Api";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import CreditDialog from "../dialogs/creditDialog/CreditDialog";

interface CreditInfoProps{
    match : any,

}

interface CreditInfoState{
    loading : boolean,
    message? : any,
    credit? : Credit,
    showChangeCreditInfoDialog : boolean,
    changeCreditDialogKey : number,

}

class CreditInfo extends React.Component<CreditInfoProps, CreditInfoState>{

    constructor(props: CreditInfoProps, context: any) {
        super(props, context);
        this.state = {
            loading : true,
            showChangeCreditInfoDialog : false,
            changeCreditDialogKey : 1,
        }
    }

    private onCloseMessageBox = () : void => {
        this.setState({message : null})
    };

    private setCredit = (credit : Credit) : void => {
        this.setState({credit : credit});
    };

    private setMessage = (message : string) : void => {
        this.setState({message : {message : message, type : "info"}})
    };

    private setError = (message : string) : void => {
        this.setState({message : {message : message, type : "error"}})
    };

    private openChangeCreditInfoDialog = () : void => {
        this.setState({showChangeCreditInfoDialog : true});
    };

    private closeChangeCreditInfoDialog = () : void => {
        this.setState({showChangeCreditInfoDialog : false});
    };

    private setChangeCreditDialogKey = () : void => {
        const key = this.generateRandomNumber(1, 100, this.state.changeCreditDialogKey);
        this.setState({changeCreditDialogKey : key});
    };

    private generateRandomNumber = (min : number, max : number, except : number) =>  {
        let result : number;
        do {
            result = Math.floor(Math.random() * (max - min) + min);
        } while (result === except);
        return result;
    };

    componentDidMount(): void {
        Api.fetchCreditData({creditId : this.props.match.params.creditID}).then(response => {
            this.setState({
                loading : false,
                credit : response.data
            })
        });
    }

    renderButtons(){
        return(
        <div className='buttonBlockClientInfo'>
            <Button variant="contained" color="primary" onClick={this.openChangeCreditInfoDialog}>
                Editovat údaje
            </Button>
        </div>
        );
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        if (this.state.loading){
            return <CircularProgress />;
        }

        const credit : any = this.state.credit;

        return(
            <div className='clientInfo'>
                <div className='separator'/>

                <Button variant='contained' color='primary' component={Link} to={{pathname : '/ucty/' + credit.accountId}} className='accountInfoLink'>
                    K účtu
                </Button>

                {this.state.message ? <MessageBox message={this.state.message.message} type={this.state.message.type} onClose={this.onCloseMessageBox}/> : null}
                <CreditInfoCard creditId={credit?.creditId} accountId={credit?.accountId} issueDate={credit?.issueDate}
                                remainder={credit?.remainder} typeInfo={credit?.typeInfo} timePeriodInfo={credit?.timePeriodInfo}
                                numOfTimePeriods={credit?.numOfTimePeriods} percentForTimePeriod={credit?.percentForTimePeriod}
                />

                {this.renderButtons()}

                <div className='separator'/>

                <CreditDialog open={this.state.showChangeCreditInfoDialog} handleClose={this.closeChangeCreditInfoDialog}
                              setMessage={this.setMessage} setError={this.setError} setCredit={this.setCredit}
                              setKey={this.setChangeCreditDialogKey} credit={credit}
                />

            </div>
        );
    }

}

export default CreditInfo;