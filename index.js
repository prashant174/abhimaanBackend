const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/config');
const { pollRouter } = require('./Routes/polls.routes');
const { userRouter } = require('./Routes/user.routes');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.get("/",(req,res)=>{
  res.status(200).send("<h1>Abhimaan Innovation Pvt. ltd.</h1>")
})
app.use('/poll', pollRouter)
app.use("/user",userRouter)

sequelize
  .sync({ force: false }) 
  .then(() => {
    console.log('Database synchronized');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });
