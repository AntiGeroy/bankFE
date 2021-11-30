import React from "react";
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import {default as MUIGrid} from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography";

interface UserInfoCardProps {
    role : string,
    login : string,
    createdBy : string | null | undefined,
    clientName : string | null | undefined,
    key : string
}

class UserInfoCard extends React.Component<UserInfoCardProps, any>{

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {

        return (
            <Card className='clientCardInfo' key={this.props.key}>
                <CardHeader title='Údaje o uživatelovi:'/>
                <CardContent>
                    <MUIGrid container>

                        <MUIGrid item xs ={2}>
                            <Typography color="textSecondary" gutterBottom>
                                Role:
                            </Typography>
                        </MUIGrid>
                        <MUIGrid item xs ={10}>
                            <Typography color="textPrimary" gutterBottom>
                                {this.props.role}
                            </Typography>
                        </MUIGrid>

                        {this.props.clientName ?
                            <React.Fragment>
                                <MUIGrid item xs ={2}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Pro klienta:
                                    </Typography>
                                </MUIGrid>
                                <MUIGrid item xs ={10}>
                                    <Typography color="textPrimary" gutterBottom>
                                        {this.props.clientName}
                                    </Typography>
                                </MUIGrid>
                            </React.Fragment> : null}

                        <MUIGrid item xs ={2}>
                            <Typography color="textSecondary" gutterBottom>
                                Login:
                            </Typography>
                        </MUIGrid>
                        <MUIGrid item xs ={10}>
                            <Typography color="textPrimary" gutterBottom>
                                {this.props.login}
                            </Typography>
                        </MUIGrid>

                        <MUIGrid item xs ={2}>
                            <Typography color="textSecondary" gutterBottom>
                                Vytvořen uživatelem:
                            </Typography>
                        </MUIGrid>
                        <MUIGrid item xs ={10}>
                            <Typography color="textPrimary" gutterBottom>
                                {this.props.createdBy ? this.props.createdBy : "Kořenový uživatel"}
                            </Typography>
                        </MUIGrid>

                    </MUIGrid>
                </CardContent>
            </Card>
        );
    }
};

export default UserInfoCard;