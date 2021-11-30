import React from "react";
import { withCookies, Cookies } from 'react-cookie';
import {Redirect} from "react-router";
import UserContext from "../../UserContext";

class Logout extends React.Component<any, any>{

    static contextType = UserContext;

    componentDidMount(): void {
        const {cookies} = this.props;
        cookies?.remove('user');
        console.error("LOGOUT CONTEXT: ", this.context);
        const {setUser} = this.context;
        console.error("SET USER: ", setUser);
        setUser(null);
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | Iterable<React.ReactNode> | React.ReactPortal | boolean | null | undefined {
        return <Redirect to={'/'}/>
    }

}

export default withCookies(Logout);