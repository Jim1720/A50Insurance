
// Hub.js

// landing screen for user to display propt and status.

/* this screen is depricated functions moved to update screen as of 3.11.20 */  

import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image'; 
import Container from 'react-bootstrap/Container'; 
 
import { withRouter } from 'react-router-dom';  // was react-router-dom now react-router.

import welcomePic from '../images/lake.jpg'; 
import '../css/style.css';      

class Hub extends React.Component { 

      planMessage;
      claimMessage;

      isCustomerSignedIn = this.props.isCustomerSignedIn; 
      getMessage = this.props.getMessage;
      handleSignOut = this.props.handleSignOut;

      mainMessage = '';

      constructor(props) {

        super(props);

        debugger;
        // check for valid login
        var ok = this.isCustomerSignedIn();
        if(!ok) {

            const { history: { push } } = this.props; 
            push('/start');  
        }
 
        // post claim add messages (adj? pay?)
        // welcom: signin, register. use new mainMessage
        // above buttons, edits stay below buttons.
        var msg = this.getMessage();
        if(msg !== null && msg !== '') {

           this.mainMessage = msg; 
        }

      }

    fileCLaim = (e) => {

        e.preventDefault();
        const { history: { push } } = this.props; 
        push('/claim');

    }

    updateInfo = (e) => {

        e.preventDefault();
        const { history: { push } } = this.props; 
        push('/update');

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

    seeHistory = (e) => {

        e.preventDefault();
        const { history: { push } } = this.props; 
        push('/history');

    }


    render() { 
 
        var currentPlan = this.props.currentPlan;   

        if(currentPlan === "none") {

            this.planMessage = (

                 <Row className="justify-content-md-left">
                <ul>
                    <li><p className="normalText">You need to select a Plan!</p></li>  
                </ul></Row>)


         }
         else {

            this.planMessage = (

            <Row className="justify-content-md-left">
            <ul>
                <li><p className="normalText">Assigned Plan: {currentPlan}</p></li>  
            </ul></Row>)
               
         } 
 

         var claimCount = this.props.claimCount;
         
        
         if(claimCount === 0) {
             this.claimMessage = (
            <Row className="justify-content-md-left">
            <ul>
                <li><p className="normalText">No Claims have been submitted</p></li>  
            </ul></Row>)

         } else
         {
            this.claimMessage = (
                <Row className="justify-content-md-left">
                <ul>
                    <li><p className="normalText">{claimCount} Claims have been submitted</p></li>  
                </ul></Row>)

         }

         var b1 = {

            marginRight: "10px",
            fontSize: "larger"

         }

         var r1 = {
            borderRadius: "25px"
        }

        return (<Container>

            <br></br>
            <Row> 
            <h1 className="welcomeTitle">Main Menu</h1> <br/> 
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
            <Image style={r1} src={welcomePic} alt="pic" width='800' height='400' />
            </Row> 
            <br></br>
            <Row className="justify-content-md-center">
                
            <Button  style={b1} variant="primary" onClick={this.updateInfo}>Update Your Information</Button> 
            <Button  style={b1} variant="primary" onClick={this.fileCLaim}>File Claim</Button>
            <Button  style={b1} variant="primary" onClick={this.seeHistory}>Claim History</Button>
            <Button  style={b1} variant="primary" onClick={this.selectPlan}>Select Plan</Button> 
            <Button  style={b1} variant="primary" onClick={this.signOut}>Sign Out</Button>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <div className="menumessage">{this.mainMessage}</div>
            </Row>
            
            </Container>);

    } 

}

export default withRouter(Hub);