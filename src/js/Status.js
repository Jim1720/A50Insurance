
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
        var statusOut = { color: 'gray' }
        var statusIn  = { color: 'goldenrod' } 
        var statusReg = { color: 'orange'}
        var useStyle = (signedIn) ? statusIn : statusOut;   
        var statushelp = this.props.statushelp;

        if(statushelp === 'register') { 
            useStyle = statusReg;
            whatToShow = 'signin in progress...registration activity';
        }
        if(signedIn && statushelp === 'update') {
            whatToShow = sCustId + whatToShow;
        }

        return (

            <Form inline>
            <div style={useStyle} className="status">{whatToShow}</div>
            </Form>

        );



    }

}

export default withRouter(Status);