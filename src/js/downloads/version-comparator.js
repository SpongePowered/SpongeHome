export default function(a, b) {
    const aa = a.split('.');
    const ba = b.split('.');

    const max = Math.max(a.length, b.length);

    for (let i = 0; i < max; ++i) {
        const result = parseInt(aa[i], 10) - parseInt(ba[i], 10);
        if (result !== 0) {
            return result;
        }
    }

    return a.length - b.length
}
