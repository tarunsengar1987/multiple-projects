//find a power of n

function power(x, p) {
    if(p != 0) {
        return (x * power(x, p - 1))
    }
    return 1;
}

console.log(power(2,6));