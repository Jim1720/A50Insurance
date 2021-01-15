
import React from 'react';

import Row from 'react-bootstrap/Row'; 
import Container from 'react-bootstrap/Container';  
import { withRouter } from 'react-router-dom';

import Database from './Database'; 

import '../css/customerListStyle.css';

class AdminCustSearch extends React.Component { 

    baseUrl = this.props.baseUrl;
    isAdminSignedIn = this.props.isAdminSignedIn;

    state = ({
        customers: [],
        message: '',
        customersFound: false
    })  

    constructor(props) {

        super(props);

        // check for valid login
        var ok = this.isAdminSignedIn();
        if(!ok) {

            const { history: { push } } = this.props; 
            push('/start');  
        }
   }

    componentDidMount = async () => { 

         // load claim customer data into 'customers'. 
         this.claims = await this.getCustomers(this.baseUrl);  

    }

    getCustomers = async (baseUrl) => {

        debugger;  
        var list = ''; 
        
        var database = new Database(); 
        list = await database.getCustomerList(baseUrl); 
        
        var msg = '';
        if(list.length === 1) {
            msg = 'one customer found.';
        } else {
            msg = list.count + ' customers found.';
        }
        var found = (list.length > 0) ? true : false;
       
        this.setState({

            customers: list,
            message: msg,
            customersFound: found 

        });
    }

     
    showCustomers() {

        var out = []; 
        debugger; 
        var Number = 0; 
        var pad = "  ";

        for (let customer of this.state.customers) { 

            debugger;
            var id = customer.custId + pad;
            var first = customer.custFirst + pad;
            var last = customer.custLast + pad;
            var name = first + " " + last + pad; 
            var addr1 = customer.custAddr1 + pad;
            var addr2 = customer.custAddr2 + pad;
            var city = customer.custCity+ pad;
            var state = customer.custState+ pad;
            var zip = customer.custZip+ pad;
            var address = addr1 + " " + addr2 + " " + city +
                " " + state + " " + zip+ pad;
            var phone = customer.custPhone + pad;
            var email = customer.custEmail + pad;
            var app = customer.appID + pad; 
            Number++;
           
            debugger; 

            var lineOne = (<tr key={Number.toString()} >
                <td className="tdStyle">{id}</td>
                <td className="tdStyle">{name}</td> 
                <td className="tdStyle">{email}</td> 
                <td className="tdStyle">{phone}</td> 
                <td className="tdStyle">{address}</td>   
                <td className="tdStyle">{app}</td> 
                </tr>);

            out.push(lineOne);  
        }
  
        return( out );
    }

   render() {

  
    debugger;
    var subHeader =  (<tr className="hStyle">
        <td className="hStyle">Customer Id</td>
        <td className="hStyle">Name</td> 
        <td className="hStyle">Email</td>
        <td className="hStyle">Phone</td>
        <td className="hStyle">Address</td>  
        <td className="hStyle">App Id</td>
        </tr>); 
       
    var foundCustomerHtml = <div></div>; // place holder do not call showClaims when none found.
    debugger;
    if(this.state.customersFound) {

        foundCustomerHtml = <div><Container> 
            <h2 className='dBlue'> List Customers </h2>
            <hr /> 
            <table><thead className="pWhite">
            {subHeader} 
            </thead><tbody>
            {this.showCustomers()}
            </tbody></table> 
            </Container></div>;
    }

    var noCustomersFoundHtml = (<div><Container>

        <Row> 
            <br></br>
            <h1 className="sAqua">Customer List</h1>
            <br></br>
            <h2 className='dBlue'>No customers found </h2> 
        </Row>

    </Container></div>); 

    if(this.state.customersFound === true) {

        return foundCustomerHtml;

    } else {

        return noCustomersFoundHtml;
    } 
       
   } 
}

export default withRouter(AdminCustSearch)