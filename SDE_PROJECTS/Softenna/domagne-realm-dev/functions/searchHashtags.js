/* 
  SEARCH HASHTAGS FUNCTION.
  INPUT: SEARCH TOKEN AS STRING
  OUTPUT: LIST OF OBJECTS EACH CONTAINING HASHTAG NAME, HASHTAG TOP RANK AMOUNT, HASHTAG ID
  *NOTE: IN ORDER TO OPTIMIZE CLIENT SIDE EFFICIENCY WE WILL ONLY BE SENDING THE TOP LEVEL INFORMATION 
*/

// created by Krishna Chetan on 3/10/21

exports = async function({ query, headers, body}, response){
  
  // const userId = JSON.parse(body.text());
  // console.log("Request body:", reqBody);
    
  // Get Post Obj from Request
  const {name, nextKey} = query;

  // Defining Database:
  const db = context.services.get("mongodb-atlas").db("domagne-dev");
  
  function sortByAmount( a, b ){
    return ((a.rankOneAmount < b.rankOneAmount) ? 1 : (a.rankOneAmount > b.rankOneAmount) ? -1 : 0)
  }
  // //paginated
  // const initQuery = { '$text': { '$search': name } };
  // const sort = ['rankOneAmount', -1];
  // var hashtags = {};
  //   if (nextKey){
  //     const { paginatedQuery, nextKeyFn } = context.functions.execute("generatePaginationQuery", initQuery, sort, nextKey);
  //     hashtags = await db.collection("hashtags").find(paginatedQuery).limit(10).sort([sort]).toArray();
  //     hashtags.forEach(function(results){results._id=results._id.toString()});
  //     nextNextKey = nextKeyFn(hashtags);
  //     hashtags.sort(sortByAmount);
  //   }else{
  //     const { paginatedQuery, nextKeyFn } = context.functions.execute("generatePaginationQuery", initQuery, sort);
  //     hashtags = await db.collection("hashtags").find(paginatedQuery).limit(10).sort([sort]).toArray();
  //     hashtags.forEach(function(results){results._id=results._id.toString()});
  //     nextNextKey = nextKeyFn(hashtags);
  //     hashtags.sort(sortByAmount);
  //   }
  
  const hashtags = await db.collection("hashtags").find(
    { '$text': { '$search': name } },
    { 'score': { '$meta': "textScore" } }
  ).sort({ 'score': { '$meta': "textScore" } }).toArray();
  
  
  const returnArr = []
  // userPosts.forEach( (photo) => { photos.push(photo); } );
  
  for await (const hashtag of hashtags){
    const rankOnePost = await db.collection("posts").findOne( 
      { 
        "rank": 1,
        "hashtag": BSON.ObjectId(hashtag._id.toString())
      }
    )
    const assetURL = rankOnePost.assetURL;
    returnArr.push({ "hashtagId": hashtag._id, "name": hashtag.name, "rankOneAmount": hashtag.rankOneAmount, "assetUrl": assetURL })
  }
                          
  response.setStatusCode(200);
  response.setHeader("Content-Type", "application/json");
  response.setBody(JSON.stringify(returnArr));
  
  return returnArr;
};