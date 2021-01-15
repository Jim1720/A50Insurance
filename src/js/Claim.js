
// Claim.js 

import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'; 
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button'; 
import Database from './Database';  
import DateService from './DateService';

import welcomePic from '../images/lake.jpg';
import '../css/style.css'; 
import { ListGroup } from 'react-bootstrap';   
import { withRouter } from 'react-router-dom';  

import Utility from './Utility';

class Claim extends React.Component {

    baseUrl = this.props.baseUrl;

    defaultDate = '1753-01-01';
    defaultClaimType = 'm';
    claimFieldColor = "Black"; // turn blue on adjustments.
    isCustomerSignedIn = this.props.isCustomerSignedIn;
    setMessage = this.props.setMessage; 
    getToken = this.props.getToken;

    // services
    typeServices = []; // services for claim type
    allServices = []; // entire list of services all types.
    plans = []; // plan list 
    totalCharge = 0; 
    balanceOwed = 0;
    coveredAmount= 0;

    // custId - add to claim
    custId = this.props.custId;
    // custPlan - add to claim / calc covered amount also.
    custPlan = this.props.custPlan;
  
    state = {

        messages: { messages: [] }, 
        claim: {

            ClaimIdNumber: '',
            CustomerId: '',
            ClaimType: this.defaultClaimType,
            PlanId: '', // missing on screen
            ClaimDescription: '', // missing on screen
            PatientFirst: '',
            PatientLast: '',
            Physician: '',
            Clinic: '', 
            Procedure1: '',
            Procedure2: '',
            Diagnosis1: '',
            Diagnosis2: '',  
            DateService: '',   
            TotalCharge: '0.0', // missing on screen
            BalanceOwed: '0.0',
            Service: '',  // from dropdown.
            Insured: '', // uos
            Primary: '',// uos
            Secondary: '', // uos - unused but on screen 
            DateAdded: '',
            AdjustedDate: this.defaultDate,
            ClaimStatus: 'Entered',
            Referral: '',
            PaymentAction: '',
            PaymentPlan: '',
            PaymentAmount: '0.0',
            PaymentDate: this.defaultDate,
            DateConfine: '',  // show blank on screen put default date in before update database.
            DateRelease: '',
            ToothNumber: '',
            DrugName: '',
            Eyeware: '',
            AdjustedClaimId: '',
            AdjustingClaimId: '',
            AppAdjusting: "" // only shows on claim being adjusted not on new or adjustment claim.

        }


    };

    // formatted date
    DateService = ''; 
    DateConfine = '';
    DateRelease = '';
    typeFields = <h3>Select claim type.</h3>
    messages = [];
    msgOut = []; 
    msgConcatOut = '';  
    claimToAdjust = '';
    creatingAdjustmentClaim = false;

    constructor(props) {
         
        super(props);  

         // check for valid login
         var ok = this.isCustomerSignedIn();
         if(!ok) {
 
             const { history: { push } } = this.props; 
             push('/start');  
         } 
    
      var closureThis = this;
      this.loadAllServices(this.baseUrl, closureThis);
 
      
    }

     loadAllServices = async (baseUrl, closureThis) => {
 
        var database = new Database();
        const success = 200;
        var resp = await database.getServices(baseUrl); 
        debugger;
        if(resp.status === success) {

            debugger;
            closureThis.allServices = resp.data; 
            debugger;
            // set service drop down data to medical default claim values.
            this.setDefaultType(closureThis); // dropdown for medical claim.
            debugger;
            // load adjustement fields if required
            this.claimToAdjust = this.props.claimToAdjust;
            debugger;
            this.creatingAdjustmentClaim = (this.claimToAdjust !== null &&
                              this.claimToAdjust !== undefined); 
            if(this.creatingAdjustmentClaim === true) { 
                this.setupAdjustment(closureThis);

            }
           
        } else
        {
            console.log('Plan.js get plans failed' + resp.status); 
        } 

    }

    setupAdjustment = (closureThis) => {


       

        // direct assignment of state allowed in
        // constructor only...
        debugger;

        // component, 
        // not yet mounted must assign directly to state.
        //
        var claim = {}
        claim = closureThis.claimToAdjust
        //this.state.claim = this.claimToAdjust;
        // trim spaces
        var u = new Utility();
        u.trimFields(closureThis.state.claim);

        // format date of service
        claim.DateService = 
            this.formatDateOnScreen(closureThis.claimToAdjust.DateService);
     
        if(this.claimToAdjust.ClaimType === "m") {

                debugger;
                //var defaultDate = "default"; 

                // this.state.claim.DateConfine = "";
                claim.DateConfine = "";
                var result  = this.formatDateOnScreen(closureThis.claimToAdjust.DateConfine);
                //if(result !== defaultDate) 
                //{
                    //this.state.claim.DateConfine = result;
                    claim.DateConfine = result;
                //}  
                
                // this.state.claim.DateRelease = "";
                result = this.formatDateOnScreen(closureThis.claimToAdjust.DateRelease);
                //if(result !== defaultDate) 
                //{
                    //  this.state.claim.DateRelease = result;
                    claim.DateRelease = result;
                //}  

            }
            var messages = { messages:  "Enter adjustment for claim: " + 
                                            this.claimToAdjust.ClaimIdNumber  } 

            // turn fields blue on adjustment
            closureThis.claimFieldColor = "Blue";

            // this.state.message =  messages;

            
            closureThis.setState({

                    claim: claim,
                    message: messages

            }); 
    }

    formatDateOnScreen = (databaseDate) => {
        // change yyyy-mm-dd to
        // mmddyyyy 
        // note when entered submitted to db
        // as mm/dd/yyyy.
        debugger
        var mm = databaseDate.substring(5,7);
        var dd = databaseDate.substring(8,10);
        var yyyy = databaseDate.substring(0,4); 
        if(yyyy === '1753' || yyyy === '1900') {

            return '';
        }
        var yy = databaseDate.substring(0,2);
        var screenDate = mm + dd + yy;
        return screenDate;
    }
  

    handleChange = (event) => {

        const t = event.target;
        const name = t.name;
        let value = t.value; 
        console.log('on change ' + name + ' = ' + value);

        var u = new Utility();
        var newStateClaim = u.replaceProperty(this.state.claim, name, value);
        this.setState({
             
              claim: newStateClaim
        }); 
         
    } 
     

    editClaim = () => {

        var msg = [];  
        this.messages = []; 
 
        var name1 = "^[a-zA-Z0-9]+$";   // cust id / password  1.more
        var name2 = "^[a-zA-Z0-9.#\\s]+$"; //  names desc imbed blank required
        var addr2 = "^[a-zA-Z0-9.#]* || \\s"; // addr 2 is not req allow space. * o,more  
 
        var pat1 = new RegExp(name1);
        var pat2 = new RegExp(name2); 
        var pat2s = new RegExp(addr2); 

        if(!pat2.test(this.state.claim.PatientFirst.trim())) { 
            msg.push('invalid patient first ' + this.state.claim.PatientFirst.trim()); 
        }

        if(!pat2.test(this.state.claim.PatientLast.trim())) { 
            msg.push('invalid patient last ' + this.state.claim.PatientLast.trim()); 
        }
        if(!pat2.test(this.state.claim.Physician.trim())) { 
            msg.push('invalid physician ' + this.state.claim.Physician.trim()); 
        }

        if(!pat2.test(this.state.claim.Clinic.trim())) { 
            msg.push('invalid clinic ' + this.state.claim.Clinic.trim()); 
        }

        if(!pat1.test(this.state.claim.Procedure1.trim())) { 
            msg.push('invalid procedure ' + this.state.claim.Procedure1.trim()); 
        }

        if(!pat1.test(this.state.claim.Diagnosis1.trim())) { 
            msg.push('invalid diagnosis ' + this.state.claim.Diagnosis1.trim()); 
        }

        if(!pat2s.test(this.state.claim.ClaimDescription.trim())) { 
            msg.push('invalid state ' + this.state.claim.ClaimDescription.trim()); 
        }

        debugger;
        var s = this.state.claim.Service;
        if(s === null || s === undefined || s === '') {
            msg.push('Please select a Service.');
        }

       
         var dateParm = {
            screen: "claim",
            input: this.state.claim.DateService,
            valid: false,
            message: "",
            formatted: "" 
        }; 

        var dateService = new DateService();
        dateService.editDate(dateParm);

        if(!dateParm.valid) {
            
            msg.push('invalid service date' );
        }
        else {
         
            this.DateService = dateParm.formatted;
        } 



         // 1.8 type edit section
         debugger;
         var claimType = this.state.claim.ClaimType;
         if(claimType === "m") {
            //dateParm.input = this.state.claim.DateConfine
            // allow blanks to default if not used.
            debugger;
            dateParm.input = this.state.claim.DateConfine;
            if(dateParm.input.length > 0) { 

                   
                   dateService.editDate(dateParm);

                   if(!dateParm.valid) { 
                       msg.push('invalid confine date' ); 
                   }
                   else { 
                       this.DateConfine = dateParm.formatted;
                   } 

             }
             else {

                 this.DateConfine = this.defaultDate;
             }
             //dateParm.input = this.state.claim.DateRelease
             // allow blanks to default if not used.

             dateParm.input = this.state.claim.DateRelease;
            if(dateParm.input.length > 0) { 

                 dateService.editDate(dateParm);

                 if(!dateParm.valid) { 
                     msg.push('invalid release date' ); 
                 }
                 else { 
                     this.DateRelease = dateParm.formatted;
                 } 

              }
              else {
                 
                this.DateRelease = this.defaultDate;
             }
         }

         if(claimType === "d") {
              
             if(Number.parseInt(this.state.claim.ToothNumber) === "NaN")
                
                msg.push("Invalid tooth number.");

         }
         if(claimType === "v") {
            
                if(!pat2.test(this.state.claim.Eyeware)) {
                    msg.push("Eyeware invalid : should be alphanumeric.")
                }
              
         }
         if(claimType === "x")  {

            if(!pat2.test(this.state.claim.DrugName)) {
                msg.push("Drug Name invalid : should be alphanumeric.")
            }
         }

         // end type edits
 
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
 

    getCurrentDate = () => {

        var d = new Date();
        var today = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();  
        return today;
    }

    getDefaultDate = () => {

        return this.defaultDate;
    }

    // check spelling here.
    fileClaim = async (e) => {

        e.preventDefault(); 
        // probably for app.registery... do not need... legacy -- pre.db.
        //this.props.fileClaim(this.state.claim); 

        var goodEdit = this.editClaim();
        if ( goodEdit === false ) {
            return;
        }  

        var claimId = this.getClaimId();
        if(this.creatingAdjustmentClaim === true
            &&
             claimId === this.claimToAdjust.ClaimIdNumber) {
                 // minutes in key - insure unique claim number.
            alert("Try 1 minute later so claim number will unique - thank you.");
            return;
        }
 

        // state.claim containes the new claim shown on 
        // screen keep that in case edits fail and screen must be 
        // updated again 
        // copy state claim to distinct object addClaim to add.
        debugger;
        var u = new Utility();
        var addClaim = u.makeDistinctNewObject(this.state.claim);
        // put formatted dates in for the database. 
        debugger;
        addClaim.DateService = this.DateService;
        addClaim.DateConfine = this.DateConfine;
        addClaim.DateRelease = this.DateRelease; 
        // get new claim id number
        addClaim.ClaimIdNumber = claimId;
        // date added
        addClaim.DateAdded = this.getCurrentDate();   
        // set up fields if this is and adjustment
        if(this.creatingAdjustmentClaim === true) {

            addClaim.ClaimStatus = "Adjustment";
            addClaim.AdjustedClaimId =  this.claimToAdjust.ClaimIdNumber
        }
        // copy current customer plan to claim.
        addClaim.PlanId = this.custPlan;

        // calculate covered charges and balance.
        addClaim.TotalCharge = await  this.calculateTotalCharge(addClaim.PlanId, addClaim.Service);
         
        addClaim.TotalCharge = this.totalCharge;
        addClaim.BalanceOwed = this.balanceOwed;
        addClaim.CoveredAmount = this.coveredAmount;

        // add token 
        addClaim["_csrf"] = this.getToken();
        // add thie claim
        debugger; 
        // add claim and wait before stamping, adj claim if needed.
        var Adj = this.creatingAdjustmentClaim;
        var ok = await this.addClaimToDatabase(addClaim); 
        if(Adj && ok && this.creatingAdjustmentClaim === true) {

             var claim = this.claimToAdjust.ClaimIdNumber;
             var adjustment = addClaim.ClaimIdNumber;
             await this.processAdjustment(claim, adjustment);  // done , dont came back here.
           
        } 
        // if adj should not get back here.
        if(Adj) { return; } // messages below are for claim add only not adj. 

        if(ok) {

            var a = addClaim.ClaimIdNumber;
            var message = `Claim ${a} added successfully.`;
            this.setMessage(message); 
            const { history: { push } } = this.props; 
            push('/hub');  
            return; 

        } else {

             // stamp result is a status code if not "OK".
             this.setState({ 
                messages: { messages: "error - could not add claim: "}
            });
            const { history: { push } } = this.props; 
            push('/hub');  
            return;

        }
      
    }
 

    calculateTotalCharge  =  async (iPlan, iService) => {

        debugger;

        var row = '';
        var cost = 0.0;
        var service = '';
        // get service cost
        for(var i = 0; i < this.typeServices.length; i++) {
            row = this.typeServices[i]; 
            service = row['ServiceName'].toString().trim();
            if(iService.trim() === service) { 
               cost = parseFloat( row['Cost'] );
            }
        }
       
        // get plan covered percent
        var closureThis = this;
        var plan = '';
        await this.getPlans(this.baseUrl, closureThis); 
        //
        var percent = 0.0;
        for(i = 0; i < this.plans.length; i++) {
            row = this.plans[i]; 
            plan = row['PlanName'].toString().trim();
            if(iPlan.trim() === plan) { 
               percent = parseFloat( row['Percent'] );
            }
        } 
        // calculate total covered amount and balance owed.
        this.coveredAmount = (cost * percent) / 100;
        this.totalCharge = cost;
        this.balanceOwed = this.totalCharge - this.coveredAmount;
        
    }

    


    getPlans = async (baseUrl, closureThis) => {

        var database = new Database();
        const success = 200;
        var resp = await database.getPlans(baseUrl);
        if(resp.status === success) {

            closureThis.plans = resp.data; 

        } else
        {
            console.log('Plan.js get plans failed' + resp.status); 
        }


    }

    processAdjustment = async (claim, adjustment) => { 
  
        // stamp adjusted claim
       debugger; 
       var stampResult = await  this.stampAdjustedClaim(
                          claim,
                          adjustment) 
       debugger;
       if(stampResult === "OK") { 

             // show message on update screen
             var a = claim.toString();
             var b =  adjustment.toString();
             var message = `Claim ${a} adjusted by ${b}`;
             this.setMessage(message); 
             const { history: { push } } = this.props; 
             push('/hub');  
             return; 

       } else {
             // stamp result is a status code if not "OK".
             this.setState({ 
                 messages: { messages: "error - could not stamp claim: " + stampResult} 
             });
             const { history: { push } } = this.props; 
             push('/hub');  
             return;
         }   
}



    stampAdjustedClaim = async (adjustedId, adjustmentId) => {

        debugger;
        // call server to stamp adjusted claim.
        var body = {};
        body.AdjustmentIdNumber = adjustmentId; 
        // this claim gets stampped. 
        body.ClaimIdNumber = adjustedId;  
        body.AdjustedDate = this.getCurrentDate();
        body.AppAdjusting = "A50";

        // add token
        body['_csrf'] = this.getToken();

        var a = adjustedId.toString();
        var b = adjustmentId.toString();

        var message = `Claim ${a} adjusted by ${b}`;
        this.setMessage(message); 

        // put /stampAdjustedClaim 
        var db = new Database();
        // info data,res = OK,200; or null;500 comes back for good,bad results.
       var result =  await db.stampClaim(body,this.baseUrl); 
       debugger;
       var info = result["data"];
       return info; 
    }

    setDefaultType = async (closureThis) => {
 
        debugger; 
        // service-type, claim-type, closure.
        await this.changeServiceList("Medical", "m", closureThis);

    }

    changeType = async (e) => {
 
        e.preventDefault();
        const t = e.target; 
        let newType = t.id;

        if(newType === undefined)
        {
            alert("changeType: newType is undefined.");
            return;
        }   
 
        // change medical to m etc.
        var shortType = '';
        var serviceType = ''; // match csv values.
        switch(newType) {
            case "medical":
                shortType = "m";
                serviceType = "Medical";
                break;
            case "dental":
                shortType = "d";
                serviceType = "Dental";
                break;
            case "vision":
                shortType = "v";
                serviceType = "Vision";
                break;
            case "drug":
                shortType = "x";
                serviceType = "Drug";
                break;
            default:
                shortType = "m";
                serviceType = "Medical";
        } 
        
      
 
         var closureThis = this;
         await this.changeServiceList(serviceType, shortType, closureThis);
         
       
    }

    changeServiceList = async (serviceType, shortType,  closureThis) => {

        var firstMatch = true;; // load first match service name 
        var firstService = '';
        // to state.claim.Service so if user does not change sevice box
        // the first listed will be used.
        debugger;
        closureThis.typeServices = []; // clear
        var outIndex = 0;
        for(var i = 0; i < closureThis.allServices.length; i++) {
            var row = closureThis.allServices[i];
            var type = row['ClaimType'].toString();
            if(type === shortType) {
                 closureThis.typeServices[outIndex] =   closureThis.allServices[i]; 
                 // save 1st service value in state.claim.Service.
                 if(firstMatch === true) { 
                     firstMatch = false;
                     firstService = row['ServiceName'].toString();
                 }
                 outIndex++;
            }
        }
        console.log('claim typeServices are: ' + closureThis.typeServices);
        this.emptyTypeFields(shortType, closureThis, firstService);
      

    }

    emptyTypeFields = (shortType, closureThis, firstService) => {

        console.log('-- empty type fields.');

        var nClaim = this.state.claim;
        nClaim.ClaimType = shortType;
        nClaim.ConfineDate = ''; // show blank on screen.
        nClaim.ReleaseDate = '';
        nClaim.ToothNumber = 0;
        nClaim.Eyeware = '';
        nClaim.DrugName = '';

        nClaim.Service = firstService; // initialize state with 1st list value.

          // this causes the load service list function in render to reload
         // and fill the service dropdown.

         // change type ----> reload service drop down box!!
         // this triggers it!
      
         console.log('-- resetting state --- ');
         closureThis.setState({ 

            claim: nClaim 
         }); 

    }

    getClaimId = () => {
  
        var d = new Date();
        var today = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
        var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        var id= 'CL-' + today + '-' + time; 
        return id;
      }
    

    addClaimToDatabase = async (claim) => {  

        // setState will not work since nothing changed in component.
        claim.CustomerId = this.props.custId.trim();  
        claim.ServiceItem = '';
        claim.Location = '';
        claim.PaymentDate = this.getDefaultDate(); 
        claim.Referral = '';
        claim.PaymentAmount = 0; 
         
        var database = new Database(); 
        var res = await database.addClaim(claim, this.baseUrl); 
        return res; 

    }   
 

    cancelSubmit = (e) => {

        e.preventDefault();
        const { history: { push } } = this.props; 
        push('/hub');

    }

    showMessages = () => {

        this.msgOut = [];
         

        if(this.messages.length === 0) {
            return;
        }

        this.msgOut = [];   
        for(let theMessage of this.messages) {

            let v = <li> {theMessage} </li>;
            this.msgOut.push(v);
        }  
 

        debugger; 
        this.setState({

            messages: { messages: this.msgOut }

        });
         
 

    }
 

    loadServiceDropDown = () => {

        debugger;
        if(this.typeServices.length === 0) {
            // will be empty on 1st call before 
            // setDefaultType is called.
            return;
        }

        debugger;
        console.log('-- load service drop down');
        var serviceOptions = []; 
        for(var i = 0; i < this.typeServices.length; i++) {

           

            var row = this.typeServices[i];
            var service = row["ServiceName"].toString();
            var opt = <option key={i}>{service}</option>
            serviceOptions.push(opt); 

        
        }   
        console.log(serviceOptions.length + ' service entries laoded');
        return serviceOptions;
        
    }

    render() { 

       

        var blue = {

            color: this.claimFieldColor 
        }

        var st1 = {

            fontFamily: "Arial",
            fontSize: "larger"
        } 

         var b1st = {

            marginTop: "34px",
            color: "white", 
            backgroundColor: "black", 
            fontSize:  "larger",
            fontFamily: "Arial" 
        
        }
 
        var button1 = <div>   
        <Col>  
        <Button style={b1st} variant="outline-primary" onClick={this.fileClaim}>Submit Claim</Button>
        </Col> </div>;

        var button2 = <div><Col> 
        <Button style={b1st} variant="outline-primary" onClick={this.cancelSubmit}>Cancel</Button> 
        </Col></div>;
          
        var medical = (this.state.claim.ClaimType === "m");
        var dental  = (this.state.claim.ClaimType === "d");
        var vision  = (this.state.claim.ClaimType === "v");
        var drug    = (this.state.claim.ClaimType === "x");   

        return(<Container> 
             
            <Row> 
            <h1 className="welcomeTitle">Submit Claim</h1> <br/> 
            </Row> 

            <Form>  

            <Row> {/* entire screen */}
            <Col xs={2}> {/* buttons are first column */}
             
                <Form.Group>
        
                    <ListGroup>
                    <Button style={b1st} id="medical" variant="outline-primary" onClick={this.changeType}>Medical</Button>
                    <Button style={b1st} id="dental" variant="outline-primary" onClick={this.changeType}>Dental</Button>
                    <Button style={b1st} id="vision" variant="outline-primary" onClick={this.changeType}>Vision</Button>
                    <Button style={b1st} id="drug" variant="outline-primary" onClick={this.changeType}>Drug</Button>
                    </ListGroup>

                </Form.Group> 
            </Col> 

            <Col> {/* form is column 2 of a big row. */}

            <Row>  
                
            <Col>
              <Image src={welcomePic} alt="pic" width='200' height='110' /> 
            </Col>
             
            <Col>     
            <Form.Group>

                    <Form.Label style={st1} className='flabel'>Patient First Name:</Form.Label>
                    <Form.Control type="text" name="PatientFirst" value={this.state.claim.PatientFirst}
                                  style={blue} onChange={this.handleChange}/>
                    <Form.Label style={st1} className='flabel'>Patient Last Name:</Form.Label>
                    <Form.Control type="text" name="PatientLast" value={this.state.claim.PatientLast}
                                   style={blue}  onChange={this.handleChange}/> 
                  
             </Form.Group>
            
            </Col>
            </Row>  
            <Row>
                    <h5>Physician and Clinic:</h5>
            </Row>
            <Row><Col>

                    <Form.Label style={st1} className='flabel'>Physican:</Form.Label>
                    <Form.Control type="text" name="Physician" value={this.state.claim.Physician}
                             style={blue}     onChange={this.handleChange}/>

                    </Col>
                    <Col>

                    <Form.Label style={st1} className='flabel'>Clinic:</Form.Label>
                    <Form.Control type="text" name="Clinic" value={this.state.claim.Clinic}
                              style={blue}       onChange={this.handleChange}/>

                    </Col>
                    <Col>

                    <Form.Label style={st1} className='flabel'>Date Service:</Form.Label>
                    <Form.Control type="text" name="DateService" value={this.state.claim.DateService}
                              style={blue}       onChange={this.handleChange}/>

                    </Col>
 
            </Row>
            <br></br>
            <Row>
                     <h5>Claim Detail:</h5>
            </Row>
            <Row><Col>

                <Form.Label style={st1} className='flabel'>Procedure Code:</Form.Label>
                <Form.Control type="text" name="Procedure1" value={this.state.claim.Procedure1}
                            style={blue}     onChange={this.handleChange}/>

                </Col>
                <Col>

                <Form.Label style={st1} className='flabel'>Diagnosis Code:</Form.Label>
                <Form.Control type="text" name="Diagnosis1" value={this.state.claim.Diagnosis1}
                            style={blue}     onChange={this.handleChange}/>

                </Col>
                <Col>

                <Form.Label style={st1} className='flabel'>Claim Description:</Form.Label>
                <Form.Control type="text" name="ClaimDescription" value={this.state.claim.ClaimDescription}
                           style={blue}       onChange={this.handleChange}/>
                </Col>
            </Row>
 

<br></br>
            <Row>
                     <h5>Service:</h5>
            </Row>
            <Row><Col sm={4} >

               {/* service dropdown goes here - was sub chg --></Col> */}

               <Form.Label style={st1} className='flabel'>Service</Form.Label> 
 
                   <Form.Control as="select" value={this.state.claim.Service} 
                                 name="Service"
                                 onChange={this.handleChange}> 

                                {this.loadServiceDropDown()}

                    </Form.Control>  

             
            </Col>
            </Row>

            {/* claim type fields */}
            
            {medical && (<div> <br></br>
        <Row>  
                <h5>Medical Detail:</h5>
        </Row>
         <Row>
              
         <Col>
         <Form.Label style={st1} className='flabel'>Date Confine:</Form.Label>
         <Form.Control type="text" name="DateConfine" 
         style={blue} value={this.state.claim.DateConfine}
         onChange={this.handleChange}/>
        </Col>
        <Col>
         <Form.Label style={st1} className='flabel'>Date Release:</Form.Label>
         <Form.Control type="text" name="DateRelease"
         value={this.state.claim.DateRelease}
         style={blue}  onChange={this.handleChange}/>
        </Col> 
            {button1}
            {button2}

        </Row>
     </div>)}

     {dental && (<div> <br></br> 
           <Row>  
                  <h5>Dental Detail:</h5>
         </Row>
         <Row>

             <Col xs={3}>
             <Form.Label style={st1} className='flabel'>Tooth Number:</Form.Label>
             <Form.Control type="text" name="ToothNumber" 
             value={this.state.claim.ToothNumber}
             style={blue}   onChange={this.handleChange}/>
            </Col> 
            {button1}
            {button2}
         </Row> 
      </div>)}

      {vision && (<div> <br></br>
           <Row>  
                  <h5>Vision Detail:</h5>
         </Row>
         <Row>
         <Col xs={3}>
         <Form.Label style={st1} className='flabel'>Eyeware:</Form.Label>
         <Form.Control type="text" name="Eyeware" 
          value={this.state.claim.Eyeware}
          style={blue}   onChange={this.handleChange}/>
         </Col>  
            {button1}
            {button2}
         </Row>
     </div>)}

     {drug && (<div> <br></br> 
          <Row>  
                  <h5>Drug Detail:</h5>
         </Row>
         <Row>
            <Col xs={3}>
            <Form.Label style={st1} className='flabel'>Drug Name:</Form.Label>
            <Form.Control type="text" name="DrugName" 
            value={this.state.claim.DrugName}
            style={blue}  onChange={this.handleChange}/>
            </Col>  
            {button1}
            {button2}
         </Row>

       </div>)}  
       

            {/* end claim type fields */}
            <Row> 
                <div className="error">{this.state.messages.messages}</div> 
            </Row>
            </Col> 
            </Row> 
            </Form>  

        </Container>); 
    }


}

export default withRouter(Claim);
 