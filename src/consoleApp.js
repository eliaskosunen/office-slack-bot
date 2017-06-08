const readline = require('readline');
const myBot = require('./bot');
const DickbuttService = require('./dickbuttService');

myBot.setNotifyFunc((output) => console.log('ERROR: ' + output));

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const dickbutt = new DickbuttService(true, () => {
    console.log("kokpers");
});

rl.on('line', function(line){
    myBot.handle(line, { name: 'console', email: 'console@test.com' }).then(result => console.log(result));
});
