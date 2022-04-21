// CREATE COMMENT FUNCTION.
// INPUT: COMMENT OBJECT IN DOCUMENT FORM IN BODY (DATA MODEL: https://lucid.app/lucidchart/c309d096-1c62-4850-b2ae-8ed7b8c5f73d/edit?page=0_0&invitationId=inv_a7f83edc-9be4-4e10-ac2f-8632a62d3cc8#)
//        IF COMMENT IS A REPLY TO ANOTHER COMMENT THEN PASS commenteeId (ID OF COMMENT BEING COMMENTED ON) IN PARAMS
// OUTPUT: CREATED COMMENT OBJECT FROM DATABASE

// created by Krishna Chetan on 3/30/21

exports = async function({ query, headers, body}, response) {
    
    const commentObj = JSON.parse(body.text());
    const {commenteeId} = query;
    
    // Defining Database:
    const db = context.services.get("mongodb-atlas").db("domagne-dev");
    
    //get currentUser object
    const commentUser = await db.collection("users").findOne({ "_id":BSON.ObjectId(commentObj.user._id)})
    
    const createCommentObj = {
          "_id": BSON.ObjectId(),
          "hashtag": commentObj.hashtag,
          "tags": typeof commentObj.tags != "undefined" ? commentObj.tags : [],
          "replies": typeof commentObj.replies != "undefined" ? commentObj.replies : [],
          "likes": typeof commentObj.likes != "undefined" ? commentObj.likes : [],
          "flags": typeof commentObj.flags != "undefined" ? commentObj.flags : [],
          "user": commentObj.user,
          "post": commentObj.post,
          "text": commentObj.text
        }
          
    //insert post into database
    const insertedCommentId = await db.collection("comments").insertOne(createCommentObj).insertedId;
    
    const returnComment = await db.collection("comments").findOne({"_id": insertedCommentId });
    
    if(commenteeId){
      const commentee = await db.collection("comments").findOne({ "_id":BSON.ObjectId(commenteeId)})
      commentee.replies.push(returnComment);
    }
    
    const returnUser = await db.collection("appusers").findOne({"_id": returnComment.user});
    
    const returnPost = await db.collection("posts").findOne({"_id": returnComment.post._id});
    returnComment.user = returnUser;
    returnComment.post = returnPost;
    
    response.setStatusCode(200);
    response.setHeader("Content-Type", "application/json");
    response.setBody(JSON.stringify(returnComment));
    
    return returnComment;
    // })
}