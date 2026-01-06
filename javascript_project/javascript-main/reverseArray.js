function reverseArray(arr)
{
    var startnode = 0;
    var endnode = arr.length - 1;
    while(startnode < endnode) 
    {
        var temp = arr[startnode];
        arr[startnode] = arr[endnode];
        arr[endnode] = temp;
        startnode++;
        endnode--;
    }


    return arr;
}

console.log(reverseArray([2,3,1,5,6,7,3]));