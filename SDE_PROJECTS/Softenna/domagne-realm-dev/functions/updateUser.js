/* 
  UPDATE USER FUNCTION.
  INPUT: USERID TO UPDATE IN PARAMS UPDATED USER OBJECT IN BODY
  OUTPUT: UPDATED USER OBJECT FROM DATABASE
*/

// created by Krishna Chetan on 3/11/21

exports = async function({ query, headers, body}, response){
  
  const {userId} = query;
  const userObj = JSON.parse(body.text());

  // Defining Database:
  const db = context.services.get("mongodb-atlas").db("domagne-dev");
  
  db.collection("appusers").update(
   { "_id": BSON.ObjectId(userId) },   // Query parameter
   userObj
  )
  
  const returnUserObj = await db.collection("appusers").findOne({"_id": BSON.ObjectId(userId)})
  
  return returnUserObj;
};
