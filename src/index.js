import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable'; 

import React from 'react';
import ReactDOM from 'react-dom';  
import { BrowserRouter } from 'react-router-dom' 
import App from './js/App';

// for edge: https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es/map';
import 'core-js/es/set'; 

// updating core js to core js3

//hot-dev-client is where the issue is trying:chrome

ReactDOM.render( 
 
      <BrowserRouter> 
            <App /> 
      </BrowserRouter>,  
      document.getElementById('root')

);

