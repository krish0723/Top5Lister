/* 
  GET USER LIFETIME EARNED FUNCTION.
  INPUT: RELAVENT USER ID
  OUTPUT: DOCUMENT OBJECT CONTAINING LIST OF OBJECTS. EACH ELEMENT IN LIST CONTAINS 
          POST ID, FILE LOCATION, HASHTAG, CREATEDAT DATE, TOTAL EARNED FROM POST, TOTAL CONTRIBUTIONS
          
  *NOTE: IN ORDER TO OPTIMIZE CLIENT SIDE EFFICIENCY WE WILL ONLY BE SENDING THE TOP LEVEL INFORMATION 
  (I.E. THE POST OBJECTS ONLY CONTAIN RELAVENT TOP LEVEL INFO, TO ACCESS VALUES LIKE COMMENTS AND LIKES USE FUNCTIONS TO GET POST)
*/

// created by Krishna Chetan on 3/11/21

exports = async function({ query, headers, body}, response){
  
  const {userId} = query;
    
  // Get Post Obj from Request
  // const {userId} = query;

  // Defining Database:
  const db = context.services.get("mongodb-atlas").db("domagne-dev");
  
  function sortByDate( a, b ){
    return ((new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : (new Date(a.createdAt) > new Date(b.createdAt)) ? -1 : 0)
  }
  
  // get relavent user obj
  var posts = await db.collection("posts").find( {} ).toArray();
  
  
  // sort the posts by time createdAt
  posts.sort(sortByDate);
  
  for await (const post of posts){
    post.hashtag = await db.collection("hashtags").findOne( { "_id":post.hashtag})
  }
  
  // build photos array to send back (each element contains an object: (postId, assetURL, etc.))
  const returnObj = []
  for await (const post of posts){
    returnObj.push({
                "postId":post._id,
                "assetURL": post.assetURL,
                "hashtag": post.hashtag,
                "createdAt": post.createdAt,
                "amountEarned": post.amountEarned,
                "contributions": post.contributions.length
    })
  }
  
  response.setStatusCode(200);
  response.setHeader("Content-Type", "application/json");
  response.setBody(JSON.stringify(returnObj));
  
  return returnObj;
};