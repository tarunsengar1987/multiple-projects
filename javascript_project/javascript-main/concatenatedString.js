//Remove common characters and concatenate
// two strings s1 and s2. Modify both the strings such that all the common characters of s1 and s2 are to be removed and the uncommon characters of s1 and s2 are to be concatenated.
//Note: If all characters are removed print -1.
//example
//s1 = aacdb
//s2 = gafd
//Output: cbgf
console.log(concatenatedString('aacdb', 'gafd'));
function concatenatedString(s1, s2)
{
    var output = '';
    for(var i = 0; i < s1.length; i++) {
        if(!s2.includes(s1[i])) {
            output += s1[i]    
        } 
    }
    for(var i = 0; i < s2.length; i++) {
        if(!s1.includes(s2[i])) {
            output += s2[i]    
        } 
    }
    return output.length == 0 ? -1 : output;
}