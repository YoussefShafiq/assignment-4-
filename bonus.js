const input = ["cir","car"];

function longestCommonPrefix(strs) {

    let smallest = strs[0];

    for (let i = 0; i < strs.length; i++) {
        if (strs[i].length < smallest.length) {
            smallest = strs[i];
        }
    }

    let prefix = "";

    for (let i = 0; i < smallest.length; i++) {
        prefix += smallest[i];

        for (let j = 0; j < strs.length; j++) {
            if (strs[j][i] == smallest[i]) {
                continue;
            }
            else {
                return prefix.slice(0, prefix.length - 1);
            }
        }

    }
    return prefix;
}
console.log(longestCommonPrefix(input));


