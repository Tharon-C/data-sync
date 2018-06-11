var Dat = require("dat-node");
var link = process.argv[2]; // user inputs the dat link
var key = link.replace("dat://", ""); // extract the key
var path = require("path");
var fs = require("fs");
var dir = path.join(process.cwd(), "dat-to-sync"); // make a download folder
var sourceFile = "/test.json";
Dat(
  dir,
  {
    key: key, // (a 64 character hash from proccess above)
    sparse: true
  },
  function(err, dat) {
    if (err) throw err;

    // Join the network & download (files are automatically downloaded and will stay synced with remote archive)
    dat.joinNetwork();

    // Can read archive and write it to a file below. Can sync with remote update on stats events.
    dat.trackStats();
    dat.stats.on("update", () => {
      dat.archive.readFile(sourceFile, (err, content) => {
        fs.readFile("./" + sourceFile, (err, localContent) => {
          const parseContent = JSON.parse(content);
          const parseLocalContent = JSON.parse(localContent);
          const isSame =
            JSON.stringify(parseLocalContent) === JSON.stringify(parseContent);
          console.log(
            parseContent,
            parseLocalContent,
            isSame ? "same" : "different"
          ); // prints remote passwords file!

          // Write
          if (!isSame) {
            fs.writeFile(
              "./" + sourceFile,
              JSON.stringify(parseContent),
              function(err) {
                if (err) throw err;
                console.log("It's saved!");
              }
            );
          }
        });
      });
    });
  }
);
