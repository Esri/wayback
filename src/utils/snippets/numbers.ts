const commaSeparatedNumberFormatter = new Intl.NumberFormat('en-US');

export const numberWithCommas = (num: number): string => {
    return commaSeparatedNumberFormatter.format(num);
};
