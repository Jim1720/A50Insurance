
// Style.js


export class Style {  

        screen = "";
        internalClass = "";
        externalClass = "";
        userColor = "";
        labelColor = "";
        headerColor = "";
        messageColor = "";   

        getStyle = ()  => {
         
            return this.internalClass;
        };

        getColor = () => {
        
             return this.userColor;

        }; 
}

export default Style;