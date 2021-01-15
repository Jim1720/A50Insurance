
// test.axios
var axios = require('axios');


axios.get('http://localhost:3200/cust?id=1')

.then( function(response) {

    console.log(response.data[1])

}).catch( function(error) {

    console.log(error)

})



