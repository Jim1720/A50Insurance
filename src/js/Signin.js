
'use-strict'

import React from 'react';

import Form from 'react-bootstrap/Form';
import Row  from 'react-bootstrap/Row'; 
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';


import '../css/formStyle.css';
import { FormGroup } from 'react-bootstrap'; 
import Database from './Database'; 
  
 
class Signin extends React.Component {  

    baseUrl = this.props.baseUrl; 
    handleAdminSignOut = this.props.handleAdminSignOut;
    setMessage = this.props.setMessage;
    setToken = this.props.setToken;

    state = {

        custId: '',
        custPass: '',  // controlled 
        message: 'enter customer id and passowrd to sign in.' 
    }  

    handleSuccess = (cust) => { 

         // customer found and good password match.
         this.props.handleSignIn(cust); 

         // signout Admin if they are signed in - logon protection
         this.handleAdminSignOut();

         var msg = "Successfully signed-in";
         this.setMessage(msg);

         const { history: { push } } = this.props; 
         push('/hub'); 
    }

    handleFail = (msg) => { 

        this.setState({

            message: msg

        });   

        return null;

    }

    handleSignIn = async (e) => {

        // onSubmit on form did not produce valid 'preventDefault' was undefined. try onCLick.
        // FIX USE .handleSubmit.BIND below to bind function was shown after trying
        // e && e.preventDefault on 1st line then compained about mispell on line 2 it was mispelled

        // components get passed 'history', 'path'
 
        e.preventDefault();   

        // set up the API url
        // will initalize on 1st time only.
      //  this.props.setUrlFromEnvironment();

        // this routine checks the database and if not
        // there will check registery.

       // var onDatabase = false; 
        var enteredId = this.state.custId;
        var enteredPass = this.state.custPass;
        var baseUrl = this.props.baseUrl; 

        debugger;
        var database = new Database();
        var response = await database.signinCustomer(enteredId, enteredPass, baseUrl);
        debugger;
        var r = response;
        if(r === null || r === undefined) {
            var message = "Server is down contact administrators.";
            this.handleFail(message);  
            return;
        }
        var info = response['data']; 
        if(info['Status'] === "Unsuccessful") {

            message = info['Message'];
            this.handleFail(message);  
            return;
        }

        debugger;
        // set token 
        var token = info['Token'];
        this.setToken(token);
 
        // succeed 
        var cust = info['Customer'];
        this.handleSuccess(cust);
        return;
           
    }  
 

    handleChange = (event) => {   

        const t = event.target;
        const name = t.name;
        const value = t.value; 
 

        this.setState({    
            [name]: value 
        });  
 
    }

    render() {  

        var b1st = {

            color: "white",  
            margin: "2px",
            fontSize:  "larger",
            fontFamily: "Arial" 
        
        }

        var st1 = {

            fontFamily: "Arial",
            fontSize: "larger"
        }

            return (<div><Container> 
                <br></br>
                
               <Row className="justify-content-md-center">
                <h2  className="welcomeTitle">Customer Sign In</h2>
                </Row>
                <br></br>
                <Form>
                <br></br>
                <Row className="justify-content-md-center">
                <FormGroup>

                    <Form.Label style={st1} className="flabel">Customer ID</Form.Label>
                    <Form.Control type="text" name="custId" onChange={this.handleChange}/>
                    <br/>
                    <Form.Label  style={st1} className="flabel">Customer Password</Form.Label>
                    <Form.Control type="password" name="custPass" onChange={this.handleChange}/> 
                    <br></br>
                    <Button style={b1st} variant="primary" onClick={this.handleSignIn}>Sign In</Button>
                    <br></br> 
                    <br/>
                    <div  className="bwlg">{this.state.message}</div>

                </FormGroup>  
                </Row> 
                 
                </Form>

                </Container></div>
        );
    } 
}

export default withRouter(Signin);