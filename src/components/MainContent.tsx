import React from "react";
import UserContext from "../UserContext";
import {Grid} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {NavLink, Route, Switch} from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import RoutableGrid from "./routableGrid/RoutableGrid";
import ClientInfo from "./clientInfo/ClientInfo";
import AccountInfo from "./accountInfo/AccountInfo";
import AddressInfo from "./addressInfo/AddressInfo";
import LoginForm from "./loginForm/LoginForm";
import {UserData} from "../Types";
import { withCookies, Cookies } from 'react-cookie';
import Logout from "./logout/Logout";
import UsersPage from "./usersPage/UsersPage";
import {SearchCondition} from "../gridomizer/domain/GridData";
import {SEARCHTYPE} from "../gridomizer/domain/GridConfig";
import EmulateUser from "./emulateUser/EmulateUser";
import StopEmulate from "./stopEmulate/stopEmulate";
import UserInfo from "./userInfo/UserInfo";
import StatisticsInfo from "./statistics/StatisticsInfo";
import CreditInfo from "./creditInfo/CreditInfo";
import CardInfo from "./cardInfo/CardInfo";

class BackendRedirect extends React.Component<any, any>{
    componentDidMount(): void {
        window.open('http://localhost:8080/api/dokumenty/' + this.props.match.params.documentId, '_blank');
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        return null;
    }
}

const MainContent = (props : any) => {

    const {cookies} = props;
    const userCookie = cookies?.get('user');

    console.error("USER COOKIES: ", userCookie);

    // @ts-ignore
    let {user, setUser} : {user : UserData} = React.useContext(UserContext);

    if (user == null){
        console.error("CONTEXT USER IS NULL, SETTING USER FROM COOKIE");
        if (userCookie){
            user = userCookie;
            setUser(user);
        }
    }



    if (user == null){
        return <LoginForm/>
    }

    let effectiveUser = {...user};

    if (user.emulate){
        effectiveUser.login = user.emulate.login;
        effectiveUser.clientId = user.emulate.clientId;
        effectiveUser.role = user.emulate.role;
        effectiveUser.id = user.emulate.id
    }

    //let userSearchConditions : SearchCondition[] = [];
    /*userSearchConditions.push({searchType : SEARCHTYPE.EQUALS, fieldName : "role", value1 : "USER"});*/
    /*userSearchConditions.push({searchType : SEARCHTYPE.EQUALS, fieldName : "active", value1 : "1"});*/

    let userSearchConditions : SearchCondition[] = [
        {searchType : SEARCHTYPE.EQUALS, fieldName : "role", value1 : "USER"},
        {searchType : SEARCHTYPE.CONTAINS, fieldName : "active", value1 : "1"}
        ];

    const content = <Grid item xs={9}>
        <Switch>
            <Route path={'/klienti'} exact render={() => <RoutableGrid key='clientsGrid' gridName={'Clients'} linkToRoute='clients/'/>}/>
            <Route path={'/ucty'} exact render={() => <RoutableGrid key='accountGrid' label={"Účty"} gridName={'AccountsWithName'} linkToRoute='ucty/'/>}/>
            <Route path={'/karty'} exact render={() => <RoutableGrid key='kartyGrid' gridName={'Cards'} linkToRoute='cards/'/>}/>
            <Route path={'/uzivatele'} exact component={UsersPage}/>
            <Route path={'/clients/:clientID'} component={ClientInfo}/>
            <Route path={'/ucty/:accountId'} component={AccountInfo}/>
            <Route path={'/api/dokumenty/:documentId'} component={BackendRedirect}/>
            <Route path={'/addresses/:addressID'} component={AddressInfo}/>
            <Route path={'/logout'} exact component={Logout}/>
            <Route path={'/emulate'} exact render={() => <RoutableGrid key='emulateGrid'
                                                                       gridName={'Users'}
                                                                       searchConditions={userSearchConditions}
                                                                       linkToRoute='emulateUser/'
                                                                       label='Zvolte uživatele pro emulaci sezení'/>}
            />
            <Route path={'/emulateUser/:userID'} component={EmulateUser}/>
            <Route path={'/stopEmulate'} component={StopEmulate}/>
            <Route path={'/uzivatel/:userId'} component={UserInfo}/>
            <Route path={'/logovani'} exact render={() => <RoutableGrid key='logyGrid' label={"Logy"} gridName={'Logs'}/>}/>
            <Route path={'/statistiky'} component={StatisticsInfo}/>
            <Route path={'/uvery'} exact render={() => <RoutableGrid key='uveryGrid' gridName={'Credits'} linkToRoute='uvery/'/>}/>
            <Route path={'/cards/:cardID'} component={CardInfo}/>
            <Route path={'/uvery/:creditID'} component={CreditInfo}/>
        </Switch>
    </Grid>;

    const userMenu = <Grid container>
        <Grid item xs={3}>
            <List>
                <ListItem>
                    <NavLink to={'/clients/' + effectiveUser.clientId} >
                        <ListItemText primary="Moje údaje" className='links'/>
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to={'/uzivatel/' + effectiveUser.id} >
                        <ListItemText primary="Moje přihlašovací údaje" className='links'/>
                    </NavLink>
                </ListItem>
            </List>
        </Grid>
        {content}
    </Grid>;

    const adminMenu = <Grid container>
        <Grid item xs={3}>
            <List>
                <ListItem>
                    <NavLink to='/klienti'>
                        <ListItemText primary="Klienti" className='links'/>
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to='/ucty'>
                        <ListItemText primary="Účty" className='links'/>
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to='/karty'>
                        <ListItemText primary="Karty" className='links'/>
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to={'/uzivatele/'}>
                        <ListItemText primary="Uživatelé" className='links'/>
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to={'/logovani/'}>
                        <ListItemText primary="Logy" className='links'/>
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to={'/statistiky/'}>
                        <ListItemText primary="Statistiky" className='links'/>
                    </NavLink>
                </ListItem>
            </List>
        </Grid>
        {content}

    </Grid>;

    const menu = (effectiveUser.role === 'ADMIN') ? adminMenu : userMenu;

    return menu;
};

export default withCookies(MainContent);