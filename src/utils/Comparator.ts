export type ComparatorFunction<T> = (a: T, b: T) => -1 | 1 | 0;
type ComparatorOperator<T> = (a: T, b: T) => boolean;

export default class Comparator<T = number> {
    static defaultComparator: ComparatorFunction<number> = (a, b) => {
        if (a === b) { return 0 };
        return a < b ? -1 : 1;
    }

    private compare: ComparatorFunction<T>;

    constructor (compareFunc?: ComparatorFunction<T>) {
        if (compareFunc) {
            this.compare = compareFunc;
        } else {
            this.compare = Comparator.defaultComparator as any as ComparatorFunction<T>;
        }
    }

    /**
     * Checks if two variables are equal.
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    public equal: ComparatorOperator<T> = (a, b) =>
        this.compare(a, b) === 0;

    /**
     * Checks if variable "a" is less than "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    public lessThan: ComparatorOperator<T> = (a, b) =>
        this.compare(a, b) < 0;

    /**
     * Checks if variable "a" is greater than "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    public greaterThan: ComparatorOperator<T> = (a, b) =>
        this.compare(a, b) > 0;

    /**
     * Checks if variable "a" is less than or equal to "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    public lessThanOrEqual: ComparatorOperator<T> = (a, b) =>
        this.lessThan(a, b) || this.equal(a, b);

    /**
     * Checks if variable "a" is greater than or equal to "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    public greaterThanOrEqual: ComparatorOperator<T> = (a, b) =>
        this.greaterThan(a, b) || this.equal(a, b);

    /**
     * Reverses the comparison order.
     */
    reverse() {
        const compareOriginal = this.compare;
        this.compare = (a, b) => compareOriginal(b, a);
    }
}