const Web3 = require('web3');
const db = require('../db/db_conn');
const web3 = new Web3();
const url = 'http://localhost:8545';

web3.setProvider(new Web3.providers.HttpProvider(url));

module.exports = function(app){
    const searchUserPassword = async (myAccount) =>{
        return new Promise((resolve, reject) => {
            let sql = `select user_password from member where user_pub_key = '${myAccount}'`;
            db.query(sql, function(err,rows,fields){
                if(err){
                    reject(err);
                }
                else {
                    resolve(rows[0].user_password);
                }
            });
        });
    }
    app.get('/api/test', function (req,res){
        res.send('api test!!');
    });
    app.get('/api/', async(req,res) => {
        let accounts;
        accounts = await web3.eth.getCoinbase();
        res.send(accounts);
        
    });
    app.get('/api/getAccountList', async(req,res) => {
        let accounts;
        let accounts_bal = new Array();
        accounts = await web3.eth.getAccounts();
        res.send(accounts);

    });
    app.get('/api/getBalance', async(req, res) => {
        // let accounts = new Array();
        // let accounts_bal = new Array();
        // accounts = await web3.eth.getAccounts();
        // let i;
        // for(let i = 0; i < accounts.length; i++){
        //     accounts_bal[i] = await web3.utils.fromWei(await web3.eth.getBalance(accounts[i]));
        // }
        // res.send(`${accounts}  ${accounts_bal}`);

        let account = req.query.account;
        result = await web3.eth.getBalance(account);
        result = web3.utils.fromWei(result,"ether");
        res.send(result);
    });
    app.post('/api/newAccount', async(req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let result = await web3.eth.personal.newAccount(password);
        let sql = `insert into member (user_email, user_password, user_pub_key) values ('${email}', '${password}', '${result}')`;

        db.query(sql,function(err, rows, fields){
            if(err){
                console.log(err);
            }
            else{
                console.log(rows);
            }
        });
        console.log(password);
        console.log(email);
        res.send('post!!!!');
    });

    app.post('/api/login', async(req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let result;
        let sql_search = `select user_email, user_password, user_pub_key from member where user_email = '${email}'`;

        db.query(sql_search, function(err, rows, fields){
            if(err){
                console.log(err);
            }
            else{
                
                if(rows[0].user_email == email && rows[0].user_password == password){
                    result = rows[0].user_pub_key;
                    console.log("일치합니다");
                    res.send(result);
                }
            }
        });
        console.log(password);
        console.log(email);
    });


    app.post('/api/getLoginBalance', async(req, res) => {
        let account = req.body.myAccount;
        let result = await web3.eth.getBalance(account);
        let result_ether = await web3.utils.fromWei(result,'ether');
        console.log(result_ether);
        res.send(result_ether);
    });
    
    app.post('/api/getEther', async(req, res) =>{
        let account = req.body.myAccount; 
        await web3.eth.personal.unlockAccount('0xe493E4bD3796c2Ad13c101970D33A8E41605B158','',0); //보낼때 언락 되어야된다
        let result = await web3.eth.sendTransaction({
        from: '0xe493E4bD3796c2Ad13c101970D33A8E41605B158',
        to: account,
        value : web3.utils.toWei('5','ether')
        });
        let wei_result = "5";
        console.log(wei_result);
        res.send(wei_result);
    });

    app.post('/api/sendEther', async(req, res) =>{
        let myAccount = req.body.myAccount; 
        let otherAccount = req.body.otherAccount;
        let password = await searchUserPassword(myAccount);
        
        let ether = req.body.ether;

        await web3.eth.personal.unlockAccount(myAccount, password ,0); //보낼때 언락 되어야된다
        let result = await web3.eth.sendTransaction({
        from: myAccount,
        to: otherAccount,
        value : web3.utils.toWei(ether,'ether')
        });
        
        console.log(myAccount);
        console.log(otherAccount);
        res.send(ether);
    });

    app.post('/api/otherAccountBalance', async(req, res) =>{
        let otherAccount = req.body.otherAccount;
        let result = await web3.eth.getBalance(otherAccount);
        let result_ether = await web3.utils.fromWei(result,'ether');
        console.log(result_ether);
        res.send(result_ether);
    })
}