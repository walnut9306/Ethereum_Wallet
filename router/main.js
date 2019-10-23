const db = require('../db/db_conn');
module.exports = function(app)
{
    app.get('/', (req,res) => {
        res.render('wallet.html');      //루트 경로를 wallet.html로
    });
}