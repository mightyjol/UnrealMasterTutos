const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream(__dirname + '/projectFile.zip');
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});
  
// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
    // log warning
        console.log(err)
    } else {
        console.log(err)
        // throw error
        throw err;
    }
});
  
// good practice to catch this error explicitly
archive.on('error', function(err) {
    console.log(err)
    throw err;
});
  
// pipe archive data to the file
archive.pipe(output);
  
  
// append files from a sub-directory and naming it `new-subdir` within the archive
archive.directory('Content/', 'Content');
archive.directory('Config/', 'Config');

// append files from a glob pattern
archive.glob('*.uproject', {cwd: __dirname});

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();