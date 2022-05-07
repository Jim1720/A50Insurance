
// ClaimHistory.js
 
import React from 'react';
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; 
import $ from 'jquery';

// for history: https://thewebdev.info/2021/05/08/how-to-get-the-browser-history-object-with-react-router/#:~:text=Get%20History%20on%20react-router%20We%20can%20get%20the,from%20%27.%2FApp%27%20const%20history%20%3D%20createBrowserHistory%20%28%7B%20%2F%2F

import { withRouter} from 'react-router-dom';  // was react-router-dom now react-router.

import '../css/historyStyle.css';

import Database from './Database';  
class ClaimHistory extends React.Component {
 
     
    // hold claims to send one to adjust...
    adjustmentClaimList = [];
    baseUrl = this.props.baseUrl;
    isCustomerSignedIn = this.props.isCustomerSignedIn;
    setMessage = this.props.setMessage; 
    getToken = this.props.getToken;
    envUseStay = this.props.envUseStay;
    envUseFocus = this.props.envUseFocus;
    envUseNav = this.props.envUseNav;
    envUseActions = this.props.envUseActions; 
    setFocusdClaim = this.props.setFocusedClaim 
    getAction = this.props.getAction;
    setAction = this.props.setAction;  
    refreshProp = this.refreshProp;  // stay and focus buttons
    setBeginning = this.props.setBeginning; 
    beginningStay = this.props.beginningStay;
    beginningFocus = this.props.beginningFocus;
    focusedClaim = this.props.focusedClaim;   
    setFocusedClaim = this.props.setFocusedClaim;   

    clear = null; 
    localFocusedClaim = ""; 

     act1literal = "";
     act2literal = ""; 
     action1Present = false;
     action2Present = false;
     act1claimId = "";
     act2claimId = ""; 
 
    currentDate = '';
    
    state = {
        claims: [],
        message: '',
        claimsFound: false,
        stayButtonOn: this.beginningStay,
        focusButtonOn: this.beginningFocus, 
    }; 
 
    readyToLoadHistory = 0; 
 

    componentDidMount = async () => {
 

        this.readyToLoadHistory += 1; 

        this.focusHandlerComponentDidMount();

        this.setUp(); 
    }

    setUp = async () => {

 
        // check valid login

         // check for valid login
         var ok = this.isCustomerSignedIn();
         if(!ok) {
 
             const { history: { push } } = this.props; 
             push('/start');  
         }  
         
          
        // load claim history data into 'claims'. 
        this.claims =  await this.getClaimHistory(this.props.custId);  

         // called from componentDidMount: routine later in code.... near bottom.
         
          
         
         debugger; 
 
         try {

            this.scrollToFocusAttempt();

         } catch(Error) {

            for(let p in Error) {
                console.log("script attach error");
                console.log("script 10 " + p + " " + Error[p]);
            }

         }
  
 
    }

    focusHandlerComponentDidMount() {  //
        
        // call from component did mount - will check focused claim passed from adjustment
        // or new claim and set localFocusedClaim.

        // clear app focusedClaimIf set and copy value to local focused claim
        // can not use 'this.setFocuseClaim() inside of claim load loop
        // 

        // note: this logic can not be in the render. 
 
        this.localFocusedClaim = ""; 
        var doWeHaveFocusedclaimFromAdjustmentScreen = this.focusedClaim !== "";

        // came from adjustment screen ?
        if(doWeHaveFocusedclaimFromAdjustmentScreen)
        {
            this.localFocusedClaim = this.focusedClaim; 
            this.setFocusdClaim(""); // only focus once.  
        }

        // in pay stay mode ?
        var hasAFocusedPaymentBeenMadeWhileThisScreenActive = this.state.payStayFlag;
        if(hasAFocusedPaymentBeenMadeWhileThisScreenActive) {
            this.localFocusedClaim = this.payStay.claimIdNumber;
        }
 

        /* first we check for a focused claim from adjustement or new claim
           logic, then if not, we check for a paystay claim from the payment
           operation.
        */

        // this should not be needed since it is the same meachanism 
        // as coming from adjustment but in this case as prior history screen
        // use adjustment branch above to handle this case too.

        // This is for a react component reload when using 
        // nav buttons: payStayClaimIdNumber stored in state

        // -> will have test to see if the state is needed or
        // is payStayClaimIdNumber kept on nav btn reloads ?

        if(this.localFocusedClaim === "") { 
            if(this.state.payStayClaimIdNumber !== "") { 
                this.localFocusedClaim = this.state.payStayClaimIdNumber;
                this.setState({payStayClaimIdN: ''}); 
            }   
        }  
    }

    focusHandlerPayStayMode(payStayClaimIdNumber) {

        /* called from claim payment to set the focused claim id for future
           history display or current history screen with the paystay variables
        */
         

        /* this sets a focused claim for the next history display or
           the current history display. This depends on the current
           setting of the stay button: stay off or stay on, respectively
        */

        var areWeStayingOnHistoryScreen = this.envUseStay && this.beginningStay;
        var willReturnToHistoryLater = !areWeStayingOnHistoryScreen;

        if(areWeStayingOnHistoryScreen)
        {  
           this.localFocusedClaim = this.state.payStayClaimIdNumber;
           this.setState({payStayClaimIdNumber: ''});
        }

        /* stay is off - set up for next history display when customer returns to 
           history screen - similar to new claim or adjustment logic  */

        if(willReturnToHistoryLater)
        {
            this.setFocusedClaim(payStayClaimIdNumber); 
            return;
        }
  
    }

    toggleStay() {
 

        var newStayValue = this.state.stayButtonOn ? false : true;
        this.setState({ stayButtonOn: newStayValue});
        // reset initial value in app.js for next time screen loads....
        this.setBeginning("stay", newStayValue); 
    }

    toggleFocus() {

        var newFocusValue = this.state.focusButtonOn ? false : true;
        this.setState({ focusButtonOn: newFocusValue});
        // reset initial value in app.js for next time screen loads....
        this.setBeginning("focus", newFocusValue); 
    }

    mainMenu() { 
         
        const { history: { push } } = this.props; 
        push('/hub'); 

    }

    gotoClaim() {
 
        const { history: { push } } = this.props; 
        push('/claim'); 

    }
                
    adjustClaim(count) {
 
        var index = count.count;
        var claim = this.adjustmentClaimList[index];
        this.props.handleSetClaimToAdjust(claim); 
        const { history: { push } } = this.props; 
        push('/claim'); 

    }
    payClaim(count) { 
        
        var index = count.count;
        var claim = this.adjustmentClaimList[index];
        var db = new Database();
        var form = {};
        form.action = "pay";    
        form.claimIdNumber = claim.ClaimIdNumber; 
        this.currentDate =  this.getCurrentDate(); 
        form.date = this.currentDate;
        form.plan = '';
        var userCancelledPayment = null;
        var userAmount = prompt("Please enter amount of payment..."); 

        if(userAmount === userCancelledPayment) { 

            return '';  // payment cancelled.
        }

        var amt = parseFloat(userAmount);
        if(isNaN(amt)) {
            alert("please enter proper dollar amount.");
            return;
        }


        form.amount = amt; 

        // add token
        form['_csrf'] = this.getToken();

        db.payClaim(form,this.baseUrl);

        var a = claim.ClaimIdNumber.trim();
        var b = userAmount;
        var message = `Claim ${a} paid for $${b}.`;
        this.setMessage(message);  
  
        if(this.envUseFocus && this.beginningFocus)
        { 
            this.setFocusedClaim(a); 

            this.focusHandlerPayStayMode(a);
        } 

        if(this.envUseActions)
        {  
           var setActionObject = { action: 'Payment', claimId : a};
           this.setAction(setActionObject);
        }  
       
        debugger;

        if(this.envUseStay && this.state.stayButtonOn)
        {  
               
            // update claims array 
            var claims = this.state.claims; 

            var x = claims.findIndex(c => c.ClaimIdNumber.trim() === a);  
            claims[x].ClaimStatus = "Paid"; 
            claims[x].PaymentAmount = userAmount; 
            claims[x].PaymentDate = this.currentDate;
 
            this.setState({

                claims: claims
            });
            return;  
        } 
         
        const { history: { push } } = this.props; 
        push('/hub');   
        return; 
    }
 

    

    getActions = () => {

      

        // pull latest adjustement or payment data for action buttons. 

        var actionOne = this.getAction(0);
        if(actionOne['data'] === true) { 
            let action = actionOne['action'];
            let claimId = actionOne['claimId'];
            this.act1literal = this.formatAction(action, claimId); 
            this.action1Present = true;
            this.act1claimId = claimId;
        }

        var actionTwo = this.getAction(1);
        if(actionTwo['data'] === true) { 
            let action = actionTwo['action'];
            let claimId = actionTwo['claimId'];
            this.act2literal = this.formatAction(action, claimId);  
            this.action2Present = true;
            this.act2claimId = claimId;
        }
 
    }

    formatAction = (action, claimId) => {

        var act = action.substring(0,3);
        var dash = "-";
        var start = claimId.length - 2;  
        var id = claimId.substring(start);  
        var cid = id.replace(":","");
        var result = act + dash + cid;
        return result;

    }
    
 
    getCurrentDate = () => {

        var d = new Date();
        var today = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();  
        return today;
    }

    showClaims() { 

        /* Sync with react life cycle and also component did mount */

        /* compnent gets loaded on or more tims and
           this routine gets called several times ----
           make sure that the logic is used only the final time.
           After that any buttons which reload component such
           as bottom or top will be allowed as the counter remains at 4
         */

        var sync = 2; // load on pass 2.
        if(this.readyToLoadHistory !== sync) 
        {
            this.readyToLoadHistory += 1;
        } 
       

        if(this.readyToLoadHistory === sync)
        { 
              // once loaded keep there for button operatons and payment operations.
            this.readyToLoadHistory = sync; 
        }
        else
        { 
              return;
        }

  
        var out = [];  

        // 1.14 add key and claim array for adjustment.
        var count = 0;
        var acount = 0;  
        var claimSequence = 0; 
        var total = this.state.claims.length;
        var half =  (total - (total % 2)) / 2;
         
        this.getActions();   
 

        for (let claim of this.state.claims) { 
 
            acount = acount + 100; 
            var k2 = acount + 2;
            var k3 = acount + 3;
            var k4 = acount + 4;
            var k5 = acount + 5;
            var k6 = acount + 6;

            var k8 = acount + 8;
            var k9 = acount + 9;
            var k10 = acount + 10;
            var k11 = acount + 11; 
            var k12 = acount + 12; 

            var k13 = acount + 13;
            var k14 = acount + 14;
            var k15 = acount + 15;
            var k16 = acount + 16;
            var k17 = acount + 17;
            var k18 = acount + 18; 
            var k19 = acount + 19; 
            var k20 = acount + 20; 
            var k21 = acount + 21; 

            var k31 = acount + 31; 
            var k32 = acount + 32; 
            var k33 = acount + 33; 

            var b1 = acount + 61;
            var b2 = acount + 62;
            var b3 = acount + 63;
            var b4 = acount + 64;
            var b5 = acount + 65;
            var b6 = acount + 66;
            var b7 = acount + 67;
            var b8 = acount + 68;
            var b9 = acount + 69;
            var b10 = acount + 70;
            var b11 = acount + 71;

            var na1 = acount + 81; 
            var na2 = acount + 82; 
            var na3 = acount + 83; 
            var na4 = acount + 84;
            var na5 = acount + 85;
            var na6 = acount + 86; 
 
            claimSequence = count + 1; 
            var navLine = "";
            if(this.envUseNav)
            {
                switch(count)
                {
                    case 0 :    navLine = <div id="top" key={na1}></div>;
                         break;
                    case half : navLine = <div id="mid" key={na2}> middle </div>;
                         break;
                    case total - 1: navLine = <div id="bottom" key={na3}></div>;
                         break;
                    default: 
                         break;
                } 
            } 
            if(navLine !== "")
            {
                // write navigation line at beginning of claim data.
                out.push(navLine);

            } 
            
            var focusLine = "";
            var id = claim.ClaimIdNumber.trim();
            // check for focused claim
          
            debugger; 

            if(id === this.localFocusedClaim
               &&
               this.envUseFocus
               &&
               this.beginningFocus)
            {  
                
                focusLine = <div id="focus" key={na4}>focused claim </div>  
            } 
            if(focusLine !== "")
            {
               
                out.push(focusLine);
                this.localFocusedClaim = "";
                

            }

         


            // write action lines with keys na5, and na6.
            var matchId = this.act1claimId === id;
            if(this.envUseActions && this.action1Present && matchId)
            { 
                var act1line = <div id="act1" key={na5}></div>
                out.push(act1line);
            }
            
            var matchId2 = this.act2claimId === id;
            if(this.envUseActions && this.action2Present && matchId2)
            { 
                var act2line = <div id="act2" key={na6}></div>
                out.push(act2line);
            } 

            var first = claim.PatientFirst.trim();
            var last  = claim.PatientLast.trim(); 
            var physician = claim.Physician.trim();
            var clinic = claim.Clinic.trim();
            var procedure = claim.Procedure1.trim();
            var diagnosis = claim.Diagnosis1.trim();
            var serviceDate = claim.DateService.substring(0,10);
            serviceDate = this.formatHistoryDate(serviceDate);
            var description = claim.ClaimDescription.trim(); 

            var plan = claim.PlanId.toString();
            var totalCharge = claim.TotalCharge.toString(); // numeric do not trim
            var coveredAmount = claim.CoveredAmount.toString();
            var balanceOwed = claim.BalanceOwed.toString();
            var service = claim.Service.toString();
            var claimType = null;
            switch(claim.ClaimType) {
                case 'm' : claimType = "Medical" ;break;
                case 'd' : claimType = "Dental"; break;
                case 'v' : claimType = "Vision"; break;
                case 'x' : claimType = "Drug"; break;
                default: claimType = "unknown"; break;
            }

            var status1 =  " : " + claim.ClaimStatus.trim(); // display
            var status = claim.ClaimStatus.trim(); // test for line display. 

            // if adjustmen requested pass to claim screen. 
            this.adjustmentClaimList[ count ] = claim; 

            // white header ; burley claim id (css); dodger blue data.

            var spacer = <hr key={k32} />;

            out.push(spacer);

            var titleLine0 = <Row  key={k2}>
            <Col className="white s1 f1"> Claim Id and Status     </Col>
            <Col className="white f1"> Claim Type  </Col>  
            <Col className="white f1"> Description </Col>
            <Col className="white f1"> Sequence </Col>
           </Row>;
       

            var titleLine1 = <Row  key={k3}>
                 <Col className="burleywood f1"> {id}{status1}     </Col>
                 <Col className="dodgerblue f1"> {claimType}  </Col> 
                 <Col className="dodgerblue f1"> {description} </Col>
                 <Col className="dodgerblue f1"> {claimSequence} </Col>
                </Row>;
             
            out.push(titleLine0);
            out.push(titleLine1);

            var firstLineHeader = <Row  key={k4}>
            <Col className="white s1 f1"> Patient     </Col>
            <Col className="white f1"> Service Date  </Col> 
            <Col className="white f1"> Clinic </Col>
            <Col className="white f1"> Physician </Col> 
           </Row>;

            var firstLineData = <Row  key={k5}>
            <Col className="burleywood s1 f1"> {first}&nbsp;&nbsp;{last}   </Col>
            <Col className="aqua f1">  {serviceDate} </Col> 
            <Col className="dodgerblue f1"> {clinic} </Col>
            <Col className="dodgerblue f1"> {physician} </Col> 
            </Row>;

            out.push(firstLineHeader);
            out.push(firstLineData);

            var secondLineHeader = <Row  key={k6}>
            <Col className="white s1 f1"> Procedure     </Col>
            <Col className="white f1"> Diagnosis  </Col> 
            <Col className="white f1"> Plan </Col>
            <Col className="white f1"> Service </Col> 
           </Row>;

            var secondLineData = <Row  key={k8}>
            <Col className="dodgerblue s1 f1">  {procedure}   </Col>
            <Col className="dodgerblue f1">  {diagnosis} </Col> 
            <Col className="dodgerblue f1">  {plan} </Col>
            <Col className="aqua f1"> {service}  </Col> 
            </Row>; 

            out.push(secondLineHeader);
            out.push(secondLineData);

            var thirdLineHeader = <Row  key={k9}>
            <Col className="white s1 f1"> Total Charge     </Col>
            <Col className="white f1"> Covered Amount  </Col> 
            <Col className="white f1"> Amount Owed </Col> 
            <Col></Col>
           </Row>;

            var thirdLineData = <Row  key={k10}>
            <Col className="dodgerblue s1 f1"> ${totalCharge}     </Col>
            <Col className="dodgerblue f1"> ${coveredAmount}  </Col> 
            <Col className="dodgerblue f1"> ${balanceOwed} </Col> 
            <Col></Col>
            </Row>;

            out.push(thirdLineHeader);
            out.push(thirdLineData);


            // type lines  

            if(claimType === "Medical") { 
                var con = this.formatHistoryDate(claim.DateConfine);
                var rel = this.formatHistoryDate(claim.DateRelease);  
                
                var unused = "1753-01-01";
                var showConfine = (con === unused ) ? "" : con;
                var showRelease = (rel === unused ) ? "" : rel;
                var confineLit = (con === unused ) ? "" : "Confined:";
                var releaseLit = (rel === unused ) ? "" : "Rel:";
                var showLine = (showConfine !== "" || showRelease !== "");   
                //var medLine = <tr key={k8}><td>{confineLit} {showConfine} </td><td>{releaseLit} {showRelease} </td></tr>
                var medLine1 =  <Row  key={k11}>
                <Col className="white s1 f1"> {confineLit}    </Col>
                <Col className="white f1"> {releaseLit}    </Col>  
               </Row>;
                var medLine2 =  <Row  key={k31}>
                <Col className="dodgerblue s1 f1">   {showConfine}   </Col>
                <Col className="dodgerblue f1">      {showRelease}  </Col>  
               </Row>;
    
                if(showLine) { 
                    out.push(medLine1); 
                    out.push(medLine2);
                }
            }
            // we can reuse k11 since only one type line will show.
            if(claimType === "Dental") {
                var tooth = claim.ToothNumber;
                // var denLine = <tr key={k9}><td>Tooth Number: {tooth} </td></tr>
                var denLine =  <Row  key={k12}> 
                <Col className="white s1 f1"> Tooth Number: {tooth}   </Col>
                </Row>;
                out.push(denLine);
            }
             // we can reuse k11 since only one type line will show.
            if(claimType === "Vision") {
                var eyeware = claim.Eyeware;
                //var visionLine = <tr key={k10}><td>Eyeware: {eyeware} </td></tr>
                var visionLine =  <Row  key={k13}> 
                <Col className="white s1 f1"> Eyeware: {eyeware}    </Col>
                </Row>;
                out.push(visionLine);
           } 
           if(claimType === "Drug") {
               var name = claim.DrugName;
               var drugLine =  <Row  key={k14}> 
               <Col className="white s1 f1"> Drug Name: {name}    </Col>
               </Row>;
               //var drugLine = <tr key={k11}><td>Drug Name: {name} </td></tr>
               out.push(drugLine);
           } 
           // end of type lines

            // if claim status is paid then
            // show payment information.... 
            if(status === "Paid") {
                var amount = "  $" + claim.PaymentAmount.toString().trim(); 
                var paymentDate = this.formatHistoryDate(claim.PaymentDate); 
                var date = " " + paymentDate;
               

                var paymentLine1 =  <Row  key={k15}> 
                <Col className="white s1 f1"> Payment Amount    </Col> 
                <Col className="white f1">    Payment Date  </Col> 
                </Row>; 
                                
                var paymentLine2 =  <Row  key={k16}> 
                <Col className="dodgerblue s1 f1"> {amount}    </Col> 
                <Col className="dodgerblue f1"> {date}  </Col> 
                </Row>;

                out.push(paymentLine1); 
                out.push(paymentLine2);
                //TODO: check 'payment plan'.
            }  
  

            if(status === "Adjusted") {
                var a = " " + claim.AdjustingClaimId + " ";
                var adjustedDate = this.formatHistoryDate(claim.AdjustedDate);
                var b = " " + adjustedDate + " "; 
                var adjustedLine1 =  <Row  key={k17}> 
                <Col className="white s1 f1"> Adjusted By    </Col> 
                <Col className="white f1">    Adjusted Date  </Col> 
                </Row>; 
                                
                var adjustedLine2 =  <Row  key={k18}> 
                <Col className="dodgerblue s1 f1"> {a}    </Col> 
                <Col className="dodgerblue f1"> {b}  </Col> 
                </Row>;

                out.push(adjustedLine1);
                out.push(adjustedLine2);
            }

            if(status === "Adjustment"){
                var d = " " + adjustedDate + " "; 
                var c = " " + claim.AdjustedClaimId + " "; 

               var adjustingLine1 =  <Row  key={k19}> 
               <Col className="white s1 f1"> Adjusted Claim    </Col> 
               <Col className="white f1">    Adjusted Date  </Col> 
               </Row>; 
                               
               var adjustingLine2 =  <Row  key={k20}> 
               <Col className="dodgerblue s1 f1"> {c}    </Col> 
               <Col className="dodgerblue f1"> {d}  </Col> 
               </Row>; 

                out.push(adjustingLine1);
                out.push(adjustingLine2);
            
            }

            // show buttons after each claim for actions  
       
            // Menu Button 
            var menuButton = <Button  className="g4stay btn btn-primary-outline st1a"
                    variant="primary" key={b1}
                    onClick={this.mainMenu.bind(this)}>Menu</Button>  

            // Stay and Focus Buttons
            var stayButton = "";
            var focusButton = "";

           
            var stayLit = this.state.stayButtonOn ? " stay on" : "stay off";
            var focusLit = this.state.focusButtonOn ? "focus on" : "focus off"; 
         
            // Stay Button
            // stateStayOn - clicked value of this button stay on / stay off.
            if(this.envUseStay)
            { 
                stayButton = 
                <Button id="stayButton" key={b2}
                        className="g4stay btn btn-primary-outline st1a"
                        onClick={this.toggleStay.bind(this)}>
                            {stayLit}
                </Button>
            } 

            // Focus Button
             // stateFocusOn - clicked value of this button focus on / focus off.
            if(this.envUseFocus)
            {
                focusButton = 
                <Button id="focusButton" key={b3}
                        className="g4focus btn btn-primary-outline st1a"
                        onClick={this.toggleFocus.bind(this)}>
                        {focusLit}
                </Button>
            }

            var claimButton =
            // Claim
            <Button variant="primary" key={b4}
                    className="g4claim btn btn-primary-outline st1a"
                    onClick={this.gotoClaim.bind(this)}>New Claim</Button>  

            // adjust and pay buttons       
            var adjButton = "";
            var payButton = "";
        
            var allowPaidandAdjusted = status !== "Adjusted" && status !== "Paid"

            // Adjust  
            if(allowPaidandAdjusted) {
                adjButton =
                <Button variant="primary"   key = {b5}
                className="g3adjust btn btn-primary-outline st1a"
                onClick={this.adjustClaim.bind(this,{count})}>Adjust</Button>
           } 
  
           // Pay
           if(allowPaidandAdjusted) {
            payButton =
            <Button variant="primary" key={b6}
            className="g2pay btn btn-primary-outline st1a"
            onClick={this.payClaim.bind(this,{count})}>Pay Claim</Button> 
           }  

           var topButton = "";
           var midButton = "";
           var bottomButton = "";

            // nav buttons 
            if(this.envUseNav)
            {
                topButton = 
                <Button id="topButton" key={b7}
                        href="history#top"
                        className="g4top btn btn-primary-outline st1a">
                        Top
                </Button>

                midButton = 
                <Button id="midButton" key={b8}
                        href="history#mid"
                        className="g4mid btn btn-primary-outline st1a">
                        Mid
                </Button>

                 bottomButton = 
                <Button id="bottomButton" key={b9}
                        href="history#bottom"
                        className="g4bot btn btn-primary-outline st1a">
                        Bottom
                </Button>
            } 

            var act1Button = "";
            // Action Buttons 
            if(this.envUseActions && this.action1Present)
            { 
               act1Button = 
                <a id="act1button" key={b10}
                href="history#act1"
                className="g5act1 btn btn-primary-outline st1a"> 
                    {this.act1literal}
                </a>
            }

            var act2Button = "";
            if(this.envUseActions && this.action2Present)
            { 
                act2Button = 
                <a id="act2button" key={b11}
                href="history#act2"
                className="g5act2 btn btn-primary-outline st1a"> 
                    {this.act2literal}
                </a> 
            } 
           
            var spacer2 = <hr key={k33} />;
            out.push(spacer2); 

            navLine =  <Row  key={k21} className="s1">  
                 {menuButton} 
                 {stayButton} 
                 {focusButton}  
                 {claimButton}
                 {adjButton}
                 {payButton}
                 {topButton}
                 {midButton}
                 {bottomButton}
                 {act1Button}
                 {act2Button} 
            </Row>;  

            out.push(navLine);  
             
            count++;

        }  
        
        out.push(this.message); 

        return( out );
    }
 

    formatHistoryDate = (value) => { 
 
        var input = value.toString();
        var preFormatted = input.indexOf("/") > -1;
        if(preFormatted) { // skip formatting when  stay is on, and paying claim...
            return value; // payment date on same screen - state updated directly not from database.
        }
        input = input.substring(0,10);
        var unused = "1753-01-01";
        if ( input === unused) { 
            return unused;
        }

        // formats database date. yyyy-mm-dd to mm/dd/mmmm.
        var mm = input.substring(5,7);
        var dd = input.substring(8,10);
        var yyyy = input.substring(0,4); 
        var output = mm + "/" + dd + "/" + yyyy;
        return output; 
    }
 

    getClaimHistory = async (custId) => {

        debugger; 
        var claims = ''; 
         
        var database = new Database(); 
        claims = await  database.getClaimHistory(custId, this.baseUrl); 
        this.setStateData(claims);
    }

    setStateData = (claims) => {

        var msg = '';
        if(claims.length === 1) {
            msg = 'one claim found.';
        } else {
            msg = claims.count + ' claims found.';
        }
        var found = (claims.length > 0) ? true : false;

        

        this.setState({

            claims: claims,
            message: msg,
            claimsFound: found 

        });
    }


    scrollToFocusAttempt = () => {

        // when id=focus div exists scroll to it.
 

        var focusDivElement = document.getElementById("focus");
        if(focusDivElement === null || focusDivElement === undefined )
        { 
            return;
        }
 
    
        // scroll to focused claim
        $(window).scrollTop($("#focus").offset().top);

    }

    render() { 
 
        var b1st = { 

            color: "white", 
            backgroundColor: "black",
            margin: "2px",
            fontSize:  "larger",
            fontFamily: "Arial" 
        
        }

       
       
       var foundClaimHtml = <div></div>; // place holder do not call showClaims when none found.
        debugger;
        if(this.state.claimsFound) {
 
            foundClaimHtml = <div><Container>  
                   
                {this.showClaims()}  
                </Container></div>;
        }

        var noClaimsFoundHtml = (<div><Container>

            <Row></Row>

            <Row> 
                 
                <div className="sAqua htitle">Claim History</div>
            </Row>
            <Row>
                <h2 className='dBlue htitle'>Claim History no claims found </h2> 
            </Row>
            <Row>
               <Button style={b1st} variant="primary" onClick={this.mainMenu.bind(this)}>Menu</Button>  
            </Row>

        </Container></div>); 

        if(this.state.claimsFound === true) {

            return foundClaimHtml;

        } else {

            return noClaimsFoundHtml;
        }
    }   
     
}



export default withRouter(ClaimHistory);