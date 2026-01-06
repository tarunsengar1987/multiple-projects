function removeChars(s1, s2) {
    //code here
    var newString = '';
    for(var i = 0; i < s1.length; i++) {
        var isCharacterMatch = false;
        for(var j = 0; j < s2.length; j++) {
            if(s2[j] == s1[i]) {
                isCharacterMatch = true;
                break;
            }
        }
        if(isCharacterMatch == false) {
            newString += s1[i];
        }
    }
    
    return newString;
}

console.log(removeChars('computer', 'car'));