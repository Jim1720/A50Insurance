
// Info.js 
import React from 'react';  

class Info extends React.Component {

   

    render() {

        var white = { color: "white"}
        
        var gold = { color: "gold"}

        return(

            <div class='container'>   
            <br/>
          
            <div class="gold">
          
                    <h3> Info </h3> 
          
            </div> <br/>
          
            <div class="gold"> 
          
              <p class='para'> Information:</p>
          
            </div>
          
            
            <div style={white} class="row"> 
          
                <p style={gold} class='para'> Use this app to register as a customer then enter and adjust claims.</p> 
          
                <ul>
                  <li> register - Enter customer info : you will be prompted to select a customer
                       identification number and password. 
                  </li>
                  <li> update - Revise customer info. </li>
                  
                  <li> claim - Enter and submit a claim. You must select a claim type: medical, dental etc. </li>
               
               
               <li> history - Review claim history. An option is provided to adjust or pay a claim. </li>
                </ul>
          
          </div>
                
             
             
              <div style={white} class='row'>
                  
                <p style={gold} class="para"> An administration function is available for authorized individuals. </p>
              </div>
          
              
              <div style={white} class='row'>
                   <ul> 
                      <li> 
                          Password Reset, Customer Id Reset and Customer List functions are available.
                      </li>
                    
                      </ul>
                </div>
            
              </div>



        );


    }

};

export default Info;