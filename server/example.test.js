const sum = function(n1, n2){
    return n1 + n2;
}

test('sum 1 + 2', () => {
    // setup
    const a = 1;
    const b = 2;
    const expected = 3;

    // execute
    const actual = sum(a, b);

    // verify
    expect(actual).toBe(expected);

    // clearup
})