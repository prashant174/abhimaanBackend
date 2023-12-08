// routes/index.js

const express = require('express');
const { createPoll, getData, creatQuestions, getAllPolls, updatePoll, serveQuestions } = require('../controller/pollController');
const pollRouter = express.Router();

pollRouter.post("/createPoll",createPoll)
pollRouter.get("/getData",getData)
// pollRouter.post("/createQuestions",creatQuestions)
pollRouter.get("/getAllPolls",getAllPolls)
pollRouter.put("/updatePoll/:pollId",updatePoll)
pollRouter.get("/serveQuestion/:userId",serveQuestions)

module.exports={
    pollRouter
}
// const UserController = require('../controllers/userController');

// router.get('/users', UserController.getAllUsers);
// router.get('/users/:id', UserController.getUserById);
// router.post('/users', UserController.createUser);
// router.put('/users/:id', UserController.updateUser);
// router.delete('/users/:id', UserController.deleteUser);

// module.exports = router;
