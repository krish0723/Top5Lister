// 2FA AUTH VERIFICATION CHECK FUNCTION.
// INPUT: USER ENTERED CODE TO CHECK AGAINST WHAT WAS SENT IN SMS
// OUTPUT: BOOLEAN VALUE WHERE TRUE SIGNIFIES THAT THE CODE IS A MATCH, FALSE IF ERROR

// created by Krishna Chetan on 2/27/21

exports = async function({ query, headers, body}, response) {
    const twilio = require("twilio")("ACa91e2358a87d3ed3ba8e60cf2a29cc3c", "eccc7c56412c8ca859a4bc923a7969c0");
    // Data can be extracted from the request as follows:

    const {code} = query;
    const contentTypes = headers["Content-Type"];
    const reqBody = body;

    console.log("code:", code);
    
    const currentUser = context.user;
    const users = context.services
    .get("mongodb-atlas")
    .db("domagne-dev")
    .collection("appusers");
    const phone = currentUser.custom_data.phoneNumber;
    return twilio.verify.services('VAefa17f7e7e03feeea35d9d6e19736a64')
             .verificationCheck
             .create({to: "+1" + phone, code: code})
             .then(verification_check => console.log(verification_check.status));
}
