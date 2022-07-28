var imapConfig = {
    user: 'your@outlook.com',
	password: 'your',
	host: 'outlook.office365.com',
	port: 993,
	tls: true,
};


var Imap = require("imap");
var MailParser = require("mailparser").MailParser;

const parseInfo = require('./parseInfo');

var imap = new Imap(imapConfig);

imap.once("error", function(err) {
    console.log("Connection error: " + err.stack);
});

imap.connect();
imap.once('ready', function() {
	imap.openBox("INBOX", false, function(err, mailBox) {
		imap.on('mail', function(id) {
			imap.search([ 'NEW' ], function(err, results) {
			   if (err || !results.length) return;

				var f = imap.fetch(results, { bodies: "" });
				f.on("message", processMessage);
				f.once("end", function() {
					console.log('End Read Emails.');
				});
			});
		});
	})
})

function processMessage(msg, seqno) {
    var parser = new MailParser();

    parser.on('data', data => {
        if (data.type === 'text') {
            const info = parseInfo(data.text);
            console.log(info);
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

