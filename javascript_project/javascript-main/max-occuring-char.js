function maxOccuringChar(str) {
    var i = 0;
    var pair = {};
    while(i < str.length){
        if(pair[str[i]] == undefined) {
            pair[str[i]] = 1;
        } else {
            pair[str[i]] += 1;
        }
        i++;
    }
    
    var maxCount = 0;
    var maxChar = '';
    for(let char in pair) {
        if(pair[char] > maxCount || (pair[char] == maxCount && char < maxChar)) {
            maxCount = pair[char]; 
            maxChar = char;
        }
    }
    return maxChar;
}

console.log(maxOccuringChar('testsample'));