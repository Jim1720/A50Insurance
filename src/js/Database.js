
// Database.js

// 3.6 - set up axios to call server
// npm install axios

 
import axios from 'axios';    
 

 export class Database  { 
        
      
    // add this function for authentication and token return
    // when customer signs in. Requires Id and Password to be used.
    signinCustomer =  async (enteredId, enteredPassword ,baseURL) => {

        try { 

        // app-note: customer object is returned since we need it in 'update plan'. 
        // this refers to calling context. passed along to callback. 
        var error = null; 
        const response = await this.databaseCallSignin(enteredId, enteredPassword, error,baseURL);  
        return response;

       
    } catch (error) {

        console.log('checkDatabase: bad result:' + error);  
        return null; 
    }
   
} 

        
        // leave for register checking of dup customers.
        getCustomer =  async (enteredId,baseURL) => {

             try { 

            // app-note: customer object is returned since we need it in 'update plan'. 
            // this refers to calling context. passed along to callback.  
             var error = '';
             const reply = await this.databaseCall(enteredId, error,baseURL);   
             var info = reply.data;  
             var customer = info["Customer"];
             var found = info["Status"] === "Successful";
             // comments say we need customer object for 'update plan' !
             var response = { Found: found, Customer: customer };
             return response;
 
        } catch (error) { 
            console.log('getCustomer: error condition:' + error.message); 
            var errorResponse = { Found: false, Customer: null};
            return errorResponse;
        } 
    } 


    // returns true false

    registerCustomer = async (cust, baseURL) => {

        debugger; 
        var instance = axios.create({
            baseURL: baseURL,
            timeout: 4000
        }); 
        var url = "/register";
        debugger;
        try { 
              debugger;
              var res =  await instance.post(url,cust);
              debugger; 
              return res;

        } catch (error) {

            debugger;
            console.log('axios - error: ' + error.message);

        }


        return true;    
    }

    updateCustomer = async (cust,baseUrl) => {

        debugger; 
        var instance = axios.create({
            baseURL: baseUrl,
            timeout: 4000
        }); 
        var url = "/update";
        debugger;
        try { 
              debugger;
              var res2 =  await instance.put(url,cust);
              debugger; 
              return res2.status;

        } catch (error) {

            debugger;
            console.log('axios - error: ' + error.message);

        }
        return true;
    } 

    
    updatePlan  = async (planParms, baseUrl) => {

        debugger; 
        var instance = axios.create({
            baseURL: baseUrl,
            timeout: 4000
        }); 
        var url = "/updatePlan";
        debugger;
        try { 
              debugger;
              var res2 =  await instance.put(url, planParms);
              debugger; 
              return res2.status;

        } catch (error) {

            debugger;
            console.log('axios - error: ' + error.message);

        }
        return true;
    } 


    resetCustomerId = async (form,baseUrl) => {

        debugger; 
        var instance = axios.create({
            baseURL: baseUrl,
            timeout: 4000
        }); 
        var url = "/resetCustomerId";
        debugger;
        try { 
              debugger;
              var res2 =  await instance.put(url,form);
              debugger; 
              return res2.status;

        } catch (error) {

            debugger;
            console.log('axios - error: ' + error.message);

        }
        return true;
    } 

    resetPassword = async (form,baseUrl) => {

        debugger; 
        var instance = axios.create({
            baseURL: baseUrl,
            timeout: 4000
        }); 
        var url = "/resetPassword";
        debugger;
        try { 
              debugger;
              var res2 =  await instance.put(url,form);
              debugger; 
              return res2.status;

        } catch (error) {

            debugger;
            console.log('axios - error: ' + error.message);

        }
        return true;
    } 
     
    databaseCall  = async (enteredId, routineError, baseUrl) => {

        try {

            debugger;  
            var instance = axios.create({
                baseURL: baseUrl,
                timeout: 4000
            });
            // use question mark. not ampersand.
            var url="cust?id=" + enteredId;
            debugger;
            try { 
                  debugger;
                  var res2 =  await instance.get(url);  
                  debugger;
                  return res2;

            } catch (error) {

                debugger;
                console.log('axios - error: ' + error.message);

            }

        } catch (error) {

            routineError = error.message
            console.error('datebase call error: ' + error.message); 
            return {error:  routineError}
        }


    }

    
    databaseCallSignin  = async (enteredId, enteredPassword, routineError, baseUrl) => {

        try {

            debugger;  
            var instance = axios.create({
                baseURL: baseUrl,
                timeout: 4000
            });
            // use question mark. not ampersand.
            var url = "signin?id=" + enteredId + "&pw=" + enteredPassword; 
            debugger;
            try { 
                  debugger;
                  var res =  await instance.get(url);  
                  debugger;
                  return res;

            } catch (error) {

                debugger;
                console.log('axios - error: ' + error.message);

            }

        } catch (error) {

            routineError = error.message
            console.error('datebase call error: ' + error.message); 
            return {error:  routineError}
        }


    }
 
 
    addClaim = async (claim,baseUrl) => {

            debugger; 
            var instance = axios.create({
                baseURL: baseUrl,
                timeout: 4000
            }); 
            var url = "/addClaim";
            debugger;
            try { 
                debugger;
                var res2 =  await instance.post(url,claim);
                debugger; 
                return res2.status;

            } catch (error) {

                debugger;
                console.log('axios - error: ' + error.message);

            }


            return true;    
    }

     getClaimHistory = async (custId,baseURL) => { 

            var response;
            debugger;  
            var instance = axios.create({
                baseURL: baseURL,
                timeout: 4000
            });
            // use question mark. not ampersand.
            var url="/history?id=" + custId;
            debugger;
            try { 
                  debugger;
                  response =  await instance.get(url);  
                  debugger;
                   

            } catch (error) {

                debugger;
                console.log('axios - error: ' + error.message);
                return null;

            } 
            if(response.status === 404) 
            {
                // not found condition
                return null;
            }
            if(response.status === 200) 
            { 
                debugger; 
                let foundClaims = [];
                foundClaims = response.data; // return claim array. 
                return foundClaims;
            } 
            console.log('unknown/unexpected status from history: ' + response.status);
            return null;


        }

        getCustomerList = async (baseURL) => {

            var response;
            debugger;  
            var instance = axios.create({
                baseURL: baseURL,
                timeout: 4000
            });
            // use question mark. not ampersand.
            var url="/custList";
            debugger;
            try { 
                  debugger;
                  response =  await instance.get(url);  
                  debugger;
                   

            } catch (error) {

                debugger;
                console.log('axios - error: ' + error.message);
                return null;

            } 
            if(response.status === 404) 
            {
                // not found condition
                return null;
            }
            if(response.status === 200) 
            { 
                debugger; 
                let customers = [];
                customers = response.data; // return claim array.
               // console.log('read history - found customers : good result'); 
                return customers;
            } 
            console.log('unknown/unexpected status from customer list: ' + response.status);
            return null;



        }

        payClaim = async (form,baseUrl) => {

            debugger; 
            var instance = axios.create({
                baseURL: baseUrl,
                timeout: 4000
            }); 
            var url = "/setClaimStatus";
            debugger;
            try { 
                  debugger;
                  var res2 =  await instance.put(url,form);
                  debugger; 
                  return res2.status;
    
            } catch (error) {
    
                debugger;
                console.log('axios - error: ' + error.message);
    
            }
            return true;
        } 

        stampClaim = async (form, baseURL) => {
 
            // used to stamp adjusted claim.
            debugger; 
            var instance = axios.create({
                baseURL: baseURL,
                timeout: 4000
            }); 
            var url = "/stampAdjustedClaim";
            debugger;
            // will return OK or a status code (bad one).
            try { 
                  debugger;
                  var res2 = await instance.put(url,form); 
                  return res2;
    
            } catch (error) {
    
                debugger;
                console.log('stamp claim  - error: ' + error.message);
                return error;
    
            }
            
        } 

   readClaim =  async (claimId) => {

            var response;
            debugger;  
            var instance = axios.create({
                baseURL: this.props.url,
                timeout: 4000
            }); 
            var url="/readClaim?id=" + claimId;
            debugger;
            try {
 
                  debugger;
                  response =  await instance.get(url);  
                  debugger;

                  if(response.status === 200) 
                  {
                      var claim = response.data;
                      return claim;

                  }
                  if(response.status === 404)
                  {
                        return null; 
                  } 

            } catch (error) {

                console.log("read claim failed");
            }

    } 

    adminSignin = async (AdminId, AdminPassword, baseUrl) => {

            debugger;  
            var instance = axios.create({
                baseURL: baseUrl,
                timeout: 4000
            }); 

            try {

                // adminSignin call to server. authenticate user and get token.

                var url = 'adminSignin';  
                var parms = '?id=' + AdminId + "&pw=" + AdminPassword;
                var send = url + parms;
 
                var response =  await instance.get(send); 
                return response;
            
            } catch (Err) {

                console.log("admin login failed");


            }

    }

    getPlans = async (baseUrl) => {

        debugger;  
        var instance = axios.create({
            baseURL: baseUrl,
            timeout: 4000
        }); 

        try { 
            
            var send = baseUrl + 'readPlans';

            var response =  await instance.get(send); 
            return response;
        
        } catch (Err) {

            console.log("plan read failed");


        }

    }

    getServices = async (baseUrl) =>{
  
        var instance = axios.create({
            baseURL: baseUrl,
            timeout: 4000
        }); 

        try {
 
            var send = baseUrl + 'readServices';

            var response =  await instance.get(send); 
            return response;
        
        } catch (Err) {

            console.log("services read failed");


        }
        
    }
  
 }

export default Database;
 

 


