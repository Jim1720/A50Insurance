
import React from 'react';

class CreateGridRow extends React.Component {


    render() {

        var line = this.props.line;
        var data = this.props.data
        var result = ""; 
        var count = 0;
        var out = [];

        for (let item of data) {
 
            count++;
            if(line === "header") {
 
                   var { hclass, hdescription } = item;
                   result = <th key={count.toString()} className={hclass}>{hdescription}</th> 

            } else {
               
                var { rclass, rdata} = item;
                result = <tr key={count.toString()} className={rclass}>{rdata}</tr> 

            }

            out.push(result);
        }  

        return (<tr>

            {out}

        </tr>)
    }



}

export default CreateGridRow;

