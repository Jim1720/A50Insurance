
// Status.js

import React from 'react'; 
import Form from 'react-bootstrap/Form';

import { withRouter } from 'react-router-dom'; 
 
    
class Status extends React.Component {


    render() { 
         
        var first = this.props.first;
        var last = this.props.last;
        var custId = this.props.custId;
        var sCustId = 'Customer: ' + custId + '  ';
        var signedIn = this.props.signedIn;
        var name = first + " " + last + " is signed in";
        var whatToShow = (signedIn) ? name : "signed out"; 
        var statusOut = { color: 'gray', fontSize: "larger" }
        // switch to burleywood color.
        //var statusIn  = { color: 'gold' } 
        //var statusReg = { color: 'orange'}
        //var useStyle = (signedIn) ? statusIn : statusOut;   
        var statushelp = this.props.statushelp;

        if(statushelp === 'register') {  
            whatToShow = 'signin in progress...registration activity';
        }
        if(signedIn && statushelp === 'update') {
            whatToShow = sCustId + whatToShow;
        }

        /* burleywood not available for style varables - workaround here */ 

        var showTimeStatus =  <div >{whatToShow}</div>;

        var isSignedIn = signedIn;
        var isSignedOut = !signedIn;
        var isRegistering = statushelp === 'register';

        if(isRegistering) 
        {  
             showTimeStatus =  <div className="bwlg">{whatToShow}</div>;
        }

        if(isSignedIn)
        {
             showTimeStatus =  <div className="bwlg">{whatToShow}</div>;
        }

        if(isSignedOut)
        {
             showTimeStatus =  <div style={statusOut} >{whatToShow}</div>;
        }

        return (

            <Form inline>
            <div >{showTimeStatus}</div>
            </Form>

        );



    }

}

export default withRouter(Status);