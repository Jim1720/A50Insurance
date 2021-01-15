
import React from 'react';
import Button from 'react-bootstrap/Button'; 

import { withRouter } from 'react-router-dom';

class Planconfirm extends React.Component { 
  
    isCustomerSignedIn = this.props.isCustomerSignedIn; 
    setMessage = this.props.setMessage;

    constructor(props) {

        super(props);

        // check for valid login
        var ok = this.isCustomerSignedIn();
        if(!ok) {

            const { history: { push } } = this.props; 
            push('/start');  
        } 



    }
    
    mainMenu = () => {

        const { history: { push } } = this.props; 
        push('/hub');  
    }

    render() {

        var msg = 'Registered. Update info here.';
        this.setMessage(msg); 
        var divStyle = { marginLeft: "200px"}
        var gold = { color: "gold "}

        return( <div style={divStyle}>

            <h2 style={gold}>Congratulations: plan selection confirmed!</h2>
 

            <p>next:</p>

            <Button variant="outline-warning" onClick={this.mainMenu}>Main Menu</Button> 

        </div>)
   } 

} 

export default withRouter(Planconfirm);