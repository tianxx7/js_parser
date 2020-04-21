var readline = require('readline');
rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var arr = [];
rl.on('line', function(data) {
    if (data == null || data =='' || data == -1) {
        var result = deal(arr);
        result.forEach(i=>console.log(i))
        return;
    } else {
        arr.push(Number(data));
    }   
});
function deal(arr) {
    arr.sort((a,b) => {return a-b;})
    return arr;
}