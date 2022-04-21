// 2FA AUTH VERIFICATION START FUNCTION.
// INPUT: *OPTIONAL*
// OUTPUT: BOOLEAN VALUE WHERE TRUE SIGNIFIES MESSAGE HAS BEEN SENT SUCCESSFULLY

// created by Krishna Chetan on 2/26/21

exports = async function({ query, headers, body}, response) {
    const twilio = require("twilio")("ACa91e2358a87d3ed3ba8e60cf2a29cc3c", "eccc7c56412c8ca859a4bc923a7969c0");
    
    const currentUser = context.user;
    const users = context.services
    .get("mongodb-atlas")
    .db("domagne-dev")
    .collection("appusers");
    const phone = currentUser.custom_data.phoneNumber;
    return twilio.verify.services('VAefa17f7e7e03feeea35d9d6e19736a64')
             .verifications
             .create({to: "+" + phone, channel: 'sms'})
             .then(verification => console.log(verification.customCode));
}
