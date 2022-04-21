// CREATE POST FUNCTION.
// INPUT: POST OBJECT IN DOCUMENT FORM (DATA MODEL: https://lucid.app/lucidchart/c309d096-1c62-4850-b2ae-8ed7b8c5f73d/edit?page=0_0&invitationId=inv_a7f83edc-9be4-4e10-ac2f-8632a62d3cc8#)
// OUTPUT: CREATED POST OBJECT FROM DATABASE

// created by Krishna Chetan on 3/4/21

exports = async function({ query, headers, body}, response) {
    
    const postObj = JSON.parse(body.text());
    
    // Get Post Obj from Request
    // const {postObj} = query;

    // Defining Database:
    const db = context.services.get("mongodb-atlas").db("domagne-dev");
    
    function sortByDate( a, b ){
      return ((new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : (new Date(a.createdAt) > new Date(b.createdAt)) ? -1 : 0)
    }
      
          //figure out rank: query all posts under the same hashtag, sort by amountSpent, O(n) loop to find rank of post
          const hashtagObj = await db.collection("hashtags").findOne( { "name": postObj.hashtag.name } );
          var rank = 1;
          if (typeof hashtagObj != "undefined" && hashtagObj != null){
            hashtagObj._id = hashtagObj._id.toString();
            const allPosts = await db.collection("posts").find({ "hashtag": BSON.ObjectId(hashtagObj._id) }).toArray();
            allPosts.forEach(function(post){post._id=post._id.toString()});
            if (allPosts.length !== 0){
              allPosts.sort(sortByDate);
              
              for await (var x of allPosts){
                if (x.amountSpent >= postObj.amountSpent){
                  rank += 1;
                }
                else{
                  x.rank = x.rank+1;
                  db.collection("posts").updateOne(
                    { "_id" : BSON.ObjectId(x._id) },
                    { "$set": { "rank" : x.rank } }
                  );
                }
            }
            }
            
        }
          
          
          
          //get currentUser object
          const currentUser = await db.collection("appusers").findOne({ "_id":BSON.ObjectId(postObj.user._id)})
            
          
          // postObj.createdAt = new Date(postObj.createdAt);

          // postObj.updatedAt = new Date(postObj.updatedAt);
          
          var createPostObj = {};
              createPostObj = {
              "hashtag": typeof hashtagObj != "undefined" ? hashtagObj : postObj.hashtag.name,
              "comments": [],
              "likes": [],
              "flags": [],
              "user": BSON.ObjectId(postObj.user._id),
              "caption": typeof postObj.caption != "undefined" ? postObj.caption : "",
              "rank": rank,
              "assetURL": postObj.assetURL,
              "amountSpent": postObj.amountSpent,
              "amountEarned": 0,
              "contributions": [],
              "createdAt": typeof postObj.createdAt != "undefined" ? postObj.createdAt : new Date().toString(),
              "updatedAt": typeof postObj.updatedAt != "undefined" ? postObj.updatedAt : new Date().toString(),
              "claimCode": typeof postObj.claimCode != "undefined" ? postObj.claimCode : "",
              "nftId": typeof postObj.nftId != "undefined" ? postObj.nftId : ""
            }
          
          //insert post into database
          var insertedPostId = await db.collection("posts").insertOne(createPostObj);
          insertedPostId = insertedPostId.insertedId;
          
          const returnPost = await db.collection("posts").findOne({"_id": insertedPostId });
          
          returnPost._id = insertedPostId.toString();
          
          currentUser.posts.push(BSON.ObjectId(returnPost._id));
          
          db.collection("appusers").updateOne(
            { "_id" : BSON.ObjectId(postObj.user._id) },
            { "$set": { "posts" : currentUser.posts } }
          );
          
          //update data points if hashtag needs to be created
          if(!hashtagObj){
            currentUser._id = currentUser._id.toString()
            createTagObj = {
            "name": postObj.hashtag.name,
            "rankOneAmount": typeof postObj.amountSpent != "undefined" ? postObj.amountSpent : 0,
            "popularity": 0
            }
          
            var insertedHashtagId = await db.collection("hashtags").insertOne(createTagObj);
            insertedHashtagId = insertedHashtagId.insertedId;
            
            const hashtag = await db.collection("hashtags").findOne({"_id": insertedHashtagId });
            hashtag._id = insertedHashtagId.toString();
            
            db.collection("posts").updateOne(
              { "_id" : BSON.ObjectId(returnPost._id) },
              { "$set": { "hashtag" : BSON.ObjectId(hashtag._id) } }
            );
            
            returnPost.hashtag = hashtag;
          }else{
            hashtagObj._id = hashtagObj._id.toString();
            currentUser._id = currentUser._id.toString();
            // update Hashtag.rankOneAmount if this is a rank 1 post
            if (returnPost.rank == 1){
              hashtagObj.rankOneAmount = returnPost.amountSpent;
              db.collection("hashtags").updateOne(
                { "_id" : BSON.ObjectId(hashtagObj._id) },
                { "$set": { "rankOneAmount" : hashtagObj.rankOneAmount } }
              );
            }
            
            // update post object hashtag with the hashtag object in database
            db.collection("posts").updateOne(
              { "_id" : BSON.ObjectId(returnPost._id) },
              { "$set": { "hashtag" : BSON.ObjectId(hashtagObj._id) } }
            );
            returnPost.hashtag = hashtagObj;
          }
          
          const returnUser = await db.collection("appusers").findOne({"_id": returnPost.user});
          returnPost.user = returnUser;

          response.setStatusCode(200);
          response.setHeader("Content-Type", "application/json");
          response.setBody(JSON.stringify(returnPost));
          
          return returnPost;
    // })
}