
// ClaimHistory.js
 
import React from 'react';
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row'; 
import Button from 'react-bootstrap/Button';

import { withRouter } from 'react-router-dom';

import '../css/historyStyle.css';

import Database from './Database';   
class ClaimHistory extends React.Component {
     
    // hold claims to send one to adjust...
    adjustmentClaimList = [];
    baseUrl = this.props.baseUrl;
    isCustomerSignedIn = this.props.isCustomerSignedIn;
    setMessage = this.props.setMessage; 
    getToken = this.props.getToken;

    state = ({
        claims: [],
        message: '',
        claimsFound: false, 
    }) 

    mainMenu() {

        const { history: { push } } = this.props; 
        push('/hub'); 

    }
                
    adjustClaim(count) {

        debugger;  
        var index = count.count;
        var claim = this.adjustmentClaimList[index];
        this.props.handleSetClaimToAdjust(claim); 
        const { history: { push } } = this.props; 
        push('/claim'); 

    }
    payClaim(count) {
       
        debugger;  
        var index = count.count;
        var claim = this.adjustmentClaimList[index];
        var db = new Database();
        var form = {};
        form.action = "pay";    
        form.claimIdNumber = claim.ClaimIdNumber;
        form.date = this.getCurrentDate();
        form.plan = '';
        var userAmount = prompt("Please enter amount of payment...");
        var amt = parseFloat(userAmount);
        if(isNaN(amt)) {
            alert("please enter proper dollar amount...0");
            return;
        }
        form.amount = amt; 

        // add token
        form['_csrf'] = this.getToken();

        db.payClaim(form,this.baseUrl);

        var a = claim.ClaimIdNumber;
        var b = userAmount;
        var message = `Claim ${a} paid for $${b}.`;
        this.setMessage(message); 
        const { history: { push } } = this.props; 
        push('/update'); 
    }
    
 
    getCurrentDate = () => {

        var d = new Date();
        var today = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();  
        return today;
    }
    showClaims() {

        var out = []; 
        debugger; 
        // 1.14 add key and claim array for adjustment.
        var count = 0;
        var acount = 0;

        for (let claim of this.state.claims) { 
            debugger;
            acount = acount + 100;
            var k1 = acount + 1; // keys for react list.
            var k2 = acount + 2;
            var k3 = acount + 3;
            var k4 = acount + 4;
            var k5 = acount + 5;
            var k6 = acount + 6;
           // var k7 = acount + 7;
            var k8 = acount + 8;
            var k9 = acount + 9;
            var k10 = acount + 10;
            var k11 = acount + 11;
            var k12 = acount + 12;
            var k13 = acount + 13;
            var k14 = acount + 14;
            var k15 = acount + 15;
           // var k16 = acount + 16;

            // use table names please.

            //var { first, last, physician, clinic, procedure, diagnosis, service,
            //       description, plan } = claim;
            debugger;
            var id = claim.ClaimIdNumber.trim();
            var first = claim.PatientFirst.trim();
            var last  = claim.PatientLast.trim(); 
            var physician = claim.Physician.trim();
            var clinic = claim.Clinic.trim();
            var procedure = claim.Procedure1.trim();
            var diagnosis = claim.Diagnosis1.trim();
            var serviceDate = claim.DateService.substring(0,10);
            serviceDate = this.formatHistoryDate(serviceDate);
            var description = claim.ClaimDescription.trim();
            //var plan = claim.PlanId.trim();  
            debugger;
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
            debugger; 

            // if adjustmen requested pass to claim screen. 
            this.adjustmentClaimList[ count ] = claim; 

            var titleLine = <tr key={k1}><td className='pGoldenrod'>{id}{status1}</td>
                <td>{claimType}</td></tr>;
            var emptyLine = <tr key={k2}><td></td></tr>;

            var lineOneTitle = <tr key={k6}><td>Patient:</td><td>Service Date:</td><td>Clinic:</td><td>Physician:</td><td>Description:</td></tr>
            var lineOne = <tr key={k3}><td className='pGoldenrod'>{first}&nbsp;&nbsp;{last}</td><td className='sAqua'>{serviceDate}&nbsp;&nbsp;</td>
                <td>{clinic}&nbsp;&nbsp;</td>
                <td>{physician}</td> 
                <td>{description}</td>
            </tr>;

            var lineTwo = <tr key={k4}><td>Procedure:</td><td>Diagnosis:</td><td>Plan</td><td>Service:</td><td>Total Charge:</td><td>Covered:</td><td>Balance:</td></tr>;
        var lineThree = <tr key={k5}><td>{procedure}</td><td>{diagnosis}</td><td>{plan}</td><td className='sAqua'>{service}</td><td>${totalCharge}</td><td>${coveredAmount}</td><td>${balanceOwed}</td></tr>;
             
            out.push(titleLine);
            out.push(emptyLine);
            out.push(lineOneTitle);
            out.push(lineOne); 
            out.push(lineTwo);
            out.push(lineThree); 
          

            // type lines , baby!
            debugger;
            if(claimType === "Medical") { 
                var con = this.formatHistoryDate(claim.DateConfine);
                var rel = this.formatHistoryDate(claim.DateRelease);  
               
                var unused = "1753-01-01";
                var showConfine = (con === unused ) ? "" : con;
                var showRelease = (rel === unused ) ? "" : rel;
                var confineLit = (con === unused ) ? "" : "Confined:";
                var releaseLit = (rel === unused ) ? "" : "Released:";
                var showLine = (showConfine !== "" || showRelease !== "");  
                var medLine = <tr key={k8}><td>{confineLit} {showConfine} </td><td> {releaseLit} {showRelease} </td></tr>

                if(showLine) { 
                   out.push(medLine); 
                }
            }
            if(claimType === "Dental") {
                var tooth = claim.ToothNumber;
                var denLine = <tr key={k9}><td>Tooth Number: {tooth} </td></tr>
                out.push(denLine);
            }
            if(claimType === "Vision") {
                 var eyeware = claim.Eyeware;
                 var visionLine = <tr key={k10}><td>Eyeware: {eyeware} </td></tr>
                 out.push(visionLine);
            }
            if(claimType === "Drug") {
                var name = claim.DrugName;
                var drugLine = <tr key={k11}><td>Drug Name: {name} </td></tr>
                out.push(drugLine);
            }

            // if claim status is paid then
            // show payment information....
            debugger;
            if(status === "Paid") {
                var amount = "  $" + claim.PaymentAmount.toString().trim();
                var paymentDate = this.formatHistoryDate(claim.PaymentDate);
                var date = " " + paymentDate;
                var paymentLine = <tr key={k12}>
                    <td>Paid:</td>
                    <td>{amount}</td><td>
                    {date} </td></tr>
                out.push(paymentLine);
                //TODO: check 'payment plan'.
            }
            if(status === "Adjusted") {
                var a = " " + claim.AdjustingClaimId + " ";
                var adjustedDate = this.formatHistoryDate(claim.AdjustedDate);
                var b = " " + adjustedDate + " ";
                 var adjustedLine = <tr key={k13}>
                    <td>Adjusted by:{a}</td><td>
                    on:  {b} </td></tr>
                out.push(adjustedLine);
            }
            if(status === "Adjustment"){
                var c = " " + claim.AdjustedClaimId + " ";
                var adjustingLine = <tr key={k14}>
                    <td>Adjusting:{c}</td></tr> 
            out.push(adjustingLine);
            }

            if(status !== "Adjusted") {
                var adjButton =
                 <Button variant="primary" onClick={this.adjustClaim.bind(this,{count})}>Adjust</Button>
            }
  
              if(status!=="Paid" && status !== "Adjusted") {
                var payButton =
                 <Button variant="primary" onClick={this.payClaim.bind(this,{count})}>Pay Claim</Button> 
            } 

            var menuButton = <Button variant="primary" onClick={this.mainMenu.bind(this)}>Main Menu</Button>
      
            var actions = <tr key={k15}> 
                  <td>  {adjButton}  </td>
                  <td>  {payButton}  </td>
                  <td>  {menuButton} </td>
               </tr>;

             out.push(actions); 
    
             count++;
        }

        out.push(this.message);

        return( out );
        
    }

    formatHistoryDate = (value) => {

        var input = value.toString();
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
        claims = await database.getClaimHistory(custId, this.baseUrl); 
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

    componentDidMount = async () => {

        // check valid login

         // check for valid login
         var ok = this.isCustomerSignedIn();
         if(!ok) {
 
             const { history: { push } } = this.props; 
             push('/start');  
         }
 

        // load claim history data into 'claims'. 
        this.claims = await this.getClaimHistory(this.props.custId);  
    }

    render() { 

        var b1st = { 

            color: "white", 
            backgroundColor: "black",
            margin: "2px",
            fontSize:  "larger",
            fontFamily: "Arial" 
        
        }
  
       // var subHeader =  <tr><td className='hGreen'>patient</td><td className='hGreen'>service</td><td className='hGreen'>physician</td><td className='hGreen'>clinic</td></tr>
       
       var subHeader =  (  <tr>
        <th>Claim:</th> 
        </tr>); 
       
       var foundClaimHtml = <div></div>; // place holder do not call showClaims when none found.
        debugger;
        if(this.state.claimsFound) {

            var menuLine = 
            <Button style={b1st} variant="primary" onClick={this.mainMenu.bind(this)}>Main Menu</Button> ;

            foundClaimHtml = <div><Container> 
                <h2 className='dBlue'> Claim History </h2>
                <br/>
                {menuLine}
                <hr /> 
                <table><thead className="pWhite">
                {subHeader} 
                </thead><tbody>
                {this.showClaims()}
                </tbody></table>  
                {menuLine}
                </Container></div>;
        }

        var noClaimsFoundHtml = (<div><Container>

            <Row></Row>

            <Row> 
                 
                <h1 className="sAqua">Claim History</h1>
            </Row>
            <Row>
                <h2 className='dBlue'>Claim History no claims found </h2> 
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