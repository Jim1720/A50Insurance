
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

        var center = { marginLeft: '352px'}

        var a = { marginLeft: '25px'}

        var top = { marginTop: '100px'}

        return( <div><div style={center}>

            <h2 style={top} className='burleywood'>Congratulations: you are registered!</h2>
 

            <p style={white}>Please select a plan. A selection must be made before claims can be filed.</p>

            <br/>

            <Button variant="primary" style={a} onClick={this.getPlan}>Select Plan</Button>
            <Button variant="primary" style={a} onClick={this.mainMenu}>Defer Selection</Button>

            </div></div>)
   } 

}


export default withRouter(Regconfirm);
 