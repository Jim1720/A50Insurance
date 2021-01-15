
import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'; 
import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import { withRouter } from 'react-router-dom';

import Database from './Database';

class AdminAction extends React.Component {

   baseUrl = this.props.baseUrl;
   isAdminSignedIn = this.props.isAdminSignedIn;
   getToken = this.props.getToken;

   state = {

        custId: '',      // must match a45 post form
        newCustId: '',   // must match a45 post form
        newCustId2: '', 
        newPassword: '', // must match a45 post form
        newPass2: '',
        message: '' 

   }

   constructor(props) {

        super(props);

        // check for valid login
        var ok = this.isAdminSignedIn();
        if(!ok) {

            const { history: { push } } = this.props; 
            push('/start');  
        }
   }

   postSuccess = () => {

    this.setState({

        custId: '',      // must match a45 post form
        newCustId: '',   // must match a45 post form
        newCustId2: '', 
        newPassword: '', // must match a45 post form
        newPass2: '' 
        // do not reset message it needs to be seen!
    });

     this.custId = '';
     this.newCustId = '';
     this.newCustId2 = '';
     this.newPassword = '';
     this.newPass2 = '';

   }


   handleChange = (event) => {   

        const t = event.target;
        const name = t.name;
        const value = t.value; 
 

        // no ellipsis here ok leave alone. 
        this.setState({    
            [name]: value 
        });  
 
    }

    customerList = (e) => {

       debugger;
       e.preventDefault();
       const { history: { push } } = this.props; 
       push('/admincustomerlist');

    }

  

    resetPassword = async () => {

        debugger;
        var msg = this.editPasswordResetFields();
        if(msg.length > 0) {
            this.setState({message:msg})
            return;
        } 
        debugger;
        var custId = this.state.custId;
        var newPassword = this.state.newPassword;
        // var { custId, newPassword } = this.state;  // edge create-react-app not supported.
        var form = {};
        form.custId = custId;
        form.newPassword = newPassword;
        form['_csrf'] = this.getToken();
        var database = new Database();
        const success = 200;
        var status = await database.resetPassword(form,this.baseUrl); 
        if(status === success) { 
            this.setState({ message: 'password reset success.'}); 
            this.postSuccess(); 
            this.forceUpdate(); 

        } else {
            this.setState({ message: 'error occurred reseting password.'});
            console.log('error status: ' + status.message);
        }

    }

    resetCustomerId = async  () => {

        var msg = this.editCustomerResetFields();
        if(msg.length > 0) {
            this.setState({message:msg})
            return;
        }
        debugger; 
        // var { custId, newCustId } = this.state; edge not supported create-react-app
        var custId = this.state.custId;
        var newCustId = this.state.newCustId;
        var form = {};
        form.custId = custId;
        form.newCustId = newCustId;
        form['_csrf'] = this.getToken();
        var database = new Database();
        const success = 200;
        var status = await database.resetCustomerId(form,this.baseUrl);
        const notFound = 8;
        const duplicateCust = 4;
        debugger;
        if(status === undefined || status === null) 
        {
            this.setState({ message: 'error occurred reseting customer id.'}); 
        }
        else if(status === success) { 

            this.setState({ message: 'customer id reset success.'}); 
            this.postSuccess();

        } else if (status === notFound) { 

            this.setState({ message: 'customer not found.'}); 
            this.postSuccess();

        } else if (status === duplicateCust) {

            this.setState({ message: 'new customer already exists.'}); 
            this.postSuccess(); 

        } else {

            this.setState({ message: 'error occurred reseting customer id.'}); 
        }

    }

    editCustomerResetFields = () => {
        debugger;
        var msg = "";
        var { custId, newCustId, newCustId2 } = this.state;
        if(custId === null || custId === "")
        {
            msg = "enter customer id.";
            return msg;
        }
        if(newCustId == null || newCustId === "")
        {
            msg = "enter new customer id.";
            return msg;
        }
        if(newCustId2 == null || newCustId2 === "")
        {
            msg = "enter confirmation customer id.";
            return msg;
        }
        if(newCustId !== newCustId2)
        {
            msg = "confirm custiomer id does not match new customer id."
            return msg;
        }

        debugger;
        if(custId.trim() === '') {
            msg = "customer id blank";
            return msg;
        }
        if(newCustId.trim() === '') {
            msg = "new customer id blank..";
            return msg;
        }
        if(newCustId2.trim() === '') {
            msg = "confirm customer id blank.";
            return msg;
        }

        return msg;
    }

    editPasswordResetFields = () => {
        debugger;
        var msg = "";
        var { custId, newPassword, newPass2 } = this.state;
        if(custId === null || custId === "")
        {
            msg = "enter customer id.";
            return msg;
        }
        if(newPassword === null || newPassword === "")
        {
            msg = "enter new password.";
            return msg;
        }
        if(newPass2 === null || newPass2 === "")
        {
            msg = "enter confirmation password.";
            return msg;
        }
        if(newPassword !== newPass2)
        {
            msg = "confirm password does not match password."
            return msg;
        }
        return msg;
    }


   render() {

    var st1 = {

        fontFamily: "Arial",
        fontSize: "larger"
    } 
 
 
       var buttonStyle = { align: 'floatLeft',
                           fontFamily: "Arial",
                           fontSize: "larger" }

       return(<div><Container> 

        <br></br>
        <Row className="justify-content-md-center">
        <h2>Administration Actions</h2>
        </Row>
        <br></br>
        <Form>
 
                <Row className="justify-content-md-center"> 
                    
                    <Col xs={3}>
                    <Form.Label sytle={st1} className="flabel">Customer Id</Form.Label>
                    <Form.Control type="text" name="custId" onChange={this.handleChange}/>
                    </Col><Col xs={3}> 
                    <Form.Label sytle={st1} className="flabel">New Customer Id</Form.Label>
                    <Form.Control type="text" name="newCustId" onChange={this.handleChange}/>
                    </Col><Col xs={3}> 
                    <Form.Label sytle={st1} className="flabel">Confirm Id</Form.Label>
                    <Form.Control type="text" name="newCustId2" onChange={this.handleChange}/>
                    </Col>
                    </Row><Row>
                        <br />
                    </Row><Row className="justify-content-md-center">
                    <Button style={buttonStyle} variant="outline-warning" onClick={this.resetCustomerId}>Reset Customer Id</Button>
                    </Row><Row> 
                        <br />
                        <br />
                    </Row><Row className="justify-content-md-center"> 
                    <Col xs={3}> 
                    <Form.Label sytle={st1} className="flabel">New Password</Form.Label>
                    <Form.Control type="password" name="newPassword" onChange={this.handleChange}/> 
                    </Col><Col xs={3}> 
                     <Form.Label sytle={st1} className="flabel">Confirm Password</Form.Label>
                    <Form.Control type="password" name="newPass2" onChange={this.handleChange}/> 
                    </Col> 
                    </Row><Row>
                        <br />
                    </Row><Row className="justify-content-md-center">
                    <Button style={buttonStyle} variant="outline-warning" onClick={this.resetPassword}>Reset Password</Button>
                    </Row><Row> 
                        <br />
                        <br /> 
                    </Row><Row className="justify-content-md-center">  
                    <Button style={buttonStyle} variant="outline-warning" onClick={this.customerList}>List Customers</Button>
                   
                     </Row><Row>
                    <br></br> 
                    <br/>
                    <div className='errorMessage'>{this.state.message}</div>
                    </Row> 

        </Form> 
        </Container>
       </div>); 

   } 
}

export default withRouter(AdminAction)