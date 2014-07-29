var converter = require('./convert');
var express = require('express');
var formidable = require('formidable');
var zipstream = require('zipstream');
var async = require('async');
var fs = require('fs');
var app = express();

var port = 8080;

app.use(express.bodyParser());

app.get('/api',function(req,res){
	res.send(200,'test');
})
app.put('/api/convert',function(req,res){
  var options = {
    format:req.query['format'] || 'video',
    usetimings:req.query['usetimings'] || 'true',
    slidetime:req.query['slidetime'] || '5',
    verticalResolution:req.query['verticalresolution'] || '480',
    fps:req.query['fps'] || '5',
    quality:req.query['quality'] || '85'
  }

  var folder = 'tmp\\';
  var fileName = folder + 'tempfile'+Math.floor((Math.random()*1000000));
  var destName = fileName+'converted';
  var fileStream = fs.createWriteStream(fileName);

  req.pipe(fileStream);

  req.on('end',function(){
    var timestart = new Date().getTime();
    converter.convertPpt(fileName,destName,options,function(err,response){
      if(err){
        res.send(500,err);
      }else {
        console.info('[pptconverter]:File %s converted to %s succesfully',fileName,options.format);
        console.info('[pptconverter]:Conversion time ',(new Date().getTime()-timestart)/1000);
        switch(options.format) {
          // return the presentation converted to video with all the transitions included - very slow
          case 'video':
            res.sendfile(destName+'.mp4 ');
            break;
          // return a video made with the slides converted to images
          case 'videofromjpg':
            var output = destName+".mp4";
            timestart = new Date().getTime();
            converter.convertImagesToVideo(destName+"\\Slide%1d.jpg",output,function(err,stdout){
              if(err) {
                console.error(err);
              } else {
                console.log(stdout);
                console.info('[ffmpeg]:Conversion time ',(new Date().getTime()-timestart)/1000);
                res.sendfile(output);  
              }
            })
            break;
          // Returns zip file with all the slides as images
          case 'png':
          case 'jpg':
            var zip = zipstream.createZip({ level: 1 });
            zip.pipe(res);
            
            fs.readdir(destName, function(err,files){
              var len = files.length;
              var count = 0;
              async.eachSeries(files, function(file, done){
                zip.addFile(fs.createReadStream(destName+'\\'+file), { store: true,name:file }, function(){
                  done();
                })
              }, function(){
                zip.finalize(function(written) { console.log(written + ' total bytes written'); });
            });
            })
            break;
          default:
            res.send(501, "format not supported");
        }
      }
    })
  })
  
  req.on('error',function(err){
    console.error('error converting file '+fileName+' '+err)
    res.send(err);
  })
});

app.listen(port);
console.log('pptconverter listening on port '+port);