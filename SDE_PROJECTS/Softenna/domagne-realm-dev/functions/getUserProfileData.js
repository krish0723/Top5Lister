/* 
  GET USER PROFILE DATA FUNCTION.
  INPUT: RELAVENT USER ID
  OUTPUT: DOCUMENT OBJECT CONTAINING PROFILE PHOTO LINK, TOP TAG AMOUNT, NUMBER OF FOLLOWERS, NUMBER OF FOLLOWING, TOTAL EARNED AMOUNT, PHOTOS
  *NOTE: IN ORDER TO OPTIMIZE CLIENT SIDE EFFICIENCY WE WILL ONLY BE SENDING THE TOP LEVEL INFORMATION (I.E. THE NUM OF FOLLOWERS IS A INT NOT A LIST OF USERS, USE FUNCTIONS TO ACCESS LIST OF USERS)
*/

// created by Krishna Chetan on 3/10/21

exports = async function({ query, headers, body}, response){
  
  // const userId = JSON.parse(body.text());
  // console.log("Request body:", reqBody);
    
  // Get Post Obj from Request
  const {userId} = query;

  // Defining Database:
  const db = context.services.get("mongodb-atlas").db("domagne-dev");
  
  // get relavent user obj
  const userObj = await db.collection("appusers").findOne({ "_id":BSON.ObjectId(userId) });
  
  var postIds = userObj.posts;
  var userPosts = []
  
  for await (const id of postIds){
    const post = await db.collection("posts").findOne({ "_id":id });
    userPosts.push(post);
  }
  
  // sort the posts by time createdAt
  
  function sortByDate( a, b ){
    return ((new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : (new Date(a.createdAt) > new Date(b.createdAt)) ? -1 : 0)
  }
  
  userPosts.sort(sortByDate)

  userPostsArr = userPosts;
  // build photos array to send back (each element contains a tuple: (postId, fileLocation))
  const photos = []
  // userPosts.forEach( (photo) => { photos.push(photo); } );
  
  for await (const photo of userPostsArr){
    photos.push({ "postId": photo._id.toString(), "assetURL": photo.assetURL})
  }
  
  const userProfileData = { 
                            "userId": userObj._id,
                            "username": userObj.username,
                            "name": userObj.name,
                            "profPhoto": userObj.profPhoto,
                            "topTagAmount": userObj.topTagAmount,
                            "numOfFollowers": userObj.followers.length,
                            "numOfFollowing": userObj.following.length,
                            "totalEarned": userObj.totalEarned,
                            "posts": photos
                          }
                          
  response.setStatusCode(200);
  response.setHeader("Content-Type", "application/json");
  response.setBody(JSON.stringify(userProfileData));
  
  return userProfileData;
};