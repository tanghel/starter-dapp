export default function numberToRequestData(value: number) {
    if (value < 16) {
        return '0' + value.toString(16);
    }

    return value.toString(16);
};