
// ScreenStyleList.js
 

export class ScreenStyleList {

    screenStyleList = [];

    getScreenStyleObject = (screenName) => {

        debugger;
        var screenStyleObject = null;
        for(let s of this.screenStyleList)
        {

            if(s.screen === screenName)
            {

                screenStyleObject = s;
            } 
        }

        return screenStyleObject; 

    }

    addScreenStyleObject = (screenStyleObject) => {

        debugger;
        this.screenStyleList.push(screenStyleObject)

    }
 

    replaceScreenStyleObject = (screenStyleObject) => {

        debugger;
        for(let s in this.screenStyleList)
        {

            if (s.screen === screenStyleObject.screenName)
            {

                s = screenStyleObject;

            }

        } 

    } 
  


}


export default ScreenStyleList;