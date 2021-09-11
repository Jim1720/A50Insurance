
//  NavArea.js

import React from  'react';  
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';  
import Status from './Status';  
import { withRouter } from 'react-router-dom';  
import ScreenStyleManager from './ScreenStyleManager';
// do not use react router boot strap will need to uninstall it.

class NavArea extends React.Component {  

    /* link style functions */ 
    handleNextStyle = this.props.handleNextStyle;
    handleNextColor = this.props.handleNextColor;  
    fetchScreenStyleInformation =this.props.fetchScreenStyleInformation;
    screenStyleManager = null;

    constructor(props) {
        super(props);
        this.screenStyleManager = new ScreenStyleManager();
    }

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

    // screen style and color click functions 

    onStyle = () => {

      debugger;
      var screenName = window.location.pathname.substring(1);
      this.handleNextStyle(screenName);
    }

    onColor = () => {

        debugger;
        var screenName = window.location.pathname.substring(1); 
        this.handleNextColor(screenName);
    }

   

    /* end of screen style and color functions */ 
  
    render() {
  
        var signedIn = this.props.signedIn; 
        var first = this.props.first;   
        var last = this.props.last; 
        var custId = this.props.cust.custId;  
        var registered = this.props.registered; 
        var statushelp = this.props.statushelp;
 
        var navLinkStyle = { fontSize: "larger", color: 'white'} 
        var navBarStyle = { backGroundColor: 'black',
            textAalign: 'center' } 
        
        // determine route
        var route = this.props.location.pathname;  
        // 
        var currentScreen = route.substring(1);
        var screenStyleObject = this.fetchScreenStyleInformation(currentScreen);
        var styleLinkValue = ""; //To do fix by screen.
        var colorLinkValue = "";
        var showStyleLink = false;
        var showColorLink = false;
        /* todo 
           
            adjust color/style link show/hide switches so
            the do not take up space if not used 
        */
        debugger;
        var haveStyleObject = screenStyleObject != null;
        if(haveStyleObject)
        {
            showStyleLink = true;  
            styleLinkValue = screenStyleObject.internalClass;  
            showColorLink =  styleLinkValue === "Solid" || styleLinkValue === "Outline";
            colorLinkValue = screenStyleObject.userColor;
        } 
        // if no object exists for potential styled screen,
        // show style link.
        var active = this.screenStyleManager.areStylesActive();
        if(active && !haveStyleObject)
        {
             showStyleLink = true;
             styleLinkValue = "Style";
             showColorLink = false; // emphasis.
             colorLinkValue = ""; // todo : make another sw for color link - for no spacing.
        }

        /* brand shows burleywood */
        var brand = <Nav.Link className="bwlg" href="#">A50Insurance</Nav.Link>; 
 
        // react did not accept 'burlwood' in the color attribute of style variable so we use CSS.
        // linksel = fontSize larger color burley wood
        // link = fontSize larger and white 
 

        var registerLinkClass = (route === "/register") ? "linksel" : "link"; 
        var updateLinkClass   = (route === "/update") ? "linksel" : "link"; 
        var startLinkClass  = (route === "/start") ? "linksel" : "link"; 
        var classLinkClass   = (route === "/classic") ? "linksel" : "link"; 
        var mainLinkClass   = (route === "/hub") ? "linksel" : "link";
        var claimLinkClass   = (route === "/claim") ? "linksel" : "link";
        var historyLinkClass   = (route === "/history") ? "linksel" : "link";
        var adminLinkClass   = (route === "/admin") ? "linksel" : "link";
        var signinLinkClass   = (route === "/signin") ? "linksel" : "link"; 
        var aboutLinkClass   = (route === "/about") ? "linksel" : "link"; 
        var outLinkClass = "link";

        var nextStyleStyle = navLinkStyle;
        var nextColorStyle = navLinkStyle;
           
        var mainLink =   (!signedIn) ? '' :  <Nav.Link className={mainLinkClass} href="#" onClick={this.navigate.bind(this,"/hub")}>Menu</Nav.Link> ;
        var regLink =    (signedIn) ? '' :  <Nav.Link className={registerLinkClass} href="#" onClick={this.navigate.bind(this,"/register")}>Register </Nav.Link> ;
        var outLink =    (signedIn) ?  <Nav.Link className={outLinkClass} onClick={this.signout}>Sign Out</Nav.Link> : '';
        var updateLink = (signedIn) ?  <Nav.Link className={updateLinkClass} href="#" onClick={this.navigate.bind(this,"/update")}>Update </Nav.Link>   : '';
        var signInLink = (signedIn) ? '' : <Nav.Link className={signinLinkClass} href="#" onClick={this.navigate.bind(this,"/signin")}>Sign In</Nav.Link>; 
        var adminLink =  (signedIn) ? '' : <Nav.Link className={adminLinkClass} href="#" onClick={this.navigate.bind(this,"/admin")}>Admin</Nav.Link>; 

        var startLink =    (signedIn) ? '' : <Nav.Link className={startLinkClass} href="#" onClick={this.navigate.bind(this,"/start")}>Start </Nav.Link>  
        var classicLink =  (signedIn) ? '' : <Nav.Link className={classLinkClass} href="#" onClick={this.navigate.bind(this,"/classic")}>Classic </Nav.Link>
     
        var claimLink =    (!signedIn) ? '' : <Nav.Link className={claimLinkClass} href="#" onClick={this.navigate.bind(this,"/claim")}>Claim </Nav.Link>  
        var historyLink =  (!signedIn) ? '' : <Nav.Link className={historyLinkClass} href="#" onClick={this.navigate.bind(this,"/history")}>History </Nav.Link>
        var aboutLink =    (!signedIn) ? '' : <Nav.Link className={aboutLinkClass} href="#" onClick={this.navigate.bind(this,"/about")}>About </Nav.Link>
        
        debugger;

        /* shows: Style, Picture, Outline or Solid - for screen style effect */
        /* removed signin requirement since register uses the syle feature */
        // var styleLink = (signedIn && showStyleLink) ? 
     
        var styleLink = (showStyleLink) ?    
            <Nav.Link style={nextStyleStyle} href="#" onClick={this.onStyle}>
                        {styleLinkValue} 
            </Nav.Link> : '';  

        /* shows screen color for Outline or Solid choices */
        // var colorLink = (signedIn && showColorLink) ?  
        var colorLink = (showColorLink) ?  
            <Nav.Link style={nextColorStyle} href="#" onClick={this.onColor}>
                       {colorLinkValue}
            </Nav.Link> : '';

        return (<div>

            <Navbar style={navBarStyle}>
              <div className='container'>   
                {brand}
                {startLink}
                {classicLink} 
                {regLink} 
                {signInLink} 
                {mainLink}
                {updateLink} 
                {claimLink}
                {historyLink}
                {styleLink}
                {colorLink}
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
