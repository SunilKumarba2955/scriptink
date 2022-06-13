const axios = require('axios');
const isValidEmail =async (email,callback)=>{
    const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.apikeyemail}&email=${email}`);
    // const body = await response.json();
    if(response.data.deliverability!=="UNDELIVERABLE")callback(true);
    else callback(false);

    console.log(response);
}

const isValidPhone =async (phone,callback)=>{
    const response = await axios.get(`https://phonevalidation.abstractapi.com/v1/?api_key=${process.env.apikeyphone}&phone=91${phone}`);
    if(response.data.valid===true)callback(true);
    else callback(false);
    console.log(response);
}

module.exports={isValidEmail:isValidEmail,isValidPhone:isValidPhone};
