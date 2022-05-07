
// Start.js
 
import React from 'react';  

import '../css/style.css';
 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';   

import welcomePic from '../images/lake.jpg'; 
 

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
             fontFamily: "Arial",
             fontStyle: "Italic"
        }
      
        var h1style2 =  { 
                
            color: "lightskyblue",
            fontFamily: "Arial",
            fontStyle: "Italic"
       }
    
        var r1 = {
            borderRadius: "25px"
        }
 
        var a1 = {

            color: "white"

        }

        var a2 = {

            color: "aqua"

        }

        var footstyle = {

            marginTop: "35px"
        }
         
         
        return (<Container>
            <br></br>
            <Row> 
            <h1 style={h1style} className="welcomeTitle">{welcome}</h1> <br/> 
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
            <Image style={r1} src={welcomePic} alt="pic" width='600' height='340' />
            </Row>
            <br></br>
            <Row>
            <h1 style={h1style2} className='welcomeTitle'>{whatToShow}</h1>  
            </Row>
           
            <footer width='95%' style={footstyle}> 
                
                    <br/><br/><br/>
                    <span style={a1}>2019 - A50Insurance - React &nbsp; </span>
                    <span  style={a1} >Find out info here &nbsp;</span> 
                    <a href="/info" onClick={this.info}  style={a2}>Info</a>
                    <span  style={a1} >&nbsp; Find about here...&nbsp;</span>
                    <a href="/about" onClick={this.about}  style={a2}>About</a>
                    <span style={a1} >&nbsp; Time to buy...</span>
                    <a  href="/register" onClick={this.handleRegister} style={a2}>{this.friendlyDate}</a>
                    <span style={a1}> This is a demonstration website</span>
    
               </footer>

       </Container>);



    }

} 

export default Start;