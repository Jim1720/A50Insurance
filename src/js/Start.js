
// Start.js
 
import React from 'react';  

import '../css/style.css';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';   

import welcomePic from '../images/lake.jpg';
//import { withRouter } from 'react-router-dom';
 

class Start extends React.Component {

    friendlyDate = '';

    info = (e) => {
        e.preventDefault();   
        let path = '/info';
        this.props.history.push(path);
    }

    about = (e) => {
        e.preventDefault();   
        let path = '/about';
        this.props.history.push(path);
    }

    register = (e) => {
        e.preventDefault();   
        let path = '/register';
        this.props.history.push(path);  
    }

    handleRegister = (e) => {

        e.preventDefault();   
        let path = '/register';
        this.props.history.push(path);
    }

    handleSignIn = (e) => {

        e.preventDefault();   
        let path = '/signin';
        this.props.history.push(path);
    }

    getCurrentDate = function() { 

        var d = new Date(); 
        let yyyy = d.getFullYear(); 
        let dd = d.getDate(); 
        let hh = d.getHours();
        let mi = d.getMinutes();
        let ss = d.getSeconds();  
        let monthLiteral = this.findMonth(d.getMonth());
        var date = monthLiteral + ' '  + dd + ' ' + yyyy + ' ' + hh + ':' + mi + ':' + ss; 
        return date;
    }


    findMonth = function(value) {

           var months = ['January', 'Feburary', 'March', 
                         'April', 'May', 'June', 'July', 'August', 
                         'September','October','November','December'];

            return months[value];

     }
 

   render() {
 
        this.friendlyDate = this.getCurrentDate();    
        var welcome = "Welcome to A50 Insurance"
        var whatToShow = "Now is a great time to buy insurance!" 

        var h1style =  { 
                
             color: "burleywood",
             fontFamily: "Arial"
        }
      
 
        var b1st = {

            color: "white",  
            margin: "2px",
            fontSize:  "larger",
            fontFamily: "Arial" 

        }
 
        var gray = {

            color: "gray"

        }

       
         
         
        return (<Container>
            <br></br>
            <Row> 
            <h1 style={h1style} className="welcomeTitle">{welcome}</h1> <br/> 
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
            <Image src={welcomePic} alt="pic" width='600' height='340' />
            </Row>
            <br></br>
            <Row>
            <h3 style={h1style} className='welcomeTitle'>{whatToShow}</h3>  
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
            <Button style={b1st} variant="outline-primary" onClick={this.handleRegister}>Register as new Customer</Button>  
            <Button style={b1st} variant="outline-primary" onClick={this.handleSignIn}>Sign in as existing Customer</Button>   
            </Row>

            <footer width='95%'> 
                
                    <br/><br/><br/><br/>
                    <span className='bw'>2019 - A50Insurance - React &nbsp; </span>
                    <span  className='t1' style={gray}>Find out info here &nbsp;</span> 
                    <a href="/info" onClick={this.info}  className="bw">Info</a>
                    <span  className='t1' style={gray}>&nbsp; Find about here...&nbsp;</span>
                    <a href="/about" onClick={this.about}  className="bw">About</a>
                    <span className='t1' style={gray}>&nbsp; Time to buy...</span>
                    <a  href="/register" onClick={this.handleRegister} className="bw">{this.friendlyDate}</a>
                    <span className='t1' style={gray}> This is a demonstration website</span>
    
               </footer>

       </Container>);



    }

} 

export default Start;