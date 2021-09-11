
// Info.js 
import React from 'react';   
import '../css/style.css';   

class Info extends React.Component {

   

    render() {
 

        return(

            <div class='container'>   
            <br/>
          
            <div>
          
                    <h3  className="burleywood"> Information </h3> 
          
            </div> <br/>
          
            <div> 
          
            <p className="burleywood"> Use this app to register as a customer then enter and adjust claims.</p> 
  
          <ul>
            <li> register - Enter customer info : you will be prompted to select a customer
                identification number and password. A promotion code will be provided to
                allow registeration. 
            </li>
            <li> update - Revise customer information. </li>
            <li> plan - Assign a plan before claims can be filed. </li>
            
            <li> claim - Enter and submit a claim. You must select a claim type: medical, dental etc. </li>
                    
            
            <li> history - Review claim history. An option is provided to adjust a claim with a new one,
                or pay an existing claim. 
            </li>
            </ul>
          
            </div>
          
            
            <div> 

                  
            <p className="burleywood"> Style Feature</p> 
  
           
            <ul>
          
          <li> Clicking on style will change update and claim screen styles.  
               Available Styles: picture backgorund, solid or outline backgrounds with color link to
               change colors.
          </li>
          </ul>
          
          </div>
                
             
             
              <div>
                  
              <p className="burleywood"> An administration function is available for authorized individuals. </p>
 
                     
           <ul> 
              <li> 
                  Actions include: Password Reset, Customer Id Reset and Customer List functions are available.
              </li>
            
              </ul>
            </div>
             

          </div>
        );


    }

};

export default Info;