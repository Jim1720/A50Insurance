
// ScreenStyleManager.js
 

export class ScreenStyleManager {

    // determines if styles are used for screen and or links.
    // called by navArea and getNextStyle, to show links and process style clicks, respectively.
    
    // nav area shows Style and Color links on these screens only
    activeScreenStyleList = ["/claim","/update"]; 


    authorizeStyles = () => {

        debugger;
        var check = process.env.REACT_APP_A50_USE_STYLES; 

        if(check === undefined || check === null) {

             return false; // not authorized
        } 

        // value of Y or y turn styles on in.
        var test = check.toUpperCase();
 
        var canUseStyles = (test === "Y");  
        
        if(canUseStyles === false) {
            return false; // env var not Y.
        }


        debugger;  
        // is screen in list ?
        var loadingScreenName =  window.location.pathname; 

        for(var i = 0, authorized = false; authorized === false && i < this.activeScreenStyleList.length; i++)
        {
            if(loadingScreenName === this.activeScreenStyleList[i])
            {
                authorized = true;
            }
        }

        return authorized;

    }

    areStylesActive = (screen) => {

        debugger;
        var check = process.env.REACT_APP_A50_USE_STYLES; 

        if(check === undefined || check === null) {

             return false; // not authorized
        } 

        // value of Y or y turn styles on in.
        var test = check.toUpperCase();
 
        var canUseStyles = (test === "Y");  
        
        if(canUseStyles === false) {
            return false; // env var not Y.
        }

        debugger; 
        var active = false;
        var loadingScreenName =  window.location.pathname;


        for(var i = 0; i < this.activeScreenStyleList.length; i++)
        {
            if(loadingScreenName === this.activeScreenStyleList[i])
            {
                active = true;
            }
        }

        return active;

    }

    
} 

export default ScreenStyleManager;