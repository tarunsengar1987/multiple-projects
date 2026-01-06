//Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
//You may assume that each input would have exactly one solution, and you may not use the same element twice.
//You can return the answer in any order.
//Example 1:

//Input: nums = [2,7,11,15], target = 9
//Output: [0,1]
//Output: Because nums[0] + nums[1] == 9, we return [0, 1].

function getTargetIndex(arr, target)
{
    var dict = {};
    for(var i = 0; i < arr.length; i++) {
        var no2 = target - arr[i];
        if(dict[no2] != undefined) {
            return [dict[no2], i]
        } else {
            dict[arr[i]] = i;
            console.log(dict);
        }
    }
    return null;
}

console.log(getTargetIndex([1,5,9,8], 10));