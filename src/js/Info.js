
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
          
            <p className="burleywood"> Use this app to register as a customer then enter, adjust and pay claims.</p> 
  
          <ul>
            <li> Register - Enter customer info. You will be prompted to select a customer
                identification number and password.  
            </li>
            <li> Update - Allows updates to customer information. </li>
            <li> Plan - Assign a plan before claims can be filed. </li>
            
            <li> Claim - Enter and submit a claim. You must select a claim type: medical, dental etc. </li>
                    
            
            <li> History - Review claim history. An option is provided to adjust a claim with a new one,
                or pay an existing claim. A row of actions appear after each claim. You can use:
                claim (new claim), Adjust or Pay the claim. Stay on returns you immediately to the claim
                screen. Focus on positions at the operative claim.
            </li>
            <li>
              Style - the update and claim screens have a style option that allows you to
              adjust the look of the screen. The color link allows you to change colors.
            </li>

            <li>
              An administrative option exists for site admins and is restricted.
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