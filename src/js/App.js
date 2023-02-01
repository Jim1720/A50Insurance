
//  App.js

import React from 'react'; 
import NavArea from './NavArea'; 
import Frame from './Frame';
//import Utility from './Utility';  
import ScreenStyleFactory from './StyleFactory'; 
import ScreenStyleManager from './ScreenStyleManager'; 

class App extends React.Component { 

    message = '';    

    yes = "Y";

    // baseUrl = "** azure url **";

     baseUrl = "http://localhost:3200/";
    
    promotionCode = process.env.REACT_APP_A50_PROMOTION_CODE;

    emailValue = process.env.REACT_APP_A50_EMAIL === this.yes; 
    envUseStay = process.env.REACT_APP_A50_USE_STAY === this.yes; 
    envUseFocus = process.env.REACT_APP_A50_USE_FOCUS === this.yes; 
    envUseNav = process.env.REACT_APP_A50_USE_NAV === this.yes; 
    envUseActions = process.env.REACT_APP_A50_USE_ACTIONS === this.yes;


    needsToBeSet = 'unset';  

    factory = null; 
    screenStyleManager = null;
    initialSetup = "0";
    completedSetup = "1";
 

    actionList   = []; 
 
  


    constructor() {

        super();
        this.factory = new ScreenStyleFactory();
        this.screenStyleManager = new ScreenStyleManager();
 
    }
 

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
        token: '',
        refreshProp: "", 
        focusedClaim : "",
        beginningStay : false,
        beginningFocus : false 

    }  
 
      
    setToken = (input) => {  
 

        var data = JSON.parse(input);
        var a45Object = data['A45Object'];
        var token = a45Object['token'];
 

        this.setState({

            token: token 
        }); 

      }

      setBeginning = (selector, value) => {

            debugger;
            
            // pass (stay or focus), (false or true) 
            if(selector === "stay") {
 
                this.setState({  beginningStay: value  }); 
            }

            if(selector === "focus") {  
                this.setState({  beginningFocus: value  }); 
            } 
            // https://wareboss.com/react-force-update-on-a-functional-component-re-render/

            this.forceUpdate();  // beginningStay was not updating on hisory payment , force it.
  
      }

      getBeginning = (selector) => {
 
          
          // pass (stay or focus), (false or true)
          if(selector === "stay") {
 
            return this.state.beginningStay;

          }

          if(selector === "focus") {
 
             return this.state.beginningFocus;

          }
      }

      setFocusedClaim = (claimId) =>
      {
          // if already "" do not repeat.
          if(this.state.focusedClaim === "" &&
             claimId === "")
        {
            return; // avoid endles loop.
        }

          this.setState({

             focusedClaim : claimId

          });
  
      }
 

      setAction = (setActionObject) => { 

        // var setActionObject = { action: '', claimId : ''};
        
        var count = this.actionList.length; 

        switch(count) {
            case 0 : this.actionList.push(setActionObject); break; // add at end
            case 1 : this.actionList.push(setActionObject); break;
            case 2 : this.actionList.shift();  // remove 1st element 
                     this.actionList.push(setActionObject); break; // add new at end
            default: break;
        } 
      }

      getAction = (number) => { 
        
        // returns object with = { action: '', claimId : ''}; 

        var count = this.actionList.length;
        if(number >= count )  {

            return { data: false,  action: '', claimId : '' };

        };
        var act  = this.actionList[number];
        var action = act["action"];
        var claimId = act["claimId"];

        return { data: true, action: action , claimId : claimId };

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
       // var u = new Utility();
       // u.showProperties(this.state.cust);

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

    handleClearAdjustmentFlag = () => {

        // once adjustment processed clear the flag.
        this.setState({

            claimToAdjust: null

         });  
    }


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
   
   

    handleNextStyle = (screen) => {

        // called when style  link clicked pass to nav area
        // this will incriment the color in the screen style object. 
      
        // is this screen authorized to use styles?
        // call style manager to check screen list 
        var doesThisScreenUseStyles = this.screenStyleManager.authorizeStyles(screen);
        if(!doesThisScreenUseStyles) {
            return; // it doesn't..
        }
        // it does.... 
        this.factory.getNextStyle(screen);  
        //
        this.screenReRender();
        
    }

    screenReRender()
    {
        // rerender screen on changes to style or color 
        var currentRefreshProp = this.state.refreshProp;
        var newRefreshProp = "";
        switch(currentRefreshProp)
        {
            case "" :  newRefreshProp = "1"; break;
            case "1":  newRefreshProp = ""; break;
            default: break;

        } 
        // force screen rerender.
        this.setState({refreshProp: newRefreshProp}); 
    }

    handleNextColor = (currentScreenDisplayed) => {

        // called when color link clicked pass to nav area
        // this will incriment the color in the screen style object.
        debugger;
        this.factory.getNextColor(currentScreenDisplayed);  
        //
        this.screenReRender();
    }

    fetchScreenStyleInformation = (screen) => {

        /* we will always have one since the handleLoadScreenFile 
           is called during routing to screen navigations in the
           navApp logic. It needs to be done there so we do not
           get into a render loop due to needed state changes
           before screen loads.
        */
 
        // reads or creates screen style object 
        var screenStyleObject = this.factory.getCurrentStyleForScreen(screen); 
        return screenStyleObject;
    }

    handleLoadScreenStyle = (loadingScreenName) => {

        // needs to be connected to router event
        // so when screen is selected state will
        // be set with screen initial style and color then
        // when those are changed the component should
        // refresh.

        // screens call this before rendering pass to screen
        // when screen loads determine color values

        // returns null if no matching style so
        // caller must check for nulls. 
        var useStyles = this.screenStyleManager.authorizeStyles();
        if(!useStyles) {

            return; 
        }

        // get or create style object for this screen.
        var screenStyleObject = this.factory.getStyleObjectToLoadScreenStyleColors(loadingScreenName);
        var weDoNotHaveOne = screenStyleObject === null;
        if(weDoNotHaveOne) { 
            
            // make a new one.
            screenStyleObject = this.factory.getNewStyleObject(loadingScreenName); 

        } 
        // set the style and color links 
        this.setStyleAndColorLinks(screenStyleObject);
        //
        return screenStyleObject;

    }

    setStyleAndColorLinks = (screenStyleObject) => {

        debugger;
        var styleLinkValue = screenStyleObject.getStyle();
        var colorLinkValue = screenStyleObject.getColor();
        this.setState({

             styleLinkValue: styleLinkValue,
             colorLinkValue: colorLinkValue

        }); 


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
             statushelper = {this.statushelper}   
             fetchScreenStyleInformation = {this.fetchScreenStyleInformation}
             handleNextStyle = {this.handleNextStyle}
             handleNextColor = {this.handleNextColor}   
             
           />  

           

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
                   fetchScreenStyleInformation = {this.fetchScreenStyleInformation}
                   refreshProp = {this.RefreshProp}
                   handleClearAdjustmentFlag  = {this.handleClearAdjustmentFlag}
                   promotionCode = {this.promotionCode}
                   emailValue = {this.emailValue}
                   envUseStay = {this.envUseStay}
                   envUseFocus = {this.envUseFocus}
                   envUseNav = {this.envUseNav}
                   envUseActions = {this.envUseActions}   
                   setAction = {this.setAction}
                   getAction = {this.getAction}
                   setBeginning = {this.setBeginning}
                   getBeginning = {this.getBeginning}
                   beginningStay = {this.state.beginningStay}
                   beginningFocus = {this.state.beginningFocus}
                   focusedClaim = {this.state.focusedClaim}
                   setFocusedClaim = {this.setFocusedClaim}   

                 />  
        </div>); 
    } 
}

export default App;