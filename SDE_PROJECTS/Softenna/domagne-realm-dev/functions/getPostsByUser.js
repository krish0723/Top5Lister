/* 
  GET POSTS BY USER FUNCTION.
  INPUT: RELAVENT USER ID IN PARAMS
  OUTPUT: ARRAY OF POST OBJECTS (DATA MODEL: https://lucid.app/lucidchart/c309d096-1c62-4850-b2ae-8ed7b8c5f73d/edit?page=0_0&invitationId=inv_a7f83edc-9be4-4e10-ac2f-8632a62d3cc8#)
          
*/

// created by Krishna Chetan on 3/17/21
exports = async function({ query, headers, body}, response) {
    // Data can be extracted from the request as follows:

    // Query params, e.g. '?arg1=hello&arg2=world' => {arg1: "hello", arg2: "world"}
    const {userId} = query;

    Users = context.services.get("mongodb-atlas").db("domagne-dev").collection("appusers");
    Posts = context.services.get("mongodb-atlas").db("domagne-dev").collection("posts");
    
    const user = await Users.findOne({ "_id": BSON.ObjectId(userId)});
    
    var posts = []
    for await (const id of user.posts){
      const post  = await Posts.findOne({ "_id": id});
      posts.push(post);
    }
    
    response.setStatusCode(200);
    response.setHeader("Content-Type", "application/json");
    response.setBody(JSON.stringify(posts));

    return posts;
};
