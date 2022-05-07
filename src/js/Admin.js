
import React from 'react';

import Row from 'react-bootstrap/Row'; 
import Container from 'react-bootstrap/Container'; 
import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import { withRouter } from 'react-router-dom';  // was react-router-dom now react-router.
import Database from './Database';  
 
 

class Admin extends React.Component {
    
   handleAdminSignIn = this.props.handleAdminSignIn;
   setToken = this.props.setToken;
   baseUrl = this.props.baseUrl;

   state = {

        AdminId: '',
        AdminPass: '',
        message: ''

   }

   handleChange = (event) => {   

    const t = event.target;
    const name = t.name;
    const value = t.value;  

    this.setState({    
        [name]: value 
    });  
 
}

handleSignIn = async (e) => {

    // onSubmit on form did not produce valid 'preventDefault' was undefined. try onCLick.
    // FIX USE .handleSubmit.BIND below to bind function was shown after trying
    // e && e.preventDefault on 1st line then compained about mispell on line 2 it was mispelled

    // components get passed 'history', 'path'

    e.preventDefault();  

    debugger;
    var database = new Database();
    var response = await database.adminSignin(this.state.AdminId, this.state.AdminPass, this.baseUrl);
    var info = response['data'];

    debugger;  
    if(info['Status'] === "Unsuccessful") {

        var msg = info['Message'];
        this.setState({ message: msg });
        return;
    }
 
    // set token
    var token = info['Token'];
    this.setToken(token);

    // verify signed in.
    this.handleAdminSignIn();
    
    const { history: { push } } = this.props; 
    push('/adminaction'); 

}

handleSuccess = (cust) => { 


    // process admin signin 
    const { history: { push } } = this.props; 
    push('/adminaction'); 
}

   render() {

    var st1 = {

        fontFamily: "Arial",
        fontSize: "larger"
    } 

     var b1st = {

        color: "white",  
        margin: "2px",
        fontSize:  "larger",
        fontFamily: "Arial" 
    
    }

       return(<div><Container> 

        <br></br>
        <Row className="justify-content-md-center">
        <h2>Administration Signin</h2>
        </Row>
        <br></br>
        <Form>

        <br></br>
                <Row className="justify-content-md-center">
                <FormGroup>

                    <Form.Label style={st1} className="flabel">Admin ID</Form.Label>
                    <Form.Control type="text" name="AdminId" onChange={this.handleChange}/>
                    <br/>
                    <Form.Label style={st1} className="flabel">Admin Password</Form.Label>
                    <Form.Control type="password" name="AdminPass" onChange={this.handleChange}/> 
                    <br></br>
                    <Button style={b1st} variant="primary" onClick={this.handleSignIn}>Admin Sign In</Button>
                    <br></br> 
                    <br/>
                    <div className='errorMessage'>{this.state.message}</div>

                </FormGroup>  
                </Row>  
        </Form> 
        </Container>
       </div>); 

   } 
}

export default withRouter(Admin);
