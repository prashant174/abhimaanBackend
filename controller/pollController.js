const { Op } = require("sequelize");
const { Poll, QuestionSet, User, UserPollHistory, PollAnalytics } = require("../models/pollModel")

const createPoll=async(req,res)=>{
    const { title, category, startDate, endDate, minReward, maxReward, questionSets } = req.body;
    try{
        // console.log(pollData)
        const poll= await Poll.create({ title, category, startDate, endDate, minReward, maxReward })

console.log(poll.id,"polll.........")
        for(let questionSet of questionSets){
            await QuestionSet.create({ ...questionSet, pollId: poll.id });
        }
       
        res.status(201).json({ message: 'Poll created successfully', pollId: poll.id });

    }catch(err){
        res.status(500).json({msg:"Something went wrong please try again",err:err.message});
    }
}



const getAllPolls=async(req,res)=>{
    try{
        const polls = await Poll.findAll({
            include: [
              {
                model: QuestionSet,
                as: 'questionSets',
                // attributes: ['id', 'questionType', 'questionText', 'options']
                
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
    
       
        const poll = await Poll.findByPk(pollId);
        if (!poll) {
          return res.status(404).send({ msg: 'Poll not found' });
        }
    
        await poll.update({ title, category, startDate, endDate, minReward, maxReward });
    
       
        for (let questionSet of questionSets) {
          if (questionSet.id) {
            
            const existingQuestionSet = await QuestionSet.findByPk(questionSet.id);
            if (existingQuestionSet) {
              await existingQuestionSet.update({ ...questionSet });
            }
          } else {
            
            await QuestionSet.create({ ...questionSet, PollId: poll.id });
          }
        }
    
        res.json({ message: 'Poll updated successfully' });
      } catch (error) {
        
        res.status(500).send({ error: 'Internal Server Error' });
      }
}

const serveQuestions=async(req,res)=>{
    try {
      const userId = req.params.userId;

   
    const user = await User.findByPk(userId, { include: [{ model: Poll, as: 'votedPolls' }] });
    if (!user) {
      return res.status(404).send({ msg: 'User not found' })
    }

   
    const pollsToServe = await Poll.findAll({
      where: {
        id: {
          [Op.notIn]: user.votedPolls.map((votedPoll) => votedPoll.id),
        },
        endDate: { [Op.gte]: new Date() }, 
      },
    });

    if (pollsToServe.length === 0) {
      return res.status(200).send({ msg: 'No new polls available for the user' })
    }

   
    const firstUnansweredQuestion = await QuestionSet.findOne({
      where: {
        pollId: pollsToServe[0].id,
        id: {
          [Op.notIn]: user.votedPolls.flatMap((votedPoll) => votedPoll.QuestionSets.map((questionSet) => questionSet.id)),
        },
      },
    });

    if (!firstUnansweredQuestion) {
      return res.status(400).send({ message: 'No new questions available for the user' });
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
        res.status(500).send({ msg: 'Internal Server Error' });
      }
}

const submitPoll=async(req,res)=>{
    try {
        const userId = req.params.userId;
        const { pollId, questionId, selectedOption } = req.body;
    
       
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).send({ msg: 'User not found' });
        }
    
        
        const poll = await Poll.findByPk(pollId);
        if (!poll) {
          return res.status(404).send({ msg: 'Poll not found' });
        }
    
    
        const question = await QuestionSet.findByPk(questionId);
        if (!question || question.pollId !== pollId) {
          return res.status(404).send({ msg: 'Question not found or does not belong to the specified poll' });
        }
    
        
        const userHistory = await UserPollHistory.findOne({
          where: {
            userId: userId,
            pollId: pollId,
            questionId: questionId,
          },
        });
    
        if (userHistory) {
          return res.status(400).send({ msg: 'User has already answered this question' });
        }
    
       
        if (!question.options[selectedOption]) {
          return res.status(400).send({ msg: 'Invalid selected option' });
        }
    
        
        const minReward = poll.minReward || 0;
        const maxReward = poll.maxReward || 0;
        const rewardAmount = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
    
       
        await UserPollHistory.create({
          userId: userId,
          pollId: pollId,
          questionId: questionId,
          selectedOption: selectedOption,
        });
    
        
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
    
     
        user.balance += rewardAmount;
        await user.save();
    
        res.status(201).send({ msg: 'Poll submitted successfully', rewardAmount: rewardAmount });
      } catch (error) {
        console.error('Error l:', error);
        res.status(500).send({ msg: 'Internal Server Error' });
      }
    
}

//for testing
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
    
      
        const pollAnalytics = await PollAnalytics.findOne({ where: { pollId } });
    
        if (pollAnalytics) {
          res.status(200).send({msg:"Poll analytics fetched successfully",pollAnalytics:pollAnalytics});
        } else {
          res.status(404).msg({ msg: 'Poll analytics not found' });
        }
      } catch (error) {
        console.error('Error :', error);
        res.status(500).msg({ error: 'Internal Server Error' });
      }
}

const allPollAnalytics=async(req,res)=>{
    try {
        
        const allAnalytics = await PollAnalytics.findAll({
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('totalVotes')), 'totalVotes'],
           
          ],
        });
    
       
        res.status(200).send({msg:"Poll fetched successfully",allAnalytics:allAnalytics})
      } catch (error) {
        console.error('Error ', error);
        res.status(500).send({ error: 'Internal Server Error' })
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