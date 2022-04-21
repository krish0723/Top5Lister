// CREATE USER FUNCTION.
// INPUT: USER OBJECT IN DOCUMENT FORM (DATA MODEL: https://lucid.app/lucidchart/c309d096-1c62-4850-b2ae-8ed7b8c5f73d/edit?page=0_0&invitationId=inv_a7f83edc-9be4-4e10-ac2f-8632a62d3cc8#)
// OUTPUT: CREATED USER OBJECT FROM DATABASE

// created by Krishna Chetan on 3/4/21
exports = async function({ query, headers, body}, response) {

    // const {userId, username, name, email, password, phNum} = query; //USING PARAMETER INPUT DESIGN
    // const {userObj} = query; //USING OBJ INPUT DESIGN

    // Headers, e.g. {"Content-Type": ["application/json"]}
    const contentTypes = headers["Content-Type"];

    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    const userObj = JSON.parse(body.text());

    console.log("userObject: ", userObj);
    console.log("Content-Type:", JSON.stringify(contentTypes));
    console.log("Request body:");

    const currentUser = context.user;
    const users = context.services
    .get("mongodb-atlas")
    .db("domagne-dev")
    .collection("appusers");
    
    // USING PARAMETER INPUT DESIGN
    // users.insertOne({
    //   "userId": userId,
    //   "name": name,
    //   "username": username,
    //   "password": password,
    //   "phNum": phNum,
    //   "email": email,
    //   "proPhoto": "",
    //   "topTagAmount": 0,
    //   "totalSpent": 0,
    //   "totalEarned": 0,
    //   "followers": [],
    //   "following": [],
    //   "blockedUsers": [],
    //   "hashtagsUsed": [],
    //   "posts": [],
    //   "likesEarned": [],
    //   "likesGiven": [],
    //   "commentsEarned": [],
    //   "flags": []
    //   });
      
    userObj._id = BSON.ObjectId(userObj._id)
    var userId = await users.insertOne({
      "_id": userObj._id,
      "username": userObj.username,
      "email": userObj.email,
      "createdAt": userObj.createdAt,
      "name":userObj.name,
      "phoneNumber":userObj.phoneNumber,
      "profPhoto": "",
      "topTagAmount": 0,
      "totalSpent": 0,
      "totalEarned": 0,
      "followers": [],
      "following": [],
      "blockedUsers": [],
      "hashtagsUsed": [],
      "posts": [],
      "likesEarned": [],
      "likesGiven": [],
      "flags": []

    });
    
    userId = userId.insertedId;
    
    const returnUser = await users.findOne({"_id":userId});
    
    response.setStatusCode(200);
    response.setHeader("Content-Type", "application/json");
    response.setBody(JSON.stringify(returnUser));
      
    return  userId;
};
