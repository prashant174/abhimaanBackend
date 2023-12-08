const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/config');
const { pollRouter } = require('./Routes/polls.routes');
const { userRouter } = require('./Routes/user.routes');
// const routes = require('./routes');
// const sequelize = require('./config/db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', pollRouter);
app.use("/user",userRouter)

sequelize
  .sync({ force: false }) // Set force to true to drop and recreate tables on every sync
  .then(() => {
    console.log('Database synchronized');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });
