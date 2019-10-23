const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;



app.set('views', __dirname + '/public'); //인덱스 html를 찾는다
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);
app.use(express.static('public')); //서버 실행때 public 폴더안에 파일 로드
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json()); //POST방식의 요청을 받기위해 

let router = require('./router/main')(app); //Main 모듈 기본(경로 설정)
let api = require('./router/api')(app);     //API 모듈

app.listen(port, function(){
    console.log('connection 80 port!!');
});
