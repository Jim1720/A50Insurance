// Frame.js

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Start from './Start'; 
import Register from './Register'; 
import Signin from './Signin';
import Classic from './Classic';
import About from './About'; 
import Info from './Info';
import Update from './Update'; 
import Hub from './Hub';
import Claim from './Claim';
import Plan from './Plan'; 
import ClaimHistory from './ClaimHistory'; 
import Regconfirm from './Regconfirm';
import Planconfirm from './Planconfirm';
import Admin from './Admin';
import AdminAction from './AdminAction';
import AdminCustomerList from './AdminCustomerList';
 
class Frame extends React.Component {  



    render() { 
        
        var handleSignIn = this.props.handleSignIn; 
        var handleSignOut = this.props.handleSignOut;
        var setPlan = this.props.setPlan;
        var currentPlan = this.props.cust.plan;
        var cust = this.props.cust;
        var handleUpdateForm = this.props.handleUpdateForm; 
        var fileClaim = this.props.fileClaim; 
        var claims = this.props.claims;  
        var claimCount = (claims == null) ? 0 : claims.length;  
        var first = cust.custFirst;
        var last = cust.custLast; 
        var registered = this.props.registered; 
        var statushelper = this.props.statushelper;
        var custId = this.props.cust.custId; 
        var custPlan = this.props.cust.custPlan;
        var claimToAdjust = this.props.claimToAdjust;
        var handleSetClaimToAdjust = this.props.handleSetClaimToAdjust; 
        var baseUrl = this.props.baseUrl;  
        var isCustomerSignedIn = this.props.isCustomerSignedIn;
        var handleAdminSignOut = this.props.handleAdminSignOut;
        var handleAdminSignIn = this.props.handleAdminSignIn;
        var isAdminSignedIn = this.props.isAdminSignedIn;
        var getMessage = this.props.getMessage;
        var setMessage = this.props.setMessage; 
        var setToken = this.props.setToken;
        var getToken = this.props.getToken;  
        var fetchScreenStyleInformation = this.props.fetchScreenStyleInformation;
        var handleLoadScreenStyle = this.props.handleLoadScreenStyle;  
        var promotionCode = this.props.promotionCode;
        var emailValue = this.props.emailValue;
         
        

        
        return (


            <Switch>

                {/* define app routes used by Navarea and buttons in the application */} 

                <Route exact path="/"   component={Start}/>
                <Route path="/start"    component={Start}/>
                <Route path="/classic"  component={Classic}/>

                {/* need sign in and sign out functions */}

                <Route path="/register" render={ () => <Register handleSignIn={handleSignIn} 
                                                                 statushelper={statushelper}
                                                                 handleUpdateForm={handleUpdateForm} 
                                                                 baseUrl = {baseUrl} 
                                                                 setMessage = {setMessage}
                                                                 setToken = {setToken} 
                                                                 handleLoadScreenStyle = {handleLoadScreenStyle}
                                                                 fetchScreenStyleInformation = {fetchScreenStyleInformation} 
                                                                 refreshProp = {this.refreshProp}  
                                                                 promotionCode = {promotionCode}
                                                                 emailValue = {emailValue}
                                                                 />}/>

                <Route path="/signin"   render={ () => <Signin   handleSignIn={handleSignIn}
                                                                 cust={cust}
                                                                 registered = {registered}
                                                                 baseUrl = {baseUrl}
                                                                 setMessage = {setMessage}
                                                                 handleAdminSignOut = {handleAdminSignOut} 
                                                                 setToken = {setToken}/>}/> 

                {/* */}
                <Route path="/update"   render={ () => <Update currentPlan={currentPlan} 
                                                               startCust={cust} 
                                                               statushelper={statushelper}
                                                               handleUpdateForm={handleUpdateForm}
                                                               handleSignOut={handleSignOut}
                                                               baseUrl = {baseUrl}
                                                               isCustomerSignedIn={isCustomerSignedIn} 
                                                               getMessage = {getMessage}
                                                               getToken = {getToken}  
                                                               handleLoadScreenStyle = {handleLoadScreenStyle}
                                                               fetchScreenStyleInformation = {fetchScreenStyleInformation}
                                                               refreshProp = {this.refreshProp}
                                                             /> }/> 
            
                <Route path="/about"    component={About}/> 

                <Route path="/info"    component={Info}/>   

                <Route path="/hub"       render={ () => <Hub  currentPlan={currentPlan}  
                                                              claimCount={claimCount}
                                                              getMessage = {getMessage}
                                                              isCustomerSignedIn={isCustomerSignedIn} />} /> 

                <Route path="/claim"     render={ () => <Claim fileClaim={fileClaim} 
                                                               custId={custId}
                                                               custPlan={custPlan}
                                                               claimToAdjust={claimToAdjust}
                                                               baseUrl = {baseUrl}
                                                               isCustomerSignedIn = {isCustomerSignedIn}
                                                               setMessage = {setMessage}
                                                               getToken = {getToken} 
                                                               handleLoadScreenStyle = {handleLoadScreenStyle}
                                                               fetchScreenStyleInformation = {fetchScreenStyleInformation}
                                                               refreshProp = {this.refreshProp}  
                                                               handleClearAdjustmentFlag = {this.props.handleClearAdjustmentFlag}
                                                               />} />

                <Route path="/plan"      render={ () => <Plan setPlan={setPlan}
                                                              currentPlan={currentPlan}
                                                              cust={cust}
                                                              setMessage = {setMessage}
                                                              baseUrl = {baseUrl} 
                                                              isCustomerSignedIn = {isCustomerSignedIn}
                                                              getToken = {getToken}/> } />

                <Route path="/history"   render={ () => <ClaimHistory claims={claims} 
                                                first={first}
                                                last={last}
                                                custId={custId}
                                                handleSetClaimToAdjust={handleSetClaimToAdjust}    
                                                baseUrl = {baseUrl}
                                                isCustomerSignedIn = {isCustomerSignedIn} 
                                                setMessage = {setMessage}
                                                getToken = {getToken} />} />


                 <Route path="/regconfirm" render={

                   () => <Regconfirm  isCustomerSignedIn={isCustomerSignedIn}   
                                      setMessage={setMessage}   />

                 } />

                <Route path="/planconfirm" render={

                   () =>  <Planconfirm  isCustomerSignedIn={isCustomerSignedIn} 
                                        setMessage={setMessage}     />

                } /> 

                <Route path="/admin" render={ () => <Admin baseUrl={baseUrl}
                                     handleAdminSignIn = {handleAdminSignIn} 
                                     setToken = {setToken}   />} />
                                    
                
                <Route path="/adminaction" render={ () => <AdminAction
                                           baseUrl = {baseUrl}
                                           isAdminSignedIn = {isAdminSignedIn}
                                           getToken = {getToken}/> } />

                <Route path="/admincustomerlist" 
                       render={ () => <AdminCustomerList
                                       isAdminSignedIn = {isAdminSignedIn}
                                       baseUrl = {baseUrl}/> } />
                                                 
                
                 <Route path="*"    component={Start}/>


           </Switch>
        

        ); 
    }

}

export default Frame;