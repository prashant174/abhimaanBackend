const { Op } = require("sequelize");
const { Poll, QuestionSet, User, UserPollHistory, PollAnalytics } = require("../models/pollModel")

const createPoll=async(req,res)=>{
    const { title, category, startDate, endDate, minReward, maxReward, questionSets } = req.body;
    try{
        // console.log(pollData)
        const poll= await Poll.create({ title, category, startDate, endDate, minReward, maxReward })

console.log(poll.id,"polll.........")
        for(let questionSet of questionSets){
            await QuestionSet.create({ ...questionSet, PollId: poll.id });
        }
        // console.log(poll.id)
        res.status(201).json({ message: 'Poll created successfully', pollId: poll.id });

    }catch(err){
        res.status(500).json({msg:"Something went wrong please try again",err:err.message});
    }
}

// const creatQuestions=async(req,res)=>{
//     const questionData=req.body;
//     try{
//         const questions=await QuestionSet.create(questionData)
//         console.log(questionData)
//         res.status(201).send({msg:"Questions created successfully",Que:questionData})
//     }catch(err){
//         res.status(500).send({msg:"Something went wrong please try again",err:err.message})
//     }
// }

const getAllPolls=async(req,res)=>{
    try{
        const polls = await Poll.findAll({
            include: [
              {
                model: QuestionSet,
                as: 'questionSets',
                attributes: ['id', 'questionType', 'questionText', 'options']
                
              },
              {
                model: PollAnalytics,
                attributes: ['totalVotes'],
              },
              
            ],
          });

          res.status(200).send({msg:"All avialable polls",polls:polls})

    }catch(err){
        res.status(500).send({msg:"Something went wrong please try again",err:err.message})
    }
}

const updatePoll=async(req,res)=>{
    try {
        const pollId = req.params.pollId;
        const { title, category, startDate, endDate, minReward, maxReward, questionSets } = req.body;
    
        // Update poll details
        const poll = await Poll.findByPk(pollId);
        if (!poll) {
          return res.status(404).json({ error: 'Poll not found' });
        }
    
        await poll.update({ title, category, startDate, endDate, minReward, maxReward });
    
        // Update or add question sets sequentially
        for (let questionSet of questionSets) {
          if (questionSet.id) {
            // Update existing question set
            const existingQuestionSet = await QuestionSet.findByPk(questionSet.id);
            if (existingQuestionSet) {
              await existingQuestionSet.update({ ...questionSet });
            }
          } else {
            // Add new question set
            await QuestionSet.create({ ...questionSet, PollId: poll.id });
          }
        }
    
        res.json({ message: 'Poll updated successfully' });
      } catch (error) {
        console.error('Error updating poll:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const serveQuestions=async(req,res)=>{
    try {
        const userId = req.params.userId;
    
        // Logic to fetch polls and serve questions to the user based on their voting history
        const user = await User.findByPk(userId, { include: [{ model: Poll, as: 'votedPolls' }] });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Find polls that the user has not voted on
        const pollsToServe = await Poll.findAll({
          where: {
            id: {
              [Op.notIn]: user.votedPolls.map((votedPoll) => votedPoll.id),
            },
            endDate: { [Op.gte]: new Date() }, // Only consider polls that are still active
          },
        });
    
        if (pollsToServe.length === 0) {
          return res.json({ message: 'No new polls available for the user' });
        }
    
        // Find the first unanswered question in the first available poll
        const firstUnansweredQuestion = await QuestionSet.findOne({
          where: {
            pollId: pollsToServe[0].id,
            id: {
              [Op.notIn]: user.votedPolls.flatMap((votedPoll) => votedPoll.QuestionSets.map((questionSet) => questionSet.id)),
            },
          },
        });
    
        if (!firstUnansweredQuestion) {
          return res.json({ message: 'No new questions available for the user' });
        }
    
        res.json({
          message: 'Question served successfully',
          pollTitle: pollsToServe[0].title,
          question: {
            id: firstUnansweredQuestion.id,
            questionType: firstUnansweredQuestion.questionType,
            questionText: firstUnansweredQuestion.questionText,
            options: firstUnansweredQuestion.options,
          },
        });
      } catch (error) {
        console.error('Error serving question to user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const submitPoll=async(req,res)=>{
    try {
        const userId = req.params.userId;
        const { pollId, questionId, selectedOption } = req.body;
    
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Check if the poll exists
        const poll = await Poll.findByPk(pollId);
        if (!poll) {
          return res.status(404).json({ error: 'Poll not found' });
        }
    
        // Check if the question exists
        const question = await QuestionSet.findByPk(questionId);
        if (!question || question.pollId !== pollId) {
          return res.status(404).json({ error: 'Question not found or does not belong to the specified poll' });
        }
    
        // Check if the user has already answered this question
        const userHistory = await UserPollHistory.findOne({
          where: {
            userId: userId,
            pollId: pollId,
            questionId: questionId,
          },
        });
    
        if (userHistory) {
          return res.status(400).json({ error: 'User has already answered this question' });
        }
    
        // Validate the selected option
        if (!question.options[selectedOption]) {
          return res.status(400).json({ error: 'Invalid selected option' });
        }
    
        // Calculate the reward (you need to implement your own reward logic)
        const minReward = poll.minReward || 0;
        const maxReward = poll.maxReward || 0;
        const rewardAmount = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
    
        // Update user data and user poll history
        await UserPollHistory.create({
          userId: userId,
          pollId: pollId,
          questionId: questionId,
          selectedOption: selectedOption,
        });
    
        // Update poll analytics
        const pollAnalytics = await PollAnalytics.findOne({ where: { pollId: pollId } });
        if (pollAnalytics) {
          pollAnalytics.totalVotes += 1;
          pollAnalytics[`option${selectedOption}Count`] += 1;
          await pollAnalytics.save();
        } else {
          await PollAnalytics.create({
            pollId: pollId,
            totalVotes: 1,
            [`option${selectedOption}Count`]: 1,
          });
        }
    
        // Update user's balance or rewards field
        user.balance += rewardAmount;
        await user.save();
    
        res.json({ message: 'Poll submitted successfully', rewardAmount: rewardAmount });
      } catch (error) {
        console.error('Error submitting poll:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    
}

const getData=async(req,res)=>{
    try{
           const data= await QuestionSet.findAll()
           res.status(200).send({msg:"fetched",data:data})
    }catch(err){
        res.status(500).send({msg:"Something went wrong please try again",err:err.message})
    }
}

const pollAnalytics=async(req,res)=>{
    try {
        const pollId = req.params.pollId;
    
        // Fetch analytics for a particular poll
        const pollAnalytics = await PollAnalytics.findOne({ where: { pollId } });
    
        if (pollAnalytics) {
          res.json(pollAnalytics);
        } else {
          res.status(404).json({ error: 'Poll analytics not found' });
        }
      } catch (error) {
        console.error('Error fetching poll analytics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const allPollAnalytics=async(req,res)=>{
    try {
        // Fetch overall analytics for all polls
        const overallAnalytics = await PollAnalytics.findAll({
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('totalVotes')), 'totalVotes'],
            // Add other aggregated statistics as needed
          ],
        });
    
        res.json(overallAnalytics);
      } catch (error) {
        console.error('Error fetching overall poll analytics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


module.exports={
    createPoll,
    // creatQuestions,
    getData,
    getAllPolls,
    updatePoll,
    serveQuestions,
    submitPoll,
    pollAnalytics,
    allPollAnalytics
}