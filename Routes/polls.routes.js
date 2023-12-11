const express = require('express');
const { createPoll, getData, creatQuestions, getAllPolls, updatePoll, serveQuestions, submitPoll, pollAnalytics, allPollAnalytics } = require('../controller/pollController');
const { authentication } = require('../middleware/middleware');
const pollRouter = express.Router();

pollRouter.post("/createPoll",createPoll)
pollRouter.get("/getData",getData)
// pollRouter.post("/createQuestions",creatQuestions)
pollRouter.get("/getAllPolls",getAllPolls)
pollRouter.put("/updatePoll/:pollId",updatePoll)
pollRouter.get("/serveQuestion/:userId",authentication,serveQuestions)
pollRouter.post("/submitPoll/:userId",authentication,submitPoll)
pollRouter.get("pollAnalytics/:pollId",pollAnalytics)
pollRouter.get("/allPollAnalytics",allPollAnalytics)


module.exports={
    pollRouter
}

