const fs = require('fs');

function writeToSpecificPartOfFile(filePath, position, content, callback) {
    const writeStream = fs.createWriteStream(filePath, { flags: 'r+' });
    writeStream.on('error', callback);
    writeStream.on('open', () => {
        writeStream.write(content, 'utf8', (error) => {
            if (error) {
                writeStream.end();
                return callback(error);
            }
            writeStream.end(() => {
                callback(null); // Success
            });
        });
    });
}

// Usage example
const filePath = 'path/to/file.txt';
const position = 42; // Specify the position in the file where you want to write
const content = 'Hello, world!'; // The content you want to write

writeToSpecificPartOfFile(filePath, position, content, (error) => {
    if (error) {
        console.error('Error writing to file:', error);
    } else {
        console.log('Successfully wrote to file.');
    }
});
