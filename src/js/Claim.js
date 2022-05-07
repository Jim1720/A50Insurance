
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
import { withRouter } from 'react-router-dom';  // was react-router-dom now react-router.

import Utility from './Utility';

class Claim extends React.Component {

    baseUrl = this.props.baseUrl;

    defaultDate = '1753-01-01';
    defaultClaimType = 'm';
    claimFieldColor = "Black"; // turn blue on adjustments.
    isCustomerSignedIn = this.props.isCustomerSignedIn;
    setMessage = this.props.setMessage; 
    getToken = this.props.getToken;
    handleClearAdjustmentFlag = this.props.handleClearAdjustmentFlag;
    setAction = this.props.setAction;

    // stay related for history screen.
    envUseStay = this.props.envUseStay;   
    envUseFocus = this.props.envUseFocus; 
    setFocusedClaim = this.props.setFocusedClaim;
    beginningStay = this.props.beginningStay;
    beginningFocus = this.props.beginningFocus;
    envUseActions = this.props.envUseActions;

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

    externalClass = ""; // formats screen to picture, solid, frame or no effects.
    userColor = ""; // background or frame color
    labelColor = ""; // suitable label color
    headerColor = ""; // suitable header colr
    messageColor = ""; // suitable message color 
    labelTypeColor = ""; // for service drop down and type field labels 
    internalClass = ""; // for type change: set type and drop down labels.
    /* when loading call to get style and color value for this screen */ 
    handleLoadScreenStyle = this.props.handleLoadScreenStyle;
    fetchScreenStyleInformation = this.props.fetchScreenStyleInformation;
    refreshProp = this.refreshProp;

    emptyClaim = {

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
        if(resp.status === success) {
 
            closureThis.allServices = resp.data;  
            // load adjustement fields if required
            closureThis.claimToAdjust = closureThis.props.claimToAdjust; 
            closureThis.creatingAdjustmentClaim = (closureThis.claimToAdjust !== null &&
                              closureThis.claimToAdjust !== undefined);   
            var defaultMedicalType = 'm';
            // set service drop down data to medical default claim values. 
            var defaultType = (closureThis.creatingAdjustmentClaim === true) ? 
                                closureThis.claimToAdjust.ClaimType :
                                defaultMedicalType
            //
            this.setDefaultType(defaultType, closureThis); // dropdown for medical claim. 
            //
            if(this.creatingAdjustmentClaim === true) { 
                this.setupAdjustment(closureThis);

            }
           
        } else
        {
            console.log('Plan.js get plans failed' + resp.status); 
        } 

    }


    handleClearAdjData = () => { 

        this.handleClearAdjustmentFlag();
    }

    setupAdjustment = (closureThis) => { 

        // direct assignment of state allowed in
        // constructor only... 

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
 
        var notSelected = "";
        // customer field 'custPlan' input property.
        if(this.custPlan === notSelected) { 
            msg.push('Plan must be assigned to customer before a claim can be entered.'); 
        }
 
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
         var claimType = this.state.claim.ClaimType;
         if(claimType === "m") {
            //dateParm.input = this.state.claim.DateConfine
            // allow blanks to default if not used. 
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
     
        var u = new Utility();
        var addClaim = u.makeDistinctNewObject(this.state.claim);
        // put formatted dates in for the database. 
       
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

            // features for new claim add 
 

            var id = addClaim.ClaimIdNumber.trim();
 
            if(this.envUseActions)
            { 
 
               var setActionObject = { action: 'New', claimId : id};
               this.setAction(setActionObject); 
            }
 


            if(this.envUseFocus && this.beginningFocus)
            { 
                this.setFocusedClaim(id); 
            }
 

            if(this.envUseStay && this.beginningStay)
            { 
               const { history: { push } } = this.props; 
               push('/history');
               return;
            } 
 
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
  
        debugger; 
        
        // stamp adjusted claim 
       var stampResult = await  this.stampAdjustedClaim(
                          claim,
                          adjustment)  
       if(stampResult === "OK") { 

             // clear adjustment flag in app.js so subsequent 
             // screens to not retain data. 
             this.handleClearAdjData();

             // show message on update screen
             var a = claim.toString();
             var b =  adjustment.toString();
             var message = `Claim ${a} adjusted by ${b}`;
             this.setMessage(message); 

             debugger;
 
             if(this.envUseActions)
             { 
 
                var setActionObject = { action: 'Adjustment', claimId : b};
                this.setAction(setActionObject); 
             }
 


             if(this.envUseFocus && this.beginningFocus)
             { 
                 this.setFocusedClaim(b); 
             }
 

             if(this.envUseStay && this.beginningStay)
             { 
                const { history: { push } } = this.props; 
                push('/history');
                return;
             }
 
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
       var info = result["data"];
       return info; 
    }

    setDefaultType = async (type, closureThis) => {
  
        var lit = "";
        switch(type)
        {
            case 'm': lit = "Medical"; break;
            case 'd': lit = "Dental"; break;
            case 'v': lit = "Vision"; break;
            case 'x': lit = "Drug"; break;
            default: break;
         } 

        // service-type, claim-type, closure.
        //await this.changeServiceList("Medical", "m", closureThis);

        await this.changeServiceList(lit, type , closureThis);

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
        
        // determine color on type field labels and service drop down label.
        // use button color ; except when solid use the current label color
        // for readability.

        // variable: labelTypeColor is used for dropdown and claim type fields.
        if(this.internalClass === "Solid")
        {
            // readability.
            this.labelTypeColor = this.labelColor;
        }
        else
        {
            // match selected claim type button.
            this.labelTypeColor = this.colorForClaimType();
        }
      
 
         var closureThis = this;
         await this.changeServiceList(serviceType, shortType, closureThis);
         
       
    }

    changeServiceList = async (serviceType, shortType,  closureThis) => {

        var firstMatch = true;; // load first match service name 
        var firstService = '';
        // to state.claim.Service so if user does not change sevice box
        // the first listed will be used. 
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
        this.emptyTypeFields(shortType, closureThis, firstService);
      

    }

    emptyTypeFields = (shortType, closureThis, firstService) => {
 

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
      
       //  console.log('-- resetting state --- ');
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
        var key = 0;
        for(let theMessage of this.messages) {
           
            key = key + 1;
            var k = key.toString();
            let v = <li key={k}> {theMessage} </li>;
            this.msgOut.push(v);
            // 
        }  
 
 
        this.setState({

            messages: { messages: this.msgOut }

        });
         
 

    }
 

    loadServiceDropDown = () => {
 
        if(this.typeServices.length === 0) {
            // will be empty on 1st call before 
            // setDefaultType is called.
            return;
        }
 
    //    console.log('-- load service drop down');
        var serviceOptions = []; 
        for(var i = 0; i < this.typeServices.length; i++) {

           

            var row = this.typeServices[i];
            var service = row["ServiceName"].toString();
            var opt = <option key={i.toString()}>{service}</option>
            serviceOptions.push(opt); 

        
        }   
     //   console.log(serviceOptions.length + ' service entries laoded');
        return serviceOptions;
        
    }

    colorForClaimType = () => {

        var value = this.state.ClaimType;
        var color = "white";
        switch(value) {

            case "m" : color = "red"; break;
            case "d" : color = "dodgerblue"; break;
            case 'v' : color = "goldenrod"; break;
            case 'x' : color = "lawngreen"; break;
            default: break;
        }

        return color;

    }

    render() { 

       
        /* was loaded in the navArea component when
           navigation changed - here we fetch th
           style values. 
           note: can not update state here with new sytle info
           or the react system will loop. No style state updates here
        */ 
           var screenStyle = this.fetchScreenStyleInformation("claim");
           this.messageColor = 'burleywood'; // default was lawngreen.
           this.labelColor = 'dodgerblue';
           this.headerColor = 'burleywood';
   
           // - - - - get class and color information - - - 
           var styleObjectFound = screenStyle === null ? false : true;
           this.messageColor = 'white'; // default was lawngreen. 
            if(styleObjectFound) { 
               
               this.externalClass = screenStyle.externalClass;
               this.userColor = screenStyle.userColor;
               this.labelColor = screenStyle.labelColor;
               this.headerColor = screenStyle.headerColor;
               this.messageColor = screenStyle.messageColor;   

               // label color for service drop down and type fields
               this.internalClass = screenStyle.internalClass;
               if(this.internalClass === "Solid")
               {
                    this.labelTypeColor = this.labelColor; // readability.
               }
               else
               {
                    this.labelTypeColor = this.colorForClaimType();
               }
   
            }

        var blue = {

            color: this.claimFieldColor 
        }

        /* define label colors on screen */
        var st1 = {

            fontFamily: "Arial",
            fontSize: "larger",
            color: this.labelColor 
        } 

        /* type field labels and service label */

        /* matches color of button med,den, etc; 
        /* except on solid background will match */
        /* label color for readabililty. */

      

         var b1st = {

            marginTop: "34px",  
            fontSize:  "larger",
            fontFamily: "Arial" 
        
        } 
 
 
        var outlineStyle = { 

            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: this.userColor, 
            padding: "15px 30px 15px 30px"
        }

        var solidStyle = {

            backgroundColor: this.userColor,
            transitions: "4s",
            padding: "15px 30px 15px 30px"
        }

        var errorMessagStyle = {

            marginLeft: "50px",
            marginTop: "34px" ,
            color: this.messageColor
        }
 
        var userStyle = {}

        switch(this.externalClass)
        {

            case 'bg-outline':  
                  userStyle = outlineStyle;
                  break;
            case 'bg-solid':
                  userStyle = solidStyle;
                  // match label color when solid override button color for visablity.
                  this.labelTypeColor = this.labelColor
                  break; 
            default:
                  break;
        }
 
        var button1 = <div>   
        <Col>  
        <Button style={b1st} variant="primary" onClick={this.fileClaim}>Submit Claim</Button>
        </Col> </div>;

        var button2 = <div><Col> 
        <Button style={b1st} variant="primary" onClick={this.cancelSubmit}>Cancel</Button> 
        </Col></div>;
          
        var medical = (this.state.claim.ClaimType === "m");
        var dental  = (this.state.claim.ClaimType === "d");
        var vision  = (this.state.claim.ClaimType === "v");
        var drug    = (this.state.claim.ClaimType === "x");   

         /* react does not allow burleywood in the style css variables
           workaround here */

           var headerStyle = {

            color: this.headerColor
        }


           var linkIsStyle = "";
           var linkIsOutline = "bg-outline";
           var header = "";
           var messenger = "";
           if(this.externalClass === linkIsStyle)
           {
                header = <h2 className="welcomeTitle">New Claim</h2> 
                messenger = <div className="welcomeTitle">{this.msgOut}</div>
           }
           else if(this.externalClass === linkIsOutline)
           {
              header =  <h2 className="bw">New Claim</h2> 
              messenger =<div className="bw">{this.msgOut}</div>
           }
           else
           {
                header =  <h2 style={headerStyle}>New Claim</h2> 
                messenger = <div style={errorMessagStyle}>{this.msgOut}</div> 
           }

        return(<Container> 
             
             <br/>
             <div id="styleDiv" className={this.externalClass} style={userStyle}>

            <Row className="justify-content-md-center"> 
            {header}
            </Row> 

            <br>
            </br>
            <Form >  

            <Row> {/* entire screen */}
            <Col xs={2}> {/* buttons are first column */}
             
                <Form.Group>
        
                    <ListGroup>
                    <Button key="1" style={b1st} id="medical" variant="primary" onClick={this.changeType}>Medical</Button>
                    <Button key="2" style={b1st} id="dental" variant="primary" onClick={this.changeType}>Dental</Button>
                    <Button key="3" style={b1st} id="vision" variant="primary" onClick={this.changeType}>Vision</Button>
                    <Button key="4" style={b1st} id="drug" variant="primary" onClick={this.changeType}>Drug</Button>
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

           
            <Row> {/* contains service drop and type fields at right */}
                
                <Col sm={4} >

               {/* service dropdown goes here - was sub chg --></Col> */}

               <Form.Label style={st1} className='flabel'>Service</Form.Label> 
 
                   <Form.Control as="select" value={this.state.claim.Service} 
                                 name="Service"
                                 onChange={this.handleChange}> 

                                {this.loadServiceDropDown()}

                    </Form.Control>  

             
            </Col>


            <Col>

            {/* claim type fields */}
            
            {medical && (<div> 
        
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
           

        </Row>
     </div>)}

     {dental && (<div> 
          
         <Row>

             <Col xs={3}>
             <Form.Label style={st1} className='flabel'>Tooth Number:</Form.Label>
             <Form.Control type="text" name="ToothNumber" 
             value={this.state.claim.ToothNumber}
             style={blue}   onChange={this.handleChange}/>
            </Col> 
            
         </Row> 
      </div>)}

      {vision && (<div> 
           
         <Row>
         <Col xs={3}>
         <Form.Label style={st1} className='flabel'>Eyeware:</Form.Label>
         <Form.Control type="text" name="Eyeware" 
          value={this.state.claim.Eyeware}
          style={blue}   onChange={this.handleChange}/>
         </Col>  
           
         </Row>
     </div>)}

     {drug && (<div>  
          
         <Row>
            <Col xs={3}>
            <Form.Label style={st1} className='flabel'>Drug Name:</Form.Label>
            <Form.Control type="text" name="DrugName" 
            value={this.state.claim.DrugName}
            style={blue}  onChange={this.handleChange}/>
            </Col>  
           
         </Row>

       </div>)}  
       
        </Col>

       </Row>

            {/* end claim type fields */} 

            
            <Row> 

                {button1}
                {button2}
                {messenger}

            </Row>
          
            </Col> {/* right col end */}

            </Row> 

            </Form>  
        
            </div> {/* style end */}
            
        </Container>); 
    }


}

export default withRouter(Claim);
 