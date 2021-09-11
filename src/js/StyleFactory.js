
// StyleFactory.js

import Style from "./Style";
import ScreenStyleList from "./ScreenStyleList"; 


export class StyleFactory {
 
    screenStyleList = null;

    constructor() {

        this.screenStyleList = new ScreenStyleList();

    }


    userColors = [ "white", "red" , "pink","blue","aqua","yellow","green","lawngreen","gold","goldenrod"]; 
    // apply when solid
    labelColors = [ "black" , "white","red","white","black","black","black","black","black","black"]; 
    // apply when solid
    headerColors = [ "black" , "white", "red","white","black","black","black","black","black","black"]; 
    messageColors = [ "black" , "white", "red","white","black","black","black","black","black","black"];
    // 

    /* class lists */

    internalClasses = ["Style", "Picture", "Outline", "Solid"];
    externalClasses = ["","bg-image","bg-outline","bg-solid"];
    
    /* new style object default values */
    /* cycle 2 - picture */

    defaultUserColor = "white";
    defaultLabelColor = "dodgerblue";
    defaultHeaderColor = "burleywood";
    defaultMessageColor = "burleywood";
    defaultInternalClass = "Picture";
    defaultExternalClass = "bg-image";
    defaultPictureColor = "white";

    addNewStyleObject = (screenName) => {

        var nso = new Style();
        nso.screen = screenName;
        nso.internalClass = this.defaultInternalClass;
        nso.externalClass = this.defaultExternalClass;
        // these are all white to show in picture style.
        nso.userColor = this.defaultPictureColor;
        nso.labelColor = this.defaultPictureColor;
        nso.headerColor = this.defaultPictureColor;
        nso.messageColor = this.defaultPictureColor;

        debugger;
        // add to list 
        this.screenStyleList.addScreenStyleObject(nso); 
    }

    getStyleLinkValue = (screenName) => {

        // return internalClass value
        var screenStyleObject = this.screenStyleList.getScreenStyleObject(screenName);
        return screenStyleObject.internalClass; 

    }

    getColorLinkValue = (screenName) => {

        // return user color value
        var screenStyleObject = this.screenStyleList.getScreenStyleObject(screenName);
        return screenStyleObject.userColor;

    }


    
    
    getNextStyle = (screenName) => {

        debugger;
        // get the screen style object for this screen
        var screenStyleObject = this.screenStyleList.getScreenStyleObject(screenName);
        var situation = screenStyleObject === null ? "New" : "Existing";
        if(situation === "New")
        {
            // add new object to the list
            // it is at cycle 2: internal class = picture;
            // we can skip logic below to cycle the style.
            this.addNewStyleObject(screenName); 
            return; 
        }

        debugger;

        // determine next style and set object to it.  
        var max = this.internalClasses.length;
        var currentInternalClass = screenStyleObject.internalClass;
        for (var i = 0, match = false ;  match === false && i < max; i ++)
        {
            // current screen style object interal class checked with
            // current internal class for styles
            // this is the main style driver.
             if(currentInternalClass === this.internalClasses[i])
             {
                 // match find next one.
                 match = true;
                 var endOfList = i === max - 1;
                 var next = endOfList ? 0 : i + 1; 
                 // next styles (clases external and internal)
                 screenStyleObject.internalClass = this.internalClasses[next];
                 screenStyleObject.externalClass = this.externalClasses[next];
                 // update the objects style = internal and external classes.
                 var internalClass = screenStyleObject.internalClass;
                 // set initial color to white on solid and outline
                 // set initial label color to white for picture style.
                 var first = 0;
                 var white = "white";
                 debugger;
                 switch(internalClass) {

                    case "Solid" :
                          // use first colors in list.
                          screenStyleObject.labelColor = this.labelColors[first];
                          screenStyleObject.messageColor = this.messageColors[first];
                          screenStyleObject.headerColor = this.headerColors[first]; 
                          screenStyleObject.userColor = this.userColors[first];
                          break;
                    case "Picture" :
                          screenStyleObject.labelColor = white;
                          screenStyleObject.messageColor = white;
                          screenStyleObject.headerColor = white;
                          screenStyleObject.userColor = white;
                          break;
                    default: /* outline or none */  
                          screenStyleObject.labelColor = this.defaultLabelColor;
                          screenStyleObject.messageColor = this.defaultMessageColor;
                          screenStyleObject.headerColor = this.defaultHeaderColor;
                          screenStyleObject.userColor = this.defaultUserColor;
                          break;
                 }

                 this.screenStyleList.replaceScreenStyleObject(screenStyleObject);
                 
             } 
        }
        
    }

    getNextColor = (screenName) => {

        // called on style link click
        
        debugger;
        var screenStyleObject = this.screenStyleList.getScreenStyleObject(screenName);
         // determine next style and set object to it. 
         debugger;
         var max = this.userColors.length;  
         for (var i = 0, match = false ; match === false &&  i < max ; i ++)
         {

              if(screenStyleObject.userColor === this.userColors[i])
              {
                  var white = "white";
                  match = true;
                  // match find next one.
                  var endOfList = i === max - 1;
                  var next = endOfList ? 0 : i + 1;
                  screenStyleObject.userColor = this.userColors[next];
                  // apply when solid only....
                  if(screenStyleObject.internalClass === "Solid") {

                     // colors for solid backgrounds
                      screenStyleObject.headerColor = this.headerColors[next];
                      screenStyleObject.labelColor = this.labelColors[next];
                      screenStyleObject.messageColor = this.messageColors[next];

                  } else if (screenStyleObject.internalClass === "Picture") {

                    screenStyleObject.headerColor = white;
                    screenStyleObject.labelColor = white;
                    screenStyleObject.messageColor = white;

                  }
                  else
                  {
                       // defaults for outline or none.
                      screenStyleObject.headerColor = this.defaultHeaderColor;
                      screenStyleObject.labelColor = this.defaultLabelColor;
                      screenStyleObject.messageColor = this.defaultMessageColor;
                  }
                
              } 
         }

         //
         // save the cycled style object
         debugger;
         this.screenStyleList.replaceScreenStyleObject(screenStyleObject);

          
    }

    getCurrentStyleForScreen = (screenName) => {

        debugger;
        // called on screen loads   
        // returns object or null if no one set for screen
        // setNextStyle will create object when Style link is clicked
        // if none exists for screen.      
        var screenStyleObject = this.screenStyleList.getScreenStyleObject(screenName); 
        return screenStyleObject; 
    }  
}

export default StyleFactory;