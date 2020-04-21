var readline = require('readline');
var Lexer = require('./Lexer').lexer;
var Parser = require('./Parser').parser;
var Script = require('./Script').script;
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

var lexer = Lexer();
var parser = Parser();
var script = Script();
rl.on('line',function(line){
    if ('exit' == line) {
        process.exit();
    }
    var code = line
    // var tokenReader = lexer.tokenize(code);
    // console.log(tokenReader);
    var ast = parser.parse(code);
    var result = script.evalfunc(ast);
    console.log(result);
})
rl.on('close',function(){
    process.exit();
})