/* 
  GET ALL POSTS FOR A USER'S FEED.
  INPUT: USERID IN PARAMS
  OUTPUT: ARRAY OF DOCUMENT OBJECTS CONTAINING POST PHOTO LINK, RANK, AMOUNTSPENT, NUM OF COMMENTS, NUM OF LIKES
  *NOTE: IN ORDER TO OPTIMIZE CLIENT SIDE EFFICIENCY WE WILL ONLY BE SENDING THE TOP LEVEL INFORMATION 
  (I.E. THE NUM OF COMMENTS IS A INT NOT A LIST OF COMMENTS, USE FUNCTIONS TO ACCESS SPECIFIC POST AND ALL ASSOCIATED METADATA)
*/

// created by Krishna Chetan on 3/10/21 pagination implemented on 03/30/21

  exports = async function({ query, headers, body}, response){
  
  // const userId = JSON.parse(body.text());
  // console.log("Request body:", reqBody);
    
  // Get Post Obj from Request
  const {userId, nextKey} = query;

  // Defining Database:
  const db = context.services.get("mongodb-atlas").db("domagne-dev");
  const Post = db.collection("posts");
  const User = db.collection("users");
  var returnList = []
  var returnObj = { "posts": "",
                    "paginateKey": ""
                  }
  var nextNextKey = {}
  var posts = {}
  
  // sort function
  function sortByDate( a, b ){ 
    return ((new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : (new Date(a.createdAt) > new Date(b.createdAt)) ? -1 : 0)
  }
  
  
  
  if ( userId ){
    // get relavent user obj
    const userObj = db.collection("appusers").findOne({ "_id":BSON.ObjectId(userId) });
    following = userObj.following;
    
    const initQuery = { 'user' : { '$in' : following } };
    const sort = ['createdAt', -1];
    if (nextKey){
      const { paginatedQuery, nextKeyFn } = context.functions.execute("generatePaginationQuery", initQuery, sort, nextKey);
      posts = await Post.find(paginatedQuery).limit(20).sort([sort]).toArray();
      posts.forEach(function(results){results._id=results._id.toString(), results.user = results.user.toString(), results.hashtag = results.hashtag.toString()});
      nextNextKey = nextKeyFn(posts);
      posts.sort(sortByDate);
    }else{
      const { paginatedQuery, nextKeyFn } = context.functions.execute("generatePaginationQuery", initQuery, sort);
      posts = await Post.find(paginatedQuery).limit(20).sort([sort]).toArray();
      posts.forEach(function(results){results._id=results._id.toString(), results.user = results.user.toString(), results.hashtag = results.hashtag.toString()});
      nextNextKey = nextKeyFn(posts);
      posts.sort(sortByDate);
    }
  
    for await (const post of posts){
      const postUserObj = await db.collection("appusers").findOne({"_id": BSON.ObjectId(post.user)});
      postUserObj._id = postUserObj._id.toString();
      post.user = postUserObj;
      const postHashtagObj = await db.collection("hashtags").findOne({"_id": BSON.ObjectId(post.hashtag)});
      postHashtagObj._id = postHashtagObj._id.toString();
      post.hashtag = postHashtagObj;
      returnList.push(
                      { 
                        "id": post._id,
                        "assetURL": post.assetURL,
                        "rank": post.rank,
                        "amountSpent": post.amountSpent,
                        "numOfComments": post.comments.length,
                        "numOfLikes": post.likes.length,
                        "user": post.user,
                        "hashtag": post.hashtag,
                        "createdAt": post.createdAt
                      }
                    )
    }
    returnObj.paginateKey = nextNextKey;
  }else{
    const initQuery = { };
    const sort = ['createdAt', -1];
    if (nextKey){
      const { paginatedQuery, nextKeyFn } = context.functions.execute("generatePaginationQuery", initQuery, sort, nextKey);
      posts = await Post.find(paginatedQuery).limit(20).toArray();
      
      posts.forEach(function(results){results._id=results._id.toString(), results.user = results.user.toString(), results.hashtag = results.hashtag.toString()});
      
      nextNextKey = nextKeyFn(posts);
      posts.sort(sortByDate);
      
      for await (const post of posts){
        const postUserObj = await db.collection("appusers").findOne({"_id": BSON.ObjectId(post.user)});
        postUserObj._id = postUserObj._id.toString();
        post.user = postUserObj;
        const postHashtagObj = await db.collection("hashtags").findOne({"_id": BSON.ObjectId(post.hashtag)});
        postHashtagObj._id = postHashtagObj._id.toString();
        post.hashtag = postHashtagObj;
        returnList.push(
                        { 
                          "id": post._id,
                          "assetURL": post.assetURL,
                          "rank": post.rank,
                          "amountSpent": post.amountSpent,
                          "numOfComments": post.comments.length,
                          "numOfLikes": post.likes.length,
                          "user": post.user,
                          "hashtag": post.hashtag,
                          "createdAt": post.createdAt
                          
                        }
                      );
    }
    returnObj.paginateKey = nextNextKey;
    
    }else{
      const sort = ['createdAt', -1];
      const { query, nextKeyFn } = context.functions.execute("generatePaginationQuery", initQuery, sort);
      posts = await Post.find(query).limit(20).toArray()
      
      nextNextKey = nextKeyFn(posts);
      
      posts.forEach(function(results){results._id=results._id.toString(), results.user = results.user.toString(), results.hashtag = results.hashtag.toString()});
  
      posts.sort(sortByDate);
      for await (const post of posts){
        const postUserObj = await db.collection("appusers").findOne({"_id": BSON.ObjectId(post.user)});
        postUserObj._id = postUserObj._id.toString();
        post.user = postUserObj;
        const postHashtagObj = await db.collection("hashtags").findOne({"_id": BSON.ObjectId(post.hashtag)});
        postHashtagObj._id = postHashtagObj._id.toString();
        post.hashtag = postHashtagObj;
        returnList.push(
                        { 
                          "id": post._id,
                          "assetURL": post.assetURL,
                          "rank": post.rank,
                          "amountSpent": post.amountSpent,
                          "numOfComments": post.comments.length,
                          "numOfLikes": post.likes.length,
                          "user": post.user,
                          "hashtag": post.hashtag,
                          "createdAt": post.createdAt
                        }
                      )
    }
    }
    returnObj.paginateKey = nextNextKey;
  }
  returnObj.posts = returnList;
  
  response.setStatusCode(200);
  response.setHeader("Content-Type", "application/json");
  response.setBody(JSON.stringify(returnObj));
  
  return returnObj;
};
