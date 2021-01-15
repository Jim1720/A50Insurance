
// Register.js

import React from 'react';
import Form from 'react-bootstrap/Form'; 
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';  

import Button from 'react-bootstrap/Button';
import  { Container } from 'react-bootstrap';  
import { withRouter } from 'react-router-dom'; 

import Database from './Database';
import DateService from './DateService'; 

import Utility from './Utility'; 
 


import '../css/formStyle.css';   

class Register extends React.Component {

     
    // formatted
    birthDate = ''
    baseUrl = this.props.baseUrl;
    saveBirthDate = ''; // save origional keyed date and send via cust to update. 
    token = this.props.token;
    setMessage = this.props.setMessage;
    setToken = this.props.setToken;
    handleSignIn = this.props.handleSignIn;
    
    constructor(props) {

        super(props);
        // do here else inf loop in render!
        this.props.statushelper('register'); 
    } 
 
  
    state = {
 
        cust: {  
            custId: '',
            custPass: '',
            custFirst: '',
            custLast: '',
            Encrypted: '',
            custEmail: '',
            custPhone: '',
            custAddr1: '',
            custAddr2: '',
            custCity: '',
            custState: 'WA', // in case used does not change, default to this value.
            custZip: '',
            signedIn: false,
            registering: false,
            custPlan: '',
            appId: 'A50',
            custPass2: '', 
            custBirthDate: '',
            custGender: 'M',
            custMiddle: '', 
            PolicyID: '',
            PromotionCode: '',
            claimCount: "0",
            extendColors: "0" 
        },
        messages: { messages: [] } 
    } 

    messages = [];
    msgOut = []; 
    msgConcatOut = '';
    useMessages = []; // test local var for holdibng msgs.
   

     handleSubmit = async (e) => {  

        // developer note: this code same as update but 
        // was missing on the FORM tag! wow.
   
        debugger; 
        e.preventDefault();      
    
        if(this.editFields() === false ) { 
            return;
        } 
 

        debugger;
        var isDuplicate =  await this.isitDuplicate(this.state.cust.custId,this.baseUrl);

        if(isDuplicate) {
 
            this.setSpecialMessage("Duplicate use another customer id.");
            this.showMessages();
            return;
        }

        debugger; 
        await this.addCustomerToDatabase(this.state.cust, this.baseUrl); 

       
    }

    setSpecialMessage = (value) => {

        this.messages.push(value);
    }

    editFields  = async () => {

        debugger;

        var msg = [];  
        this.useMessages = [];

        if(this.state.cust.custPass2.trim() === '') {
            msg.push("please enter confirming password.");  
        }

        if(this.state.cust.custPass.trim() !== this.state.cust.custPass2.trim()) {
            msg.push("confirm password does not match password."); 
        } 
 
        var name1 = "^[a-zA-Z0-9]+$";   // cust id / password  1.more
        var name2 = "^[a-zA-Z0-9.#\\s\\_]+$"; //  names desc imbed blank required
        var addr2 = "^[a-zA-Z0-9.#\\_]* || \\s"; // addr 2 is not req allow space. * o,more
        var phone = "^[0-9]{10}|([0-9]{3})[0-9]{3}-[0-9]{4}$";
        var email =  "^[0-9a-zA-Z]+@[0-9a-zA-Z]+.{1}[0-9a-zA-Z]+$";
 
        var pat1 = new RegExp(name1);
        var pat2 = new RegExp(name2); 
        var pat2s  = new RegExp(addr2);
        var pPhone = new RegExp(phone);
        var pEmail = new RegExp(email);

        if(!pat1.test(this.state.cust.custId.trim())) { 
            msg.push('invalid customer id ' + this.state.cust.custId.trim()); 
        }

        if(!pat1.test(this.state.cust.custPass.trim())) { 
            msg.push('invalid password ' + this.state.cust.custPass.trim()); 
        }

        if(!pat2.test(this.state.cust.custFirst.trim())) { 
            msg.push('invalid  first name '); 
        }

        if(!pat2.test(this.state.cust.custLast.trim())) { 
            msg.push('invalid  last name'); 
        }

        if(!pEmail.test(this.state.cust.custEmail.trim())) { 
            msg.push('invalid  email'); 
        }

        if(!pPhone.test(this.state.cust.custPhone.trim())) { 
            msg.push('invalid  phone'); 
        }

        if(!pat2.test(this.state.cust.custAddr1.trim())) { 
            msg.push('invalid address 1'); 
        }

        if(!pat2s.test(this.state.cust.custAddr2.trim())) { 
            msg.push('invalid  address 2'); 
        }

        if(!pat2.test(this.state.cust.custCity.trim())) { 
            msg.push('invalid  city'); 
        }

        if(!pat1.test(this.state.cust.custState.trim())) { 
            msg.push('invalid  state'); 
        }

        if(!pat2.test(this.state.cust.custZip.trim())) { 
            msg.push('invalid  zip'); 
        } 

        if(!pat2s.test(this.state.cust.custGender.trim())) { 
            msg.push('invalid gender'); 
        } 
        var gen = this.state.cust.custGender.trim().toUpperCase();
        if(gen !== "M" && gen !== "F") {
             msg.push('invalid gender');
        }

        if(!pat2s.test(this.state.cust.custMiddle.trim())) { 
            msg.push('invalid  middle name'); 
        }  

         


         var dateParm = {
            screen: "register",
            input: this.state.cust.custBirthDate,
            valid: false,
            message: "",
            formatted: "" 
        }; 

        var dateService = new DateService();
        dateService.editDate(dateParm);

        if(!dateParm.valid) {
            
            msg.push('invalid birth date' );
        }
        else {
         
            this.birthDate = dateParm.formatted;
            this.saveBirthDate = dateParm.formatted; // to update screen
        } 

 
        debugger;
       
        this.messages = [];
        if(msg.length === 0) {
            return true;
        }
        for(let item of msg) {
 
            this.messages.push(item);
        }
 
         

        this.showMessages();

        return false;

    }

    showMessages = () => {
 

        if(this.messages.length === 0) {
            return;
        }

        this.msgOut= []; // clear array
        this.useMessages= []; // clear  
        var count = 0;
        for(let theMessage of this.messages) {

            let s = count;
            let v = <li key={s}> {theMessage} </li>;
            this.msgOut.push(v);
            this.useMessages.push(v);
            count++;
        } 
         

        debugger; 
        this.setState({

            messages: { messages: this.msgOut }

        });
         

    }

    isitDuplicate = async  (custId,baseUrl) => {

        debugger;
        var database = new Database(); 
        var happyReturns = await database.getCustomer(custId,baseUrl);
        debugger; 
        var found = happyReturns["Found"];
        return found;

    }
 

    addCustomerToDatabase = async (cust, baseUrl) => {   

            // format birthdate
            cust.custBirthDate = this.birthDate;  

            var database = new Database(); 
            var response = await database.registerCustomer(cust,baseUrl); 
            var info = response['data'];

            if(info["Status"] === "Unsuccessful") {

                var message = info["Message"];
                this.setSpecialMessage(message); 
                return;
            }  

            // set token
            var token = info['Token'];
            this.setToken(token);  

            // set message
            var msg = "Successfull Registration.";
            this.setMessage(msg); 
    
            // set signed in.
            this.handleSignIn(this.state.cust);   
     
            // modify literal at right to 'signed in'.
            this.props.statushelper('in'); 

            // route to 'register confirm' dialog.
            const { history: { push } } = this.props; 
            push('/regconfirm');  

    }

    
    handleCancel = () => { 
   
        
        this.props.statushelper("signed-out"); 
        const { history: { push } } = this.props; 
        push('/start');  
    }   
    
    handleChange = (event) => {

        const t = event.target;
        const name = t.name;
        let value = t.value; 
 
      
        debugger;
        // why are we doing this?
        // support edge browser that does not like ... spread operator.
        var u = new Utility();
        var newStateCustomer = u.replaceProperty(this.state.cust, name, value);
        this.setState({
             
              cust: newStateCustomer
        });
         

    } 
   

    render() {   
    
         var st1 = {

            fontFamily: "Arial",
            fontSize: "larger"
        } 

         var b1st = {

            color: "white", 
            backgroundColor: "black",
            margin: "2px",
            fontSize:  "larger",
            fontFamily: "Arial" 
        
        }

         return (<div><Container> 

            <br></br>
            <Row className="justify-content-md-center">
            <h2>Customer Registration</h2>
            </Row>
            <br></br>

            <Form onSubmit={this.handleSubmit}> 
            
            <Row>

                <Col xs={3}> 
                    <Form.Label style={st1} className='flabel'>Customer Id</Form.Label>
                    <Form.Control onChange={this.handleChange} value={this.state.cust.custId.trim()} type="text" name="custId"/>   
                </Col>

                <Col xs={3}> 
                    <Form.Label style={st1} className='flabel'>Customer Password</Form.Label>
                    <Form.Control onChange={this.handleChange} value={this.state.cust.custPass.trim()} type="password" name="custPass"/>   
                </Col>

                <Col xs={3}> 
                    <Form.Label style={st1} className='flabel'>Confirm Password</Form.Label>
                    <Form.Control onChange={this.handleChange} value={this.state.cust.custPass2.trim()}  type="password" name="custPass2"/>   
                </Col>

                <Col xs={3}> 
                    <Form.Label style={st1} className='flabel'>Promotion Code:</Form.Label>
                    <Form.Control onChange={this.handleChange} value={this.state.cust.PromotionCode.trim()} type="text" name="PromotionCode"/>   
                </Col>


            </Row>  

            <Row> 
            <Col>   
                <Form.Group> 
                    
                    <Form.Label style={st1} className='flabel'>First Name</Form.Label>
                    <Form.Control type="text"  value={this.state.cust.custFirst}
                                  onChange={this.handleChange} name="custFirst"/>

                    <Form.Label style={st1} className='flabel'>Middle Name</Form.Label>
                    <Form.Control type="text" value={this.state.cust.custMiddle} 
                                  onChange={this.handleChange} name="custMiddle"/>
                  
                    <Form.Label style={st1} className='flabel'>Last Name</Form.Label>
                    <Form.Control type="text" value={this.state.cust.custLast} 
                                  onChange={this.handleChange} name="custLast"/>
                  

                               
                    <Form.Label style={st1} className='flabel'>Address Line 1</Form.Label>
                    <Form.Control type="text" value={this.state.cust.custAddr1} 
                     onChange={this.handleChange} name="custAddr1"/>
                   

                    <Form.Label style={st1} className='flabel'>Address Line 2</Form.Label>
                    <Form.Control type="text" value={this.state.cust.custAddr2} 
                    onChange={this.handleChange} name="custAddr2"/> 


                    <Row>
                        <Col>
                            <Form.Label style={st1} className='flabel'>Email</Form.Label>
                            <Form.Control type="text" value={this.state.cust.custEmail} 
                                        onChange={this.handleChange} name="custEmail"/> 
                       </Col>

                       <Col>
                            <Form.Label style={st1} className='flabel'>Phone</Form.Label>
                            <Form.Control type="text" value={this.state.cust.custPhone} 
                                        placeholder="aaapppdddd"
                                        onChange={this.handleChange} name="custPhone"/>
                        </Col>
                    </Row> 
                    
                </Form.Group>
            </Col>

            <Col>  
                <Form.Group>

                 
                    <Form.Label style={st1} className='flabel'>Birth Date</Form.Label>
                    <Form.Control type="text" value={this.state.cust.custBirthDate} 
                     placeholder="mmddyyyy / mmddyy"
                     onChange={this.handleChange} name="custBirthDate"/>
                   
                   <Form.Label style={st1} className='flabel'>Gender</Form.Label>
                   <Form.Control as="select" value={this.state.cust.custGender} 
                                 onChange={this.handleChange} name="custGender">
                                <option>M</option>
                                <option>F</option>
                   </Form.Control>
              
                    <Row>
                         <Col>  
                         <Form.Label style={st1} className='flabel'>City</Form.Label>
                         <Form.Control value={this.state.cust.custCity}  type="text" name="custCity" onChange={this.handleChange}/> 
                        </Col>
                        
                        <Col>  
                       <Form.Label style={st1} className='flabel'>State</Form.Label>
                        <Form.Control as="select" value={this.state.cust.custState}  name="custState" onChange={this.handleChange}> 
                            <option>WA</option>
                            <option>CA</option>
                        </Form.Control>
                       </Col>

                        <Col>  
                        <Form.Label style={st1} className='flabel'>Zip</Form.Label>
                        <Form.Control value={this.state.cust.custZip} type="text" name="custZip" onChange={this.handleChange}/> 
                       </Col>
                    </Row> 
                    
                </Form.Group>
            </Col>  
            </Row> 
            
             
            
            <br></br> 
            <Row className="justify-content-md-center">
            <Button style={b1st} variant="primary" onClick={this.handleSubmit}>Submit Registration</Button>  
            <Button style={b1st} variant="primary" onClick={this.handleCancel}>Cancel</Button>
            </Row> 
            <br></br>
            <Row> 
                <div className='errorMessage'>{this.useMessages}</div>
            </Row>
            </Form>


         </Container></div>);


    }


}

export default withRouter(Register);
