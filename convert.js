var exec = require('child_process').exec;

var convertPpt = function(sourceFile,destFile,options,cb) {
  var command = "converter\\pptconverter.exe "+sourceFile
  +' '+destFile
  +' '+options.format
  +' '+options.usetimings
  +' '+options.slidetime
  +' '+options.verticalResolution
  +' '+options.fps
  +' '+options.quality;
  console.info(command);
  exec(command, function (err, stdout, stderr) {
    if(err) {
      console.error('[Error] Executing convert command '+err)
      cb(err);
    } else {
      if(stderr) {
        console.error('[Error] converting ppt file'+stderr)
      }
      cb(stderr,stdout);
    }
  })
};

var convertImagesToVideo = function(filename,destname,cb){
  var command = "avconv\\avconv.exe -r 1/5 -i " + filename + " -vf \"crop=((in_w/2)*2):((in_h/2)*2)\" "+ destname;
  console.log(command);
  exec(command, function(err, stdout, stderr){
    if(err) {
      console.error("[Error] Executing ffmpeg"+err);
      cb(err);
    } else {
      cb(null,stdout);
    }
  })
}
exports.convertImagesToVideo = convertImagesToVideo
exports.convertPpt = convertPpt;