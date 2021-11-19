import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import './Navbar.css';


const Navbar = (props : any) => {

    const [scrolled,setScrolled]=React.useState(false);
    const [searchBarContent, setSearchBarContent] = React.useState('');

    const handleScroll=() => {
        const offset=window.scrollY;
        if(offset > 0 ){
            setScrolled(true);
        }
        else{
            setScrolled(false);
        }   
    };

    const handleInput =  (event: React.ChangeEvent<HTMLInputElement>) : void => {
      const input = event.target.value;
      setSearchBarContent(input);
    };

    const submitInput = () => {
      const value = searchBarContent.trim().toLowerCase();
      setSearchBarContent('');
      props.searchTermHandler(value);
    };



    useEffect(() => {
        window.addEventListener('scroll',handleScroll)
    });

    const navbarClasses=['navbar'];
    if(scrolled){
        navbarClasses.push('scrolled');
    }


    return (
        <div className='navbarWrapper'>
            <header className={navbarClasses.join(' ')}>
                <div className='shopName'>
                    <Link to='/' className='titleLink'>
                        Prohlížeč bankovních údajů
                    </Link>
                </div>
            </header>
        </div>


    )
};

export default Navbar;