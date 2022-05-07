
// Classic.js
 
import React from 'react';
 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
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

     var b2st = {

      color: "white",  
      margin: "2px",
      fontSize:  "larger",
      fontFamily: "Arial"  
  
       }

     var btnDown = {

      marginTop: "100px"

     }

     var h1style2 =  { 
                  
        color: "lightskyblue",
        fontFamily: "Arial",
        fontStyle: "Italic",
        marginTop: "25px"
     }

 

    var p = {
      color: "white"
    }
 

    var h3down = {

      marginTop: "45px"

    }
 

     var whatToShow = "Now is a great time to buy insurance!" 
      
      var welcome = "Welcome to A50 Insurance";
        
        return (<Container>

            <br></br>
            <Row>

            <Col sm={2}>
            <Row className="justify-content-md-center" style={btnDown}>
            <h3>New customer?</h3>
            <p style={p}>
                Please register customer information here.
            </p> 
            <Button style={b1st} variant="primary" onClick={this.goSomewhere.bind(this,'/register')}>Register</Button>  
            <h3 style={h3down}>Existing customer?</h3>
            <p style={p}>
                Update customer and policy info.
            </p>
            <Button style={b2st} variant="primary" onClick={this.goSomewhere.bind(this,'/signin')}>Sign in</Button>   
           </Row>
           </Col>

            <Col sm={8}>
            <Row> 
            <h1 style={h1style} className="welcomeTitle">{welcome}</h1> <br/>  
            </Row>  
            <br/> 

            <Row className="justify-content-md-center">
            <Carousel>
              <Carousel.Item interval="9000">
                <Image style={r1} src={road} alt="pic" width='600' height='450' />
                <Carousel.Caption> 
                  <p>Now is a good time to buy insurance !</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval="9000"> 
                <Image style={r1} src={sunset} alt="pic" width='600' height='450' />   
                <Carousel.Caption> 
                  <p>Best Rates here!</p>
                </Carousel.Caption>
              </Carousel.Item>
            <Carousel.Item interval="9000">
               <Image style={r1} src={lake} alt="pic" width='600' height='450' /> 
               <Carousel.Caption> 
                   <p>Wholesale Coverage!</p>
              </Carousel.Caption>
              </Carousel.Item>
              </Carousel>
         </Row>
         <Row>
            <h1 style={h1style2} className='welcomeTitle'>{whatToShow}</h1>  
          </Row>
         </Col>
           
        </Row>
      
        </Container>);
    }

}

export default Classic;