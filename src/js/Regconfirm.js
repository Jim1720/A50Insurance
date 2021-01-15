
import React from 'react';
import Button from 'react-bootstrap/Button';
  
import { withRouter } from 'react-router-dom';


class Regconfirm extends React.Component {

    isCustomerSignedIn = this.props.isCustomerSignedIn; 
    setMessage = this.props.setMessage;

    constructor(props) {

        super(props);

        debugger;
        // check for valid login
        var ok = this.isCustomerSignedIn();
        if(!ok) {

            const { history: { push } } = this.props; 
            push('/start');  
        } 
    }

    getPlan = () => {

        const { history: { push } } = this.props; 
        push('/plan');  
    }

    mainMenu = () => {

        var msg = 'Registered. Update info here.';
        this.setMessage(msg); 

        const { history: { push } } = this.props; 
        push('/hub');  
    }

    render() {

        var white = { color: 'white' }

        return( <div>

            <h2 style={white}>Congratulations: you are registered!</h2>

            <h2 style={white}>next:</h2>

            <p style={white}>select a desired plan for coverage</p>

            <Button variant="outline-warning" onClick={this.getPlan}>Select Plan</Button>
            <Button variant="outline-warning" onClick={this.mainMenu}>Defer Selection</Button>

        </div>)
   } 

}


export default withRouter(Regconfirm);
 