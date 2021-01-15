

// Grid Test

// GridTest.js

import React from 'react';

import Grid from './Grid';

class GridTest extends React.Component {

    render() {

        var head1 = {
        
            hclass: 'first',
            hdescription : 'test col 1'
        };

         var head2 = {
        
            hclass: 'first',
            hdescription: 'test col 2'
        };

        var heads = [];
        heads.push(head1);
        heads.push(head2);

        console.log('head 1 >> ' + head1.class + ' ' + head1.description); 

        let data1 = {

            rclass: 'first',
            rdata: 'a'

        }

        let data2 = {

            rclass: 'first',
            rdata: 'b'

        }

        var row = [];
        row.push(data1);
        row.push(data2);

        var rows= [];
        rows.push(row);

        return (

            <Grid  header={heads}
                body={rows} />

        );

    }

};

export default GridTest;