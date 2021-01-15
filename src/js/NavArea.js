
//  NavArea.js

import React from  'react';  
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';  
import Status from './Status';  
import { withRouter } from 'react-router-dom';
// do not use react router boot strap will need to uninstall it.

class NavArea extends React.Component {
 
    navigate = (destination,e) => {

        // tried using react-router-bootstrap but no success.
        // e is auto passed - note.

        if(destination === '/register')  {

            this.props.handleRegisterStatus();

        }  
        // when not registering change status help = 'update' this,
        // will cause the correct literal to be displayed depending 
        // on signin singout status. 'Status.js'.
        this.props.statushelper('update'); 
 
        const { history: { push } } = this.props; 
        push(destination);  

    };
 

    signout = () => { 
  
        this.props.handleSignOut();   
        const { history: { push } } = this.props; 
        push('/start');

    }

    keep = () => {

       /* <Nav className="mr-auto"  >

        <Button  onClick={this.navigate.bind(this,"/start")}>Start</Button>
        <Button  onClick={this.navigate.bind(this,"/classic")}>Classic</Button> 
        {hubLink}
        {regLink} 
        {outLink}
        {signInLink}
        <Button  onClick={this.navigate.bind(this,"/more")}>More Info</Button> 
        <Button  onClick={this.navigate.bind(this,"/about")}>About</Button>  */

         /*var regLink = (signedIn) ? '' : <Button  onClick={this.navigate.bind(this,"/register")}>Register</Button> ; 
        var outLink = (signedIn) ? <Button  onClick={this.signout}>Sign Out</Button> : '';
        var hubLink = (signedIn) ? <Button  onClick={this.navigate.bind(this,"/hub")}>Menu</Button> : '';
        var signInLink = (signedIn) ? '' : <Button  onClick={this.navigate.bind(this,"/signin")}>Sign In</Button>; 
        */
    
    }
 

    render() {
  
        var signedIn = this.props.signedIn; 
        var first = this.props.first;   
        var last = this.props.last; 
        var custId = this.props.cust.custId;  
        var registered = this.props.registered; 
        var statushelp = this.props.statushelp;

        var brandStyle = { color: 'dodgerblue' };
        var navLinkStyle = { color: 'white'}
        var navLightStyle = { color: 'aqua'}
        var navBarStyle = { backGroundColor: 'black',
            textAalign: 'center' }

        // LinkLight - highlight link based on selection.
        var route = this.props.location.pathname;  
        var registerLinkStyle = (route === "/register") ? navLightStyle : navLinkStyle; 
        var updateLinkStyle   = (route === "/update") ? navLightStyle : navLinkStyle; 
        var startLinkStyle   = (route === "/start") ? navLightStyle : navLinkStyle; 
        var classLinkStyle   = (route === "/classic") ? navLightStyle : navLinkStyle; 
        var mainLinkStyle   = (route === "/hub") ? navLightStyle : navLinkStyle;
        var claimLinkStyle   = (route === "/claim") ? navLightStyle : navLinkStyle;
        var historyLinkStyle   = (route === "/history") ? navLightStyle : navLinkStyle;
        var adminLinkStyle   = (route === "/admin") ? navLightStyle : navLinkStyle;
        var signinLinkStyle   = (route === "/signin") ? navLightStyle : navLinkStyle; 
        var aboutLinkStyle   = (route === "/about") ? navLightStyle : navLinkStyle; 
           
        var mainLink = (!signedIn) ? '' :  <Nav.Link style={mainLinkStyle} href="#" onClick={this.navigate.bind(this,"/hub")}>Menu</Nav.Link> ;
        var regLink = (signedIn) ? '' :  <Nav.Link style={registerLinkStyle} href="#" onClick={this.navigate.bind(this,"/register")}>Register </Nav.Link> ;
        var outLink = (signedIn) ?  <Nav.Link style={navLinkStyle} onClick={this.signout}>Sign Out</Nav.Link> : '';
        var updateLink = (signedIn) ?  <Nav.Link style={updateLinkStyle} href="#" onClick={this.navigate.bind(this,"/update")}>Update </Nav.Link>   : '';
        var signInLink = (signedIn) ? '' : <Nav.Link style={signinLinkStyle} href="#" onClick={this.navigate.bind(this,"/signin")}>Sign In</Nav.Link>; 
        var adminLink =  (signedIn) ? '' : <Nav.Link style={adminLinkStyle} href="#" onClick={this.navigate.bind(this,"/admin")}>Admin</Nav.Link>; 

        var startLink =    (signedIn) ? '' : <Nav.Link style={startLinkStyle} href="#" onClick={this.navigate.bind(this,"/start")}>Start </Nav.Link>  
        var classicLink =  (signedIn) ? '' : <Nav.Link style={classLinkStyle} href="#" onClick={this.navigate.bind(this,"/classic")}>Classic </Nav.Link>
     
        var claimLink =    (!signedIn) ? '' : <Nav.Link style={claimLinkStyle} href="#" onClick={this.navigate.bind(this,"/claim")}>Claim </Nav.Link>  
        var historyLink =  (!signedIn) ? '' : <Nav.Link style={historyLinkStyle} href="#" onClick={this.navigate.bind(this,"/history")}>History </Nav.Link>
        var aboutLink =  (!signedIn) ? '' : <Nav.Link style={aboutLinkStyle} href="#" onClick={this.navigate.bind(this,"/about")}>About </Nav.Link>
 

        return (<div>

            <Navbar style={navBarStyle}>
              <div className='container'>  
                <Navbar.Brand style={brandStyle} href="#home">A50 Insurance</Navbar.Brand>
                {startLink}
                {classicLink} 
                {regLink} 
                {signInLink} 
                {mainLink}
                {updateLink} 
                {claimLink}
                {historyLink}
                {outLink}    
                {adminLink}
                {aboutLink} 
              
                <Status signedIn={signedIn} first={first} last={last} registered={registered}
                        custId={custId}
                        statushelp={statushelp}/>
                </div>
            </Navbar>
        
           

        </div>); 
    }
}

export default withRouter(NavArea);
