function bubbleSort(arr) {
    var arrLength = arr.length;
    var sorted;
    do {
        sorted = false;
        for (var i = 0; i < arrLength - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                var temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                sorted = true;
            }
        }
    } while (sorted);
    return arr;
}
console.log(bubbleSort([1,3,2,5,4]));