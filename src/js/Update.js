
// Update.js

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

// 3.11.20 - take on 5 functions / obsolete hub.

class Update extends React.Component {

    // above buttons : welcom, status
    mainMessage = '';
    // edit errors below buttons
    messages = [];
    messagesOneLine = ''; // put all messages on one line.
    msgOut = []; 
    msgConcatOut = '';
    birthDate = ''  // formatted
    baseUrl = this.props.baseUrl; 
    startCust = this.props.startCust;
    handleUpdateForm = this.props.handleUpdateForm;    
    handleSignOut = this.props.handleSignOut;
    isCustomerSignedIn = this.props.isCustomerSignedIn;
    getMessage = this.props.getMessage;
    getToken = this.props.getToken; 
    externalClass = ""; // formats screen to picture, solid, frame or no effects.
    userColor = ""; // background or frame color
    labelColor = ""; // suitable label color
    headerColor = ""; // suitable header colr
    messageColor = ""; // suitable message color 
    /* when loading call to get style and color value for this screen */ 
    handleLoadScreenStyle = this.props.handleLoadScreenStyle;
    fetchScreenStyleInformation = this.props.fetchScreenStyleInformation;
    refreshProp = this.refreshProp;

    constructor(props) {

        super(props);

        // check for valid login
        var ok = this.isCustomerSignedIn();
        if(!ok) {

            const { history: { push } } = this.props; 
            push('/start');  
        } 

        this.props.statushelper('update');  
        debugger;  

        var cust = {}
        cust = this.props.startCust;
        // add temporary fields to object - password does not have to be keyed and
        // is blank on screen.
        cust.screenPass = '';
        cust.screenPass2 = ''; 
        // 
        var u = new Utility(); 
        u.trimFields(cust);
        //console.log("temp.debug.update showing cust fields looking for plan.")
      //  u.showProperties(cust);  
        // react is wierd if you set up state in the constructor you
        // must do it this way.
        var fromDatabase = this.IsDateFromDatabase(cust.custBirthDate);
        if(fromDatabase.answer === true) {
            cust.custBirthDate = fromDatabase.reformattedDate;
        }
        this.state = {

            cust: cust,
            messages: { messages: [] },
            origionalPassword : cust.custPassword 

        }

        // post claim add messages (adj? pay?)
        // welcom: signin, register. use new mainMessage
        // above buttons, edits stay below buttons.
        var msg = this.getMessage();
        if(msg !== null && msg !== '') {

           this.mainMessage = msg;
           // this.state.messages.messages = msg; 
        } 
       
    } 

    IsDateFromDatabase(date) {
 
        var newDate = '';
        var fromDatabase = false;
        var slash = "/";
        if(date.length > 10) {
            // format  database date to mm/dd/yyyy.
            newDate = date.substring(8,10) + slash + date.substring(5,7) + slash + date.substring(0,4);
            fromDatabase = true;
        }
        else {
            newDate = date; // pass formatted date from register screen.
        }
        return { answer: fromDatabase, reformattedDate: newDate }
    }
  
    showMessage(message) {

        this.messagesOneLine = message;
    }

    handleSubmit = (e) => { 

        e.preventDefault();    
  
        if(this.editFields() === false ) {
            debugger; 
            return;
        }  
        
        debugger;
        var success = this.handleCustomerUpdate(this.state.cust, this.baseUrl); 
        if(success) {
           this.handleUpdateForm(this.state.cust); // update app cust object
           this.props.statushelper('in');

           // stay on screen with success message
           this.showMessage("Successful update of customer information.")
           //const { history: { push } } = this.props; 
           //push('/hub'); 
        } else {
            this.showMessage("Could not update customer");
        }

    }

    handleCustomerUpdate = async (cust, baseUrl) => {

        
        //var u = new Utility(); 
        //console.log("temp.debug.-handle update- showing cust fields looking for plan.")
        //u.showProperties(cust);  
 
        var inputBirthDate = cust.custBirthDate;
        // for database use yyyy-mm-dd
        cust.custBirthDate = this.birthDate;

        // copy screen passowrd field to database staging if keyed.
        // if not the old password is still in custPassword.
        var pass = cust.screenPass; 
        pass = (pass === undefined ) ? '' : pass.trim(); 
        var passwordKeyed = pass.length > 0; 
        if(passwordKeyed) {
           // screenPass,screenPass2 are on the screen for user entry.
           // if not used we just copy the current one.
           cust.custPassword = cust.screenPass.toString().trim(); 
        }

        // clear screen field.
        var clear = "";
        this.screenPass = clear; // not needed ; reload from menu but leave in
        // for future: in casse menu screen removed for documentation.
        this.screenpass2 = clear;
        //

        var database = new Database(); 
        cust["_csrf"] = this.getToken();

        cust.extendColors = "0";
        cust.claimCount = "0";
        cust.PolicyID = "";
        cust.PromotionCode = "";
        
        var response = await database.updateCustomer(cust,baseUrl);

        // after update, 
        // restore date for app cust object held in memory and possible screen display if error. 
        cust.custBirthDate = inputBirthDate;  // back to mmddyyyy.

        
        const success = "200";
        if(response["status"] === success) { 
             
            return true;

        } else
        {
            return false;  
        }

    }

    signOut = (e) => {

        e.preventDefault();
        this.handleSignOut(); 
        const { history: { push } } = this.props; 
        push('/start');

    }


    selectPlan = (e) => {

        e.preventDefault();
        const { history: { push } } = this.props; 
        push('/plan');
        
    }

    fileClaim = (e) => {

        e.preventDefault();
        const { history: { push } } = this.props; 
        push('/claim');

    }

    mainMenu = (e) => {

        e.preventDefault();
        const { history: { push } } = this.props; 
        push('/hub');

    }

    seeHistory = (e) => {

        e.preventDefault();
        const { history: { push } } = this.props; 
        push('/history');

    }


    handleChange = (event) => {
 
        const t = event.target;
        const name = t.name;
        const value = t.value; // on screen 
 

        var u = new Utility();
        var cust = u.replaceProperty(this.state.cust, name, value);
        this.setState({
             
              cust: cust
        }); 
      
        
    }

    editFields = () => {
 

        var msg = [];  
        this.messages = [];
 
        var name1 = "^[a-zA-Z0-9]+$";   // cust id / password  1.more
        var name2 = "^[a-zA-Z0-9.#\\s]+$"; //  names desc imbed blank required
        var addr2 = "^[a-zA-Z0-9.#]* || \\s"; // addr 2 is not req allow space. * o,more
        var phone = "^[0-9]{10}|([0-9]{3})[0-9]{3}-[0-9]{4}$";
        var email =  "^[0-9a-zA-Z]+@[0-9a-zA-Z]+.{1}[0-9a-zA-Z]+$";
 
        var pat1 = new RegExp(name1);  
        var pat2 = new RegExp(name2); 
        var pat2s = new RegExp(addr2)
        var pPhone = new RegExp(phone);
        var pEmail = new RegExp(email); 

        debugger;
        var pass = this.state.cust.screenPass;
        var confirm = this.state.cust.screenPass2;
        pass = (pass === undefined ) ? '' : pass.trim();
        confirm = (confirm === undefined) ? '' : confirm.trim();
        var passwordKeyed = pass.length > 0; 

        // if no password keyed we need to get the prior value from customer.
        // 1. cust in core must be updated before db call. or goes to null.
        // 2. also reset pass, confirm fields before db call to spaces.
        // 3. unlike others state and screen are the same. 
        //    simplest to just show them on screen. only other way is
        //    is to have duplicate customer fields.
        // 4. created screenPass and screenPass2.

        if(passwordKeyed && !pat1.test(pass)) { 
            msg.push('invalid password '); 
        }
        if(passwordKeyed && pass !== confirm) {
            msg.push("confirmation password does not match password.");
        }

        debugger;
        var p = this.state.cust.custPlan;
        if(p === undefined || p === null || p === '' ) {
            msg.push("you must select a plan. Use plan screen first.");
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

        if(!pat2.test(this.state.cust.custGender.trim())) { 
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
            screen: "update",
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
        } 

 
        debugger;

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

        this.msgOut = [];   
        this.messagesOneLine = '    ';
        for(let theMessage of this.messages) {

            let v = <li> {theMessage} </li>;
            this.msgOut.push(v);
            // 
            this.messagesOneLine += ' * ' +  theMessage;
            this.messagesOneLine += ' ';
        }  
 

        debugger; 
        this.setState({

            messages: { messages: this.msgOut }

        });
         

    }

    
 
    render() {      

        /* was loaded in the navArea component when
           navigation changed - here we fetch th
           style values. 
           note: can not update state here with new sytle info
           or the react system will loop. No style state updates here
        */

        debugger;  
        var screenStyle = this.fetchScreenStyleInformation("update");

        // - - - - get class and color information - - - 
        var styleObjectFound = screenStyle === null ? false : true;
        this.messageColor = 'burleywood'; // default was lawngreen.
        this.labelColor = 'dodgerblue';
        this.headerColor = 'burleywood'; 
         if(styleObjectFound) {

            this.externalClass = screenStyle.externalClass;
            this.userColor = screenStyle.userColor;
            this.labelColor = screenStyle.labelColor;
            this.headerColor = screenStyle.headerColor;
            this.messageColor = screenStyle.messageColor;   

         }

       

        var gold = { color: "gold" }
       
        /* labels */
        var st1 = { 

            fontFamily: "Arial",
            fontSize: "larger",
            color: this.labelColor
        } 

        /* buttons */
        var b1st = { 
 
            marginLeft: "30px",
            fontSize:  "larger",
            fontFamily: "Arial" 
        
        }

        var white = {
            color: "white",
            fontSize: "larger"    
        }

        var headerStyle = {

            color: this.headerColor
        }

        var userStyle = {};

        var outlineStyle = { 

            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: this.userColor,
            padding: "10px"
        }

        var solidStyle = {

            backgroundColor: this.userColor,
            transitions: "4s",
            padding: "10px"
        }

        var errorMessagStyle = {

            color: this.messageColor,
            fontSize: "large",
            marginLeft: "370px"
        }


        switch(this.externalClass)
        {

            case 'bg-outline':  
                  userStyle = outlineStyle;
                  break;
            case 'bg-solid':
                  userStyle = solidStyle;
                  break; 
            default:
                  break;
        }

        /* react does not allow burleywood in the style css variables
           workaround here */

         var linkIsStyle = "";
         var linkIsOutline = "bg-outline";
         var header = "";
         var messenger = "";

         debugger;
         if(this.externalClass === linkIsStyle)
         {
              header = <h2 className="welcomeTitle">Update Customer Information</h2> 
              messenger =<div className="wcenter">{this.messagesOneLine}</div>
         }
         else if(this.externalClass === linkIsOutline)
         {
            header =  <h2 className="bw">Update Customer Information</h2> 
            messenger =<div className="bw">{this.messagesOneLine}</div>
         }
         else
         {
              header =  <h2 style={headerStyle}>Update Customer Information</h2> 
              messenger =<div style={errorMessagStyle}>{this.messagesOneLine}</div>
         }


         return (<div ><Container> 

             <div id='styleDiv' className={this.externalClass} style={userStyle}>

             <br></br>
            <Row className="justify-content-md-center">
            {header}
            </Row>
            <br></br>

            <Form onSubmit={this.handleSubmit}>  
            <Row> 
            <Col> 
                <Form.Group> 
                    
                    <Form.Label style={st1}  className='flabel'>First Name</Form.Label>
                    <Form.Control type="text"  value={this.state.cust.custFirst}
                                  onChange={this.handleChange} name="custFirst"/>
                    <Form.Label style={st1}  className='flabel'>Last Nane</Form.Label>
                    <Form.Control type="text" value={this.state.cust.custLast} 
                                  onChange={this.handleChange} name="custLast"/>
                    <Form.Label style={st1} className='flabel'>Middle Name</Form.Label>
                    <Form.Control type="text" value={this.state.cust.custMiddle} 
                                  onChange={this.handleChange} name="custMiddle"/>

                    <Row>
                         <Col xs={6}> 
                            <Form.Label style={st1} className='flabel'>Customer Password</Form.Label>
                                <Form.Control value={this.state.cust.screenPass} 
                                 onChange={this.handleChange} type="password" name="screenPass"/>   
                         </Col>
                         <Col xs={6}> 
                            <Form.Label style={st1} className='flabel'>Confirm Password</Form.Label>
                                <Form.Control value={this.state.cust.screenpass2} 
                                 onChange={this.handleChange} type="password" name="screenPass2"/>   
                         </Col>
                    </Row>    
                  

                    <Row>
                        <Col>
                            <Form.Label style={st1}  className='flabel'>Email</Form.Label>
                            <Form.Control type="text" value={this.state.cust.custEmail} 
                                        onChange={this.handleChange} name="custEmail"/> 
                       </Col>

                       <Col>
                            <Form.Label style={st1} className='flabel'>Phone</Form.Label>
                            <Form.Control type="text" value={this.state.cust.custPhone} 
                                        onChange={this.handleChange} name="custPhone"/>
                        </Col>
                    </Row>

                 
                    
                </Form.Group>
            </Col>

            <Col>  
                <Form.Group>
                    <Form.Label style={st1} className='flabel'>Address Line 1</Form.Label>
                    <Form.Control type="text" value={this.state.cust.custAddr1} 
                     onChange={this.handleChange} name="custAddr1"/>
                    <Form.Label style={st1} className='flabel'>Address Line 2</Form.Label>
                    <Form.Control type="text" value={this.state.cust.custAddr2} 
                    onChange={this.handleChange} name="custAddr2"/> 

                         
                    <Row>
                         <Col>  
                         <Form.Label style={st1}  className='flabel'>City</Form.Label>
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
                        <Form.Label style={st1}  className='flabel'>Zip</Form.Label>
                        <Form.Control value={this.state.cust.custZip} type="text" name="custZip" onChange={this.handleChange}/> 
                       </Col>
                    </Row>

                    <Row> 

                        <Col>
                        <Form.Label style={st1}  className='flabel'>Birth Date</Form.Label>
                        <Form.Control type="text" value={this.state.cust.custBirthDate} 
                        onChange={this.handleChange} name="custBirthDate"/>
                        </Col><Col>
                        <Form.Label style={st1} className='flabel'>Gender</Form.Label>
                        <Form.Control as="select" value={this.state.cust.custGender} 
                                      onChange={this.handleChange} name="custGender">
                               <option>M</option>
                               <option>F</option>
                            </Form.Control>
                        </Col>
                    </Row>

                    
                   <Row>
                        <Col>
                           <Form.Label style={st1}  className='flabel'>Customer Plan:</Form.Label> 
                           <Form.Text style={white}
                            className="fLabel">{this.state.cust.custPlan}</Form.Text>
                        </Col> 
                   </Row>
                  
                </Form.Group>
            </Col>  
            </Row>  
            <Row>
                <p style={gold}>{this.mainMessage}</p>
            </Row>
             
           
            <Row className="justify-content-md-center">
            <Button style={b1st} variant="primary" onClick={this.handleSubmit}>Update Info</Button>  
            <Button style={b1st} variant="primary" onClick={this.mainMenu}>Main Menu</Button>  
            </Row>
            
            <br></br>
            <Row> 
                {messenger}
            </Row>
           
            </Form>

            </div>  

         </Container></div>);


    }


}

export default withRouter(Update);
