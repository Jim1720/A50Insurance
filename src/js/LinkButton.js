
// LinkButton.js
 
import React from 'react';

class LinkButton extends React.Component {



    binder() { 

        return (
         <div>
         <a className={this.props.class1} href='#{this.props.href}'>{this.props.label}</a> 
         <div className={this.props.class2}>{this.props.follow}</div>
         </div>
        );
    }

    render() { 
        
         const { href, follow } = this.props;

         return (

            <div>
            
            
            </div>


         ); 
    }

}

export default LinkButton;