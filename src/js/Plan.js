

// Plan.js 

import React from 'react'; 

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'; 
import Container from 'react-bootstrap/Container';
import { withRouter } from 'react-router-dom';   
import Database from './Database';


import '../css/style.css';


class Plan extends React.Component {

    isCustomerSignedIn = this.props.isCustomerSignedIn;  
    baseUrl = this.props.baseUrl;
    getToken = this.props.getToken;
    setPlan = this.props.setPlan;
    setMessage = this.props.setMessage;

    // set it here so comp did mount will refresh screen/render.
    state = { selections: [] }

    constructor(props) {

        super(props);

        // check for valid login
        var ok = this.isCustomerSignedIn();
        if(!ok) {

            const { history: { push } } = this.props; 
            push('/start');  
        }


    } 

    componentDidMount = async () => {

          this.getPlans(this.baseUrl);  

    } 
     
    getPlans = async (baseUrl) => {

        debugger;
        var database = new Database();
        const success = 200;
        var resp = await database.getPlans(baseUrl);
        if(resp.status === success) {
            console.log('plans read');
            debugger;
            var plans = resp.data;
            console.log(plans);   
            debugger;
            this.buildSelections(plans);
        
    

        } else
        {
            console.log('Plan.js get plans failed' + resp.status); 
        } 

    } 
    
    buildSelections  =   (plans) => { 
 
        debugger;
        // second render calls this when state updated in comp did mount
        // after first render.
        console.log('--build selection list');
        console.log('input plans length ' + plans.length);
        debugger;
        var planStyle = {marginTop: '25px' }; 
        var selections = [];
        var white = { color: 'white'};

        // spacing
        var maxLength = 0; 

        for(var i = 0 ; i < plans.length ; i++) { 

             var row = plans[i];
             var planName = row['PlanName'].toString();
             var length = planName.length;
             if( length > maxLength ) { maxLength = length; };
        }
        maxLength = maxLength + 2;  

        for( i = 0 ; i < plans.length ; i++) { 

            row = plans[i];

            var plan = row['PlanName'].toString();
            var lit = row['PlanLiteral']; 
            //* var space = "&nbsp;";
            var count = maxLength - plan.length; 
            console.log(maxLength + ' ' + count);
            //*var spacing = "";
            // set var with JSX special characters....

            console.log('build line: ' + plan + ' ' + lit); 
 
           var planLine  =  
                 <Row  key={i}

                     style={planStyle} className="normalText outline">

                    <Button  onClick={this.onPlan.bind(this,plan)} 
                             style={white}>{plan}
                    </Button>

                    &nbsp;&nbsp;{lit} 
                </Row>; 
 
            

             selections.push(planLine);  
        }  
         
         
        console.log('-build selections list length ' + selections.length);
        
        
       // 2nd render will be triggered to load screen with state.selections.
       this.setState({

        selections : selections

     });

     console.log('-state.selections ' + this.state.selections);
   

    }

   


    returnMenu = (e) => {

        e.preventDefault();
        const { history: { push } } = this.props; 
        push('/hub');

    } 

    onPlan = (plan,e) => { 

        debugger;
        e.preventDefault();  

         // update state cust in app.js.
        this.props.setPlan(plan);

        // update database
        var cust = this.props.cust;
        cust.custPlan = plan;  // on db PolicyID

        this.handleCustomerUpdate(cust);
        const { history: { push } } = this.props; 
        push('/planconfirm');
    }
    
    handleCustomerUpdate = async (cust) => {
        

        debugger;
        var custId = cust.custId.toString().trim();
        var plan = cust.custPlan.toString().trim(); 
        var planParms = { CustId: custId, CustPlan: plan} 
        
        planParms["_csrf"] = this.getToken();


        var database = new Database();
        const success = 200;
        var status = await database.updatePlan(planParms , this.baseUrl);
        if(status === success) {

            debugger; 
            this.setPlan(plan); // update state

            // set message 
            var msg = "Plan " + plan + " selected.";
            this.setMessage(msg);

            const { history: { push } } = this.props; 
            push('/hub'); 

        } else
        {


        }

    }


    render() {  

        var currentPlan = this.props.currentPlan;  
        console.log('--render');

        return (<Container>



            <br></br>
            <Row> 
            <h1 className="welcomePlan">Select a Plan</h1> <br/> 
            </Row>
            <Row>
                <h4 className="normalText outline">Current Plan: {currentPlan}</h4>
            </Row>
            <br></br>
             
            {this.state.selections}

            <br></br>
          
            <br></br> 
            <Button variant="outline-primary" onClick={this.returnMenu}>Return to Menu</Button>

            </Container>
        ); 
    }



}

export default withRouter(Plan);