
'option-strict';

// Jim's React Grid! 

// Grid.js

import React from 'react';  

import Container from 'react-bootstrap/Container'; 
import CreateGridRow from './CreateGridRow';

import '../css/style.css';

class Grid extends React.Component { 
 
    render() {

        var header = this.props.header;
        var body   = this.props.body; 

        console.log('.grid');   
 

        var out = [];

        out.push(<CreateGridRow

            line = {'header'}
            data = {header}
            key = {"1"} />)

        var count = 0;
        for (let aRow of body) {  
            
             count++; 
             out.push(<CreateGridRow  line={'row'}
                                      data={aRow}
                                      key={count}/>);
        } 
  
        return(<Container> 
            
            <table><tbody>

                  {out}

            </tbody></table>

        </Container>); 
    }
   
}

export default Grid;
