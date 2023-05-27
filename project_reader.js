
const fs = require('fs');
const path = require('path');

function readProjectFiles(directoryPath, extension) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      throw err;
    }
    // Iterate through all files in the directory
    files.forEach(file => {
      // Get the full path of the file
      const filePath = path.join(directoryPath, file);
      // Check if the file is a directory
      if (fs.statSync(filePath).isDirectory()) {
        // If the file is a directory, recursively call the function to read its files
        readProjectFiles(filePath, extension);
      } else {
        // If the file is not a directory, check its extension
        if (path.extname(file) === `.${extension}`) { // If the extension matches, read the file contents
          fs.readFile(filePath, (err, data) => {
            if (err) {
              throw err;
            }
            // Do something with the file contents, such as printing them to the console
            console.log(data.toString());
          });
        }
      }
    });
  });
}

// Call the function with the path of the project directory and extension
readProjectFiles('/Users/sagar/WebstormProjects/GPTdev/', 'html'); // This will read all JavaScript files in the directory and subdirectories