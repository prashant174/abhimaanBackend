const sequelize = require('../config/config');
const { DataTypes, Sequelize, STRING } = require('sequelize');
// const sequelize = require('../config/db');

const Poll = sequelize.define('Poll', {
    id:{
       type:DataTypes.SMALLINT,
       primaryKey:true,
       autoIncrement:true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    minReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
 

  const QuestionSet = sequelize.define('QuestionSet', {
    
    questionType: {
      type: DataTypes.ENUM('single', 'multiple'),
      allowNull: false,
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    rightOption:{
        type:DataTypes.STRING,
        allowNull:false
    },
    userVoted: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });

  // Poll.hasMany(QuestionSet, { as: 'questionSets', foreignKey: 'PollId' });
  Poll.hasMany(QuestionSet, { as: 'questionSets', foreignKey: 'pollId' });

  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
    
  });

  User.hasMany(Poll, { as: 'votedPolls', foreignKey: 'id' });
Poll.belongsTo(User, { foreignKey: 'id' });
  // Poll.belongsToMany(User, { as: 'voters', through: 'UserPolls', foreignKey: 'UserId' });
  // User.hasMany(Poll, { as: 'questionSets', foreignKey: 'userId' });

  // Poll.belongsToMany(User, { as: 'voters', through: 'UserPolls', foreignKey: 'id' });*********
// User.hasMany(Poll, { as: 'votedPolls', foreignKey: 'userId' });
// Poll.belongsTo(User, { foreignKey: 'userId' });

  const UserPollHistory = sequelize.define('UserPollHistory', {
    // pollId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // questionId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    pollId: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
          model: Poll,
          key: 'id',
        },
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    selectedOption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  UserPollHistory.belongsTo(User, { foreignKey: 'userId' });
UserPollHistory.belongsTo(Poll, { foreignKey: 'pollId' });
UserPollHistory.belongsTo(QuestionSet, { foreignKey: 'questionId' });
  
  // UserPollHistory.belongsTo(User, { foreignKey: 'userId' });
  // UserPollHistory.belongsTo(Poll, { foreignKey: 'pollId' });
  // UserPollHistory.belongsTo(QuestionSet, { foreignKey: 'questionId' });

  const PollAnalytics = sequelize.define('PollAnalytics', {
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    optionACount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    optionBCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    optionCCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    
  });

module.exports = {
    Poll,
    QuestionSet,
    User,
    UserPollHistory,
    PollAnalytics
}
