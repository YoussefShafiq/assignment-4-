const input = ["apple", "sppice", "append"];

function longestCommonPrefix(strs) {

    let smallest = strs[0];

    for (let i = 0; i < strs.length; i++) {
        if (strs[i].length < smallest.length) {
            smallest = strs[i];
        }
    }

    if (strs.length === 0 || smallest=="") return "";
    let prefix = smallest.slice(0, 0)
    for (let i = 0; i <smallest.length; i++) {
        for (let j = 0; j < strs.length; j++) {
            if (strs[j].includes(prefix)) {
                continue;
            }
            else {
                return prefix.slice(0, -1)
            }
        }
        prefix = smallest.slice(0, i + 1)
    }
}

console.log(longestCommonPrefix(input));
