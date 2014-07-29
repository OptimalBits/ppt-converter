var request = require('request');
var fs = require('fs');

var filePath = 'examples/test1.ppt';

var fileStream = fs.createReadStream(filePath);

var destStream = fs.createWriteStream(filePath+'.wmv');

var r = request.put('http://localhost:8080/api/convert?format=videofromjpg');

r.on('end',function(err,res){
  console.info('ended without errors');
})
r.on('close',function(err){
  console.error('ended with errores'+err);
})
r.on('error',function(err){
  console.error(err);
})
fileStream.pipe(r).pipe(destStream);