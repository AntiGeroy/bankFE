import React from 'react';
import './App.css';
import {Grid} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {BrowserRouter, NavLink, Route, Switch} from "react-router-dom";
import RoutableGrid from "./components/routableGrid/RoutableGrid";
import Navbar from "./components/navBar/Navbar";
import {SearchCondition} from "./gridomizer/domain/GridData";
import {SEARCHTYPE} from "./gridomizer/domain/GridConfig";
import ClientInfo from "./components/clientInfo/ClientInfo";
import AddressInfo from "./components/addressInfo/AddressInfo";


function App() {

  const clientSearchConditions : SearchCondition[] = [];

  const searchCondition : SearchCondition = {searchType : SEARCHTYPE.CONTAINS, fieldName : "name", value1 : "V"};

  clientSearchConditions.push(searchCondition);

  return (
        <div>

            <BrowserRouter>
                <Navbar/>
                <Grid container>
                    <Grid item xs={3}>
                        <List>
                            <ListItem>
                                <NavLink to='/klienti'>
                                    <ListItemText primary="Klienti" className='links'/>
                                </NavLink>
                            </ListItem>
                            <ListItem>
                                <NavLink to='/ucty'>
                                    <ListItemText primary="Ǔčty" className='links'/>
                                </NavLink>
                            </ListItem>
                            <ListItem>
                                <NavLink to='/karty'>
                                    <ListItemText primary="Karty" className='links'/>
                                </NavLink>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={9}>
                        <Switch>
                            <Route path={'/klienti'} exact render={() => <RoutableGrid key='clientsGrid' gridName={'Clients'} linkToRoute='clients/'/>}/>
                            <Route path={'/ucty'} exact render={() => <RoutableGrid key='accountGrid' gridName={'Accounts'} linkToRoute='accounts/'/>}/>
                            <Route path={'/karty'} exact render={() => <RoutableGrid key='kartyGrid' gridName={'Cards'} linkToRoute='cards/'/>}/>
                            <Route path={'/klientiSort'} exact render={() => <RoutableGrid key='klientiSortGrid' gridName={'Clients'} searchConditions={clientSearchConditions}/>}/>
                            <Route path={'/clients/:clientID'} component={ClientInfo}/>
                            <Route path={'/addresses/:addressID'} component={AddressInfo}/>
                        </Switch>
                    </Grid>
                </Grid>
            </BrowserRouter>

        </div>
  );
}

export default App;
