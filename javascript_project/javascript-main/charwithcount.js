var output = '';

function resolveString(input) {
    var count = 1;
    for(var i =0; i < input.length - 1; i++) {
        if(input[i] == input[i+1]){
            count++;
        } else {
            output = output + count + input[i-1];
            count = 1;
        }
    }
    output = output + count + input[i-1];
    return output;
}

console.log(resolveString('fffrrttttyyy'));