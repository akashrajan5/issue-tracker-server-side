const express = require('express');
const app = express();
const helmet = require('helmet');
const middleware = require('./src/middlewares/index');
const routes = require('./src/routes/index');
const sequelize = require('./src/config/sqlConfig');
const port = 5000;


// check database connection 
sequelize.checkConn().then(res => console.log(res)).catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.disable('x-powered-by');
app.use(middleware.cors);


app.get('/', (req, res) => {
    res.send('Issue tracker is running ¯\\_(ツ)_/¯');
});


app.use('/auth', routes.auth);
app.use('/project', routes.project);
app.use('/issue', routes.issue);



app.listen(port, () => console.log(`Example app listening on port ${port}`));