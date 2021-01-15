
//  App.js

import React from 'react'; 
import NavArea from './NavArea'; 
import Frame from './Frame';
import Utility from './Utility';   

class App extends React.Component {

    

    message = '';  
    baseUrl = 'http://localhost:3200/'; // constructor does not run. workaround. 
  
    needsToBeSet = 'unset'; 
 

    emptyCustomer = { 

        custId: '',
        custPass: '',
        custFirst: '',
        custLast: '',
        custEmail: '',
        custPhone: '',
        custAddr1: '',
        custAddr2: '',
        custCity: '',
        custState: '',
        custZip: '',
        plan: '',
        appId: 'A50',
        custPass2: '',
        promo: '',
        custMiddle: '',
        custGender: '',
        custBirthDate: '',
        Encrypted: '',
        PromotionCode: '',
        extendColors: '',
        PolicyID: ''
    } 

    state = {

        cust: this.emptyCustomer,  
        statushelp: '',
        signedIn : false,
        adminSignedIn: false,
        resgistering: false,
        token: ''

    }   
 
      
    setToken = (input) => {  

        debugger;

        var data = JSON.parse(input);
        var a45Object = data['A45Object'];
        var token = a45Object['token'];
 

        this.setState({

            token: token 
        }); 

      }

      getToken = () => {

        return this.state.token; 
      }

      getMessage = () => {

         var message = this.message;
         this.message = '';
         return message;

      }

      setMessage = (value) => {

          this.message = value;
      }

     handleSignIn = (cust) => {    
        
        this.setState({ 
            
            cust:  cust,
            signedIn: true,
            registering: false  

        });  
        var u = new Utility();
        u.showProperties(this.state.cust);

    } 
  

    handleSignOut = () => {   
 
        debugger; 

        this.setState({

            cust:  '',
            signedIn: false,
            registering: false 
     
        });
       
 
    }

    isCustomerSignedIn = () => {

        // update, claim, history use this to check proper sign in.
        // plan confirm , reg confirm 
        return this.state.signedIn;
    }

    handleAdminSignIn = () => {

        // called in admin 
        this.setState({

            adminSignedIn: true

        });
    }

    isAdminSignedIn = () => {

        // admin action, admin customer list use this to check proper sign in.
        return this.state.adminSignedIn;
    }
    handleAdminSignOut = () => {

        // called when customer signs on 

        this.setState({
            adminSignIn: false
        });
    }
 
    handleSetClaimToAdjust = (claim) => {
 
         // history screen passed claim for adjustment
         // make it available to claim screen.
 
         this.setState({

            claimToAdjust: claim

         });  
         
    };

    handleRegisterStatus = () => { 

          this.setState({   
            // removed this cust: this state cust.
             registering: true
        });
    }

    setPlan = (selectedPlan) => {
 
        let copy = this.state.cust;
        copy.custPlan = selectedPlan;

        this.setState({

            cust : copy

        }); 
 
    }
 

    handleUpdateForm = (updatedCustomer) => {
 
        debugger;
        this.setState({ 
            
          cust: updatedCustomer

        }); 
 
        //var u = new Utility();
        //u.showProperties(this.state.cust);

    }
 
 
    statushelper = (info) => {

        // register, update use this to get info from those components.
        // pass parm to status to supply more info in status display.
        // could not use {match} due to passing back and forth because
        // router at lower levels (bowels) of app hopefully this is simpler.
        // 2.22. info will be register, update.

        // only use in constructors do not use in render: inf loop. 
        this.setState({ statushelp: info }) 
 

    }

    render() {

        var first = this.state.cust.custFirst;
        var last = this.state.cust.custLast; 
        var custId = this.state.custId; 
        var custPlan = this.state.custPlan;
        var statushelp = this.state.statushelp; 
        
        return(<div>   

            <NavArea signedIn={this.state.signedIn}
             handleSignOut={this.handleSignOut} 
             first={first} 
             last={last}
             custId={custId}
             handleRegisterStatus={this.handleRegisterStatus}
             registered={this.state.registered}
             cust={this.state.cust} 
             statushelp={statushelp} 
             statushelper = {this.statushelper} />  

            <Frame handleSignIn={this.handleSignIn}
                   handleSignOut={this.handleSignOut}
                   setPlan={this.setPlan} 
                   currentPlan={this.state.cust.plan}
                   cust = {this.state.cust} 
                   handleUpdateForm = {this.handleUpdateForm} 
                   claims = {this.state.cust.claims} 
                   first = {first} 
                   last = {last} 
                   custId={custId}
                   custPlan={custPlan}
                   registered = {this.state.registered}
                   statushelper = {this.statushelper}
                   claimToAdjust = {this.state.claimToAdjust} 
                   handleSetClaimToAdjust = {this.handleSetClaimToAdjust}
                   baseUrl = {this.baseUrl}  
                   isCustomerSignedIn = {this.isCustomerSignedIn}
                   handleAdminSignIn = {this.handleAdminSignIn}
                   handleAdminSignOut = {this.handleAdminSignOut}
                   isAdminSignedIn = {this.isAdminSignedIn}
                   getMessage = {this.getMessage}
                   setMessage = {this.setMessage}
                   setToken = {this.setToken}
                   getToken = {this.getToken}

                 />  
        </div>); 
    } 
}

export default App;