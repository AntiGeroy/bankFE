import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {default as MUIGrid} from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";

interface AccountInfoCardProps {
    accountNumber : number,
    stateInfo : string,
    clientId : number,
    accountId : number,
    remainder : number,
    accountType : string,
    limit? : number,
    rate? : number,
    timePeriod? : string

}

const AccountInfoCard = (props : AccountInfoCardProps) => {

    return (
        <Card className='clientCardInfo'>
            <CardHeader title='Údaje o účtě:'/>
            <CardContent>
                <MUIGrid container>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Číslo účtu:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.accountNumber}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Stav účtu:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.stateInfo}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Typ učtu:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.accountType}
                        </Typography>
                    </MUIGrid>

                    <MUIGrid item xs ={2}>
                        <Typography color="textSecondary" gutterBottom>
                            Aktuální zůstatek:
                        </Typography>
                    </MUIGrid>
                    <MUIGrid item xs ={10}>
                        <Typography color="textPrimary" gutterBottom>
                            {props.remainder}
                        </Typography>
                    </MUIGrid>

                    {props.limit ?
                        <React.Fragment>
                            <MUIGrid item xs ={2}>
                                <Typography color="textSecondary" gutterBottom>
                                    Hranice čerpání:
                                </Typography>
                            </MUIGrid>
                            <MUIGrid item xs ={10}>
                                <Typography color="textPrimary" gutterBottom>
                                    {props.limit}
                                </Typography>
                            </MUIGrid>
                        </React.Fragment> : null}

                    {props.rate ?
                        <React.Fragment>
                            <MUIGrid item xs ={2}>
                                <Typography color="textSecondary" gutterBottom>
                                    Úrok:
                                </Typography>
                            </MUIGrid>
                            <MUIGrid item xs ={10}>
                                <Typography color="textPrimary" gutterBottom>
                                    {props.rate}%
                                </Typography>
                            </MUIGrid>
                        </React.Fragment> : null}

                    {props.timePeriod ?
                        <React.Fragment>
                            <MUIGrid item xs ={2}>
                                <Typography color="textSecondary" gutterBottom>
                                    Za časové období:
                                </Typography>
                            </MUIGrid>
                            <MUIGrid item xs ={10}>
                                <Typography color="textPrimary" gutterBottom>
                                    {props.timePeriod}
                                </Typography>
                            </MUIGrid>
                        </React.Fragment> : null}

                </MUIGrid>
            </CardContent>
        </Card>
    );

};

export default AccountInfoCard;