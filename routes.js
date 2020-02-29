module.exports = function(app){

    // Get today's zmanim
    app.get('/zmanim', function(req, res){
        var zmanim = require('./controllers/zmanim');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', "localhost");
        res.status(200).send(zmanim.zmanim(new Date()));
    });

    // Get tomorrow's zmanim
    app.get('/zmanim/tomorrow', function(req, res){
        var zmanim = require('./controllers/zmanim');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', "localhost");

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        res.status(200).send(zmanim.zmanim(tomorrow));
    })

    // Get today's date
    app.get('/zmanim/date', function(req, res){
        var zmanim = require('./controllers/zmanim');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', "localhost");
        res.status(200).send(zmanim.date(new Date()));
    });

    // Get tomorrow's date
    app.get('/zmanim/date/tomorrow', function(req, res){
        var zmanim = require('./controllers/zmanim');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', "localhost");

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        res.status(200).send(zmanim.date(tomorrow));
    });
}