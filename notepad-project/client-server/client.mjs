import express from 'express';

const app = express();
app.set('port', 3000);

app.use(express.static('./static'));

app.get('/', (req, res) => {
  //res.render('./static/index.html');
  res.sendFile('./static/index.html');
});

app.listen(app.get('port'));