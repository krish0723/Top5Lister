// CREATE POST FUNCTION.
// INPUT: POSTID TO BE QUERIED IN PARAMS 
// OUTPUT: QUERIED POST OBJECT FROM DATABASE

// created by Krishna Chetan on 3/4/21
exports = async function({ query, headers, body}, response) {
    // Data can be extracted from the request as follows:

    // Query params, e.g. '?arg1=hello&arg2=world' => {arg1: "hello", arg2: "world"}
    const {postId} = query;

    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    // const postId = JSON.parse(body.text());
    
    const post = await context.services.get("mongodb-atlas").db("domagne-dev").collection("posts").findOne({ "_id": BSON.ObjectId(postId) });
    
    const hashtag = await context.services.get("mongodb-atlas").db("domagne-dev").collection("hashtags").findOne({ "_id": post.hashtag });
    
    const user = await context.services.get("mongodb-atlas").db("domagne-dev").collection("appusers").findOne({ "_id": post.user });
    
    post.hashtag = hashtag;
    post.user = user;
    
    response.setStatusCode(200);
    response.setHeader("Content-Type", "application/json");
    response.setBody(JSON.stringify(post));
  
    return  post;
};
