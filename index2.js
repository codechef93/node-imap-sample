
var Imap = require("imap");
var MailParser = require("mailparser").MailParser;

var imapConfig = {
    user: 'your@outlook.com',
	password: 'your',
	host: 'outlook.office365.com',
	port: 993,
	tls: true,
};

var imap = new Imap(imapConfig);

imap.once("error", function(err) {
    console.log("Connection error: " + err.stack);
});


imap.once('ready', function() {
	imap.openBox("INBOX", false, function(err, mailBox) {
        
            checkMailInbox(imap, function() {
                   
                    console.log('send data');
            }); // check if new truck has arrived
	})
})
    
imap.once('error', function(err) {
	console.log(err);
});

imap.connect();
	
	
function checkMailInbox(imap, cb) {
    imap.search(["UNSEEN"], function(err, results) {
        if(!results || !results.length)
            return;
        //mark as seen
        /*imap.setFlags(results, ['\\Seen'], function(err) {
            if (!err) {
                console.log("marked as read");
            } else {
                console.log(JSON.stringify(err, null, 2));
            }
        });*/

        var f = imap.fetch(results, { bodies: ['TEXT'] });
        f.on("message", processMessage);
        f.once("end", function() {
            cb();
        });
    });
}

function processMessage(msg, seqno) {
    var parser = new MailParser();

    parser.on('data', data => {
        if (data.type === 'text') {
            console.log(data.text);
        }
     });

    msg.on("body", function(stream) {
        stream.on("data", function(chunk) {
            parser.write(chunk.toString("utf8"));
        });
    });
    msg.once("end", function() {
        parser.end();
    });
}