/* 
  GET USER FUNCTION.
  INPUT: RELAVENT USER ID IN PARAMS
  OUTPUT: USER OBJECT (DATA MODEL: https://lucid.app/lucidchart/c309d096-1c62-4850-b2ae-8ed7b8c5f73d/edit?page=0_0&invitationId=inv_a7f83edc-9be4-4e10-ac2f-8632a62d3cc8#)
          
*/

// created by Krishna Chetan on 3/11/21
exports = async function({ query, headers, body}, response) {
    // Data can be extracted from the request as follows:

    // Query params, e.g. '?arg1=hello&arg2=world' => {arg1: "hello", arg2: "world"}
    const {userId} = query;
    const AppUser = context.services.get("mongodb-atlas").db("domagne-dev").collection("appusers");
    // Headers, e.g. {"Content-Type": ["application/json"]}

    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    // const userId = JSON.parse(body.text());
    // console.log("Request body:", body);
    const userObj = await AppUser.findOne( { "_id":BSON.ObjectId(userId) } );
    
    function sortByDate( a, b ){
      return ((new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : (new Date(a.createdAt) > new Date(b.createdAt)) ? -1 : 0)
    }
    
    var postIds = userObj.posts;
    if (postIds.length !== 0){
      var userPosts = []
  
      for await (const id of postIds){
        const post = await context.services.get("mongodb-atlas").db("domagne-dev").collection("posts").findOne({ "_id":id });
        userPosts.push(post);
      }
      
      // sort the posts by time createdAt
      userPosts.sort(sortByDate);

      for await (const post of userPosts){
        const hashtagObj = await context.services.get("mongodb-atlas").db("domagne-dev").collection("hashtags").findOne({ "_id":post.hashtag });
        post.hashtag = hashtagObj;
      }
      
      userObj.posts = userPosts;
    }
    
  
  
    
  
    response.setStatusCode(200);
    response.setHeader("Content-Type", "application/json");
    response.setBody(JSON.stringify(userObj));
    
    return userObj;
};
