
// Hub.js

// landing screen for user to display propt and status.

/* this screen is depricated functions moved to update screen as of 3.11.20 */  

import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image'; 
import Container from 'react-bootstrap/Container'; 

import { withRouter } from 'react-router-dom'; 

import welcomePic from '../images/lake.jpg'; 
import '../css/style.css';      

class Hub extends React.Component { 

      planMessage;
      claimMessage;

      isCustomerSignedIn = this.props.isCustomerSignedIn; 
      getMessage = this.props.getMessage;

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
        const { history: { push } } = this.props; 
        push('/signout');

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
        var goldenrod = { color: "goldenrod" } 

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

        return (<Container>

            <br></br>
            <Row> 
            <h1 className="welcomeTitle">Main Menu</h1> <br/> 
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
            <Image src={welcomePic} alt="pic" width='600' height='340' />
            </Row> 
            <br></br>
            <Row className="justify-content-md-center">
                
            <Button variant="outline-primary" onClick={this.updateInfo}>Update Your Information</Button> 
            <Button variant="outline-primary" onClick={this.fileCLaim}>File Claim</Button>
            <Button variant="outline-primary" onClick={this.seeHistory}>Claim History</Button>
            <Button variant="outline-primary" onClick={this.selectPlan}>Select Plan</Button> 
            <Button variant="outline-primary" onClick={this.signOut}>Sign Out</Button>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
                <div style={goldenrod}>{this.mainMessage}</div>
            </Row>
            
            </Container>);

    } 

}

export default withRouter(Hub);