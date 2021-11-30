import React from "react";
import Dialog from "@material-ui/core/Dialog";
import {Credit} from "../../../Types";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import MenuItem from "@material-ui/core/MenuItem";
import {Select} from "@material-ui/core";
import Api from "../../../api/Api";

interface CreditDialogProps{
    open : boolean,
    handleClose : any,
    setMessage : any,
    setError : any,
    setCredit : any,
    setKey : any,
    credit : Credit,
}

interface CreditDialogState{
    fields : Credit,
    selectedTimePeriod : string,
    remainderError : string,
    numOfTimePeriodsError : string,
    percentForTimePeriodError : string,
}

class CreditDialog extends React.Component<CreditDialogProps, CreditDialogState>{

    constructor(props : CreditDialogProps, context : any) {
        super(props, context);

        this.state = {
            fields : this.props.credit,
            selectedTimePeriod : this.props.credit.timePeriodInfo,
            remainderError : "",
            numOfTimePeriodsError : "",
            percentForTimePeriodError : "",

        };
        console.log("STATE", this.state.selectedTimePeriod);
    }

    validate = () : any => {
        let remainderError = '';
        let numOfTimePeriodsError = '';
        let percentForTimePeriodError  = '';

        if(isNaN(this.state.fields.remainder)) {
            remainderError = "Zůstatek pro úhradu musí být číslo."
        }else if(this.state.fields.remainder < 0) {
            remainderError = "Zůstatek pro úhradu nesmí byt záporný."
        }

        if(isNaN(this.state.fields.numOfTimePeriods)) {
            numOfTimePeriodsError = "Počet období musí být číslo."
        } else if(this.state.fields.numOfTimePeriods < 0){
            numOfTimePeriodsError = "Počet období nesmí byt záporný."
        }

        if(isNaN(this.state.fields.percentForTimePeriod)) {
            percentForTimePeriodError = "Procento za období musí být číslo."
        } else if(this.state.fields.percentForTimePeriod < 0){
            percentForTimePeriodError = "Procento za období nesmí byt záporné."
        }

        return {
            remainderError : remainderError,
            numOfTimePeriodsError : numOfTimePeriodsError,
            percentForTimePeriodError : percentForTimePeriodError
        }
    };

    onSubmit = () : void => {
        const errors = this.validate();
        const {remainderError, numOfTimePeriodsError, percentForTimePeriodError} = errors;
        if(remainderError.length > 0 || numOfTimePeriodsError.length > 0 || percentForTimePeriodError > 0){
            this.setState({
                remainderError : remainderError,
                numOfTimePeriodsError : numOfTimePeriodsError,
                percentForTimePeriodError : percentForTimePeriodError
            }, () => {this.forceUpdate()});
        } else {
            Api.updateCreditData(this.state.fields).then(response => {
                this.props.setMessage('Adresa byla úspěšně změněna.');
                this.props.setKey();
                this.props.setCredit(response.data);
            }).catch(error => {
                this.props.setError('Došlo k chybě při změně úvěru');
            });
            this.props.handleClose();
        }
    };

    setRemainder = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, remainder : Number(event.target.value)}, remainderError : ''});
    };

    setNumOfTimePeriods = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, numOfTimePeriods : Number(event.target.value)}, numOfTimePeriodsError : ''});
    };

    setPercentForTimePeriod = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        this.setState({fields : {...this.state.fields, percentForTimePeriod : Number(event.target.value)}, percentForTimePeriodError : ''});
    };

    setTimePeriodInfo = (event: React.ChangeEvent<{ value: unknown }>) : void => {
        this.setState({selectedTimePeriod : String(event.target.value)});
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        return(
            <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Editace úvěru</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Zadejte údaje pro editace úvěru
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="remainder"
                        label="Zbyvající částka"
                        type="text"
                        fullWidth
                        value={this.state.fields.remainder}
                        onChange={this.setRemainder}
                        error={this.state.remainderError.length > 0}
                        helperText={this.state.remainderError}
                    />

                 {/*   <TextField
                        autoFocus
                        margin="dense"
                        id="numOfTimePeriods"
                        label="Počet období"
                        type="text"
                        fullWidth
                        value={this.state.fields.numOfTimePeriods}
                        onChange={this.setNumOfTimePeriods}
                        error={this.state.numOfTimePeriodsError.length > 0}
                        helperText={this.state.numOfTimePeriodsError}
                    />

                    <Select
                        labelId="accountType"
                        id="typeInfoType"
                        value={this.state.selectedTimePeriod}
                        onChange={this.setTimePeriodInfo}
                        fullWidth
                    >
                        <MenuItem value={'Týden'}>Týden</MenuItem>
                        <MenuItem value={'Měsíc'}>Měsíc</MenuItem>
                        <MenuItem value={'Rok'}>Rok</MenuItem>
                    </Select>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="procentsPerPeriod"
                        label="Procento za časové období"
                        type="text"
                        fullWidth
                        value={this.state.fields.percentForTimePeriod}
                        onChange={this.setPercentForTimePeriod}
                        error={this.state.percentForTimePeriodError.length > 0}
                        helperText={this.state.percentForTimePeriodError}
                    />*/}

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        this.setState({
                            fields : this.props.credit,
                        }, () => {this.props.handleClose()})}}
                            color="secondary">
                        Zahodit změny
                    </Button>
                    <Button onClick={this.onSubmit} color="primary">
                        Potvrdit změny
                    </Button>
                </DialogActions>

            </Dialog>
        );
    }
}

export default CreditDialog;