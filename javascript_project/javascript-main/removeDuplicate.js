function removeDuplicate(arr) {
    var unique = [];

    for(var i = 0; i < arr.length - 1; i++) {
        if(!unique.includes(arr[i])) {
            unique.push(arr[i]);
        }
    }

    return unique;
}

console.log(removeDuplicate([1,2,2,3,5,5,3,3]));