const Top5List = require('../models/top5list-model');
const User = require('../models/user-model');

createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    const top5List = new Top5List(body);
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    // REMEMBER THAT OUR AUTH MIDDLEWARE GAVE THE userId TO THE req
    console.log("top5List created for " + req.userId);
    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.top5Lists.push(top5List._id);
        user
            .save()
            .then(() => {
                top5List
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            top5List: top5List
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Top 5 List Not Created!'
                        })
                    })
            });
    })
}
deleteTop5List = async (req, res) => {
    console.log("delete Top 5 List with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({
                        errorMessage: "authentication error"
                    });
                }
            });
        }
        asyncFindUser(top5List);
    })
}
getTop5ListById = async (req, res) => {
    console.log("Find Top 5 List with id: " + JSON.stringify(req.params.id));

    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        return res.status(200).json({ success: true, top5List: list })
    }).catch(err => console.log(err))
}
getTop5ListPairs = async (req, res) => {
    console.log("getTop5ListPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Top5Lists owned by " + email);
            await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
                console.log("found Top5Lists: " + JSON.stringify(top5Lists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    console.log("!top5Lists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    console.log("Send the Top5List pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            items: list.items,
                            ownerEmail: list.ownerEmail,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            views: list.views,
                            comments: list.comments,
                            createdAt: list.createdAt,
                            published: list.published
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getTop5ListPairsByUser = async (req, res) => {
    console.log("getTop5ListPairsByUser");
    await User.findOne({ email: req.params.user }, (err, user) => {
        console.log("find user with id " + req.params.user);
        async function asyncFindList(email) {
            console.log("find all Top5Lists owned by " + email);
            await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
                console.log("found Top5Lists: " + JSON.stringify(top5Lists));
                if (err) {
                    return res.status(200).json({ success: true, userListsArray: [] })
                }
                if (!top5Lists) {
                    console.log("!top5Lists.length");
                    return res
                        .status(200)
                        .json({ success: true, userListsArray:[] })
                }
                else {
                    console.log("Send the Top5List pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            items: list.items,
                            ownerEmail: list.ownerEmail,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            views: list.views,
                            comments: list.comments,
                            createdAt: list.createdAt,
                            published: list.published
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, userListsArray: pairs })
                }
            })
        }
        if (user){
            asyncFindList(user.email);
        }else{
            return res.status(200).json({ success: true, userListsArray: [] })
        }
    })
}
getAllTop5Lists = async (req, res) => {
    console.log("getAllMethod")
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        else {
            console.log(top5Lists);
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                let pair = {
                    _id: list._id,
                    name: list.name,
                    items: list.items,
                    ownerEmail: list.ownerEmail,
                    likes: list.likes,
                    dislikes: list.dislikes,
                    comments: list.comments,
                    views: list.views,
                    createdAt: list.createdAt,
                    published: list.published
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, allListsArray: pairs })
        }
    }).catch(err => console.log(err))
}
updateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    console.log("req.body.name, req.body.items: " + req.body.top5List.name + ", " );

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        top5List.name = body.top5List.name;
        top5List.items = body.top5List.items;
        top5List.likes = body.top5List.likes;
        top5List.dislikes = body.top5List.dislikes;
        top5List.comments = body.top5List.comments;
        top5List.views = body.top5List.views;
        top5List.createdAt = body.top5List.createdAt;
        top5List.published = body.top5List.published;
        top5List
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
    })
}

module.exports = {
    createTop5List,
    deleteTop5List,
    getTop5ListById,
    getTop5ListPairs,
    getTop5ListPairsByUser,
    getAllTop5Lists,
    updateTop5List
}
