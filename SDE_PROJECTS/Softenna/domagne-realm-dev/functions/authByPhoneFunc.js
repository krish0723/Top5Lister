
  /*

    This function will be run when a user logs in with this provider.

    The return object must contain a string id, this string id will be used to login with an existing
    or create a new user. This is NOT the Realm user id, but it is the id used to identify which user has
    been created or logged in with.

    If an error is thrown within the function the login will fail.

    The default function provided below will always result in failure.
  */

 exports = async function(loginPayload) {
  // Get a handle for the app.users collection
  const users = context.services
    .get("mongodb-atlas")
    .db("domagne-dev")
    .collection("appusers");
  // Parse out custom data from the FunctionCredential
  const { phNum, password } = loginPayload;
  // Query for an existing user document with the specified username
  const user = await users.findOne({ 
    phNum:phNum,
    password:password
  });
  
  if (user) {
    // If the user document exists, return its unique ID
    return user._id.toString();
  } else {
    return "Error: User not in database!";
  }
};
