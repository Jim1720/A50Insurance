
// About.js 
import React from 'react';   
import '../css/style.css';   

class About extends React.Component {

   

    render() {

        var white = { color: "white"}
         

        return(

            <div class='container'>   
            <br/>
          
            <div>
          
                    <h3 className="burleywood"> About </h3> 
          
            </div> <br/>
          
            <div> 
          
              <p style={white}> A50Insurance - written in react.</p>
          
            </div> 
            
              </div>



        );


    }

};

export default About;