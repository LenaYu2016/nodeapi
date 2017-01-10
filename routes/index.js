var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var request = require('request');

firebase.initializeApp({

  databaseURL: "https://myapp-abca7.firebaseio.com"
});
var db = firebase.database();
var ref = db.ref("server/saving-data/fireblog");
var usersRef = ref.child("users/test");


router.post('/data', function(req, res, next) {
  var name=req.body;
 // var birth=req.body.birth;
  var time=firebase.database.ServerValue.TIMESTAMP;
  usersRef.push(
      //date_of_birth: name,
      //full_name: birth,
      //timestamp:time
      name,function(error){
    if (error) {
      console.log('Synchronization failed');
       res.status(404).json({message:'An error occur!!!',error:error});

    }else {
      console.log('Synchronization succeeded');
    res.status(200).json({message:"succeed!!!"});
   // res.redirect('index');
    }
  });


});
/*router.get('/data', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var data;
  ref.child("users/test").orderByChild('timestamp').limitToLast(1).on('child_added', function(snapshot) {
    console.log( snapshot.val());
    data=snapshot.val();

    res.json(snapshot.val());
  },function(error){
    if (error) {
      console.log('Synchronization failed');
      res.status(404).json({message:'An error occur!!!',error:error});

    } else {
      console.log('Synchronization succeeded');
      res.status(200).json({message:"succeed!!!"});

    }

});


});*/
/*router.get('/weather', function(req, res, next) {

  res.render('weather');

});*/
router.get('/data', function(req, res, next) {

// Retrieve new posts as they are added to our database
  res.setHeader('Content-Type', 'application/json');
var newPost;
 var getvalue= ref.child("users/test").limitToLast(1).on("child_added", function(snapshot, prevChildKey) {
    newPost = snapshot.val();
    console.log("getpost: " + newPost);
       res.status(200).json(newPost);
    },function(error){
       if (error) {
         console.log('Synchronization failed');
         return res.status(404).json({message:'An error occur!!!',error:error});

       } else {
         console.log('Synchronization succeeded');
         res.status(200).json({message:"succeed!!!"});

       }

     }
  );

  //ref.child("users/test").limitToLast(1).off("child_added",getvalue);



});
router.get('/weather', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
if(req.query.city.toLowerCase()!='toronto'&& req.query.city.toLowerCase()!='new york' && req.query.city.toLowerCase()!="tokyo"){
  console.log(req.query.city.toLowerCase());
  return res.status(400).json({Error:"Invalid city"});
}
  request('http://api.openweathermap.org/data/2.5/weather?q='+req.query.city+'&appid=532d313d6a9ec4ea93eb89696983e369',
      function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result=JSON.parse(body);
      console.log(result);

      var temp= result.main.temp-273.15;
      res.status(200).json({temperature:temp.toFixed(0)+"°C"});
    }
    else{
      res.status(400).json({message:'An error occur!!!',error:error});
    }
  })

});

router.get('test', function(req, res, next) {
res.render('weather.hbs');

});

module.exports = router;
