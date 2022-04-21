/* 
  UPDATE POST FUNCTION.
  INPUT: POSTID TO UPDATE IN PARAMS UPDATED POST OBJECT IN BODY
  OUTPUT: UPDATED POST OBJECT FROM DATABASE
*/

// created by Krishna Chetan on 3/11/21

exports = async function({ query, headers, body}, response){
  
  const {postId} = query;
  const postObj = JSON.parse(body.text());

  // Defining Database:
  const db = context.services.get("mongodb-atlas").db("domagne-dev");
  
  db.collection("posts").update(
   { "_id": BSON.ObjectId(postId) },   // Query parameter
   postObj
  )
  
  const returnPostObj = await db.collection("posts").findOne({"_id": BSON.ObjectId(postId)})
  
  return returnPostObj;
};
