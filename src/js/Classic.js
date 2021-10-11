
// Classic.js
 
import React from 'react';
 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';


import road from '../images/lake.jpg'; 
import sunset from '../images/sunset.jpg'; 
import lake from '../images/lake.jpg';


import '../css/style.css';

class Classic extends React.Component {

    goSomewhere = (destination,e) => { 
       
      const { history: { push } } = this.props; 
      push(destination);  

    }


    render() {

      var h1style =  { 
                
        color: "burleywood",
        fontFamily: "Arial"
   }

   var r1 = {
    borderRadius: "25px"
   }

   var b1st = {

    color: "white",  
    margin: "2px",
    fontSize:  "larger",
    fontFamily: "Arial" 

     }

      
      var welcome = "Welcome to A50 Insurance";
        
        return (<Container>

            <br></br>
            <Row> 
            <h1 style={h1style} className="welcomeTitle">{welcome}</h1> <br/>  
            </Row>  
            <br/> 

            <Row className="justify-content-md-center">
            <Carousel>
              <Carousel.Item interval="9000">
                <Image style={r1} src={road} alt="pic" width='600' height='340' />
                <Carousel.Caption> 
                  <p>Now is a good time to buy insurance !</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval="9000"> 
                <Image style={r1} src={sunset} alt="pic" width='600' height='340' />   
                <Carousel.Caption> 
                  <p>Best Rates here!</p>
                </Carousel.Caption>
              </Carousel.Item>
            <Carousel.Item interval="9000">
               <Image style={r1} src={lake} alt="pic" width='600' height='340' /> 
               <Carousel.Caption> 
                   <p>Wholesale Coverage!</p>
              </Carousel.Caption>
              </Carousel.Item>
              </Carousel>
         </Row>
          
          <Row> <br/> </Row>
          <Row className="justify-content-md-center" >
            <Button style={b1st} variant="outline-primary" onClick={this.goSomewhere.bind(this,'/register')}>Register as new Customer</Button>  
            <Button style={b1st} variant="outline-primary" onClick={this.goSomewhere.bind(this,'/signin')}>Sign in as existing Customer</Button>   
            </Row>
      
        </Container>);
    }

}

export default Classic;