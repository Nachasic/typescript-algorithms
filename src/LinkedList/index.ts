import Comparator, { ComparatorFunction } from '../utils/Comparator';
import { throwStatement } from '@babel/types';

export class LinkedListNode<T> {
    constructor (
        public value: T,
        public next: LinkedListNode<T> | null
    ) {};

    public toString = () =>
        (typeof this.value === 'string' || typeof this.value === 'number') ?
            `${this.value}` :
            this.value.toString()
}

type LinkedListOperation<T = number, Result = LinkedList<T>> = (value: T) => Result;
export default class LinkedList<T = number> {
    public head: LinkedListNode<T> | null = null;
    public tail: LinkedListNode<T> | null = null;
    private compare: Comparator<T>;

    /**
     * Iterable linked list
     */
    constructor (comparatorFunction?: ComparatorFunction<T>) {
        if (comparatorFunction) {
            this.compare = new Comparator(comparatorFunction);
        } else {
            this.compare = (Comparator.defaultComparator as any as Comparator<T>);
        }
    }

    private * generator (): IterableIterator<LinkedListNode<T>> {
        let currentNode = this.head;

         while (currentNode && currentNode.value) {
             yield currentNode;

             currentNode = currentNode.next
         }
    }

    [Symbol.iterator] () {
        return this.generator()
    }

    /**
     * Adds a node with a given value to the beginning of the list
     * @returns {LinkedList} this list
     */
    public prepend: LinkedListOperation<T> = value => {
        const newNode = new LinkedListNode<T>(
            value,
            this.head
        )

        this.head = newNode;

        if (!this.tail) {
            this.tail = newNode;
        }

        return this;
    }

    /**
     * Adds a node with a given value to the end of the list
     * @returns {LinkedList} this list
     */
    public append: LinkedListOperation<T> = value => {
        const newNode = new LinkedListNode<T> (
            value,
            null
        )

        if (this.tail) {
            this.tail.next = newNode;
        }
        this.tail = newNode;

        if (!this.head) {
            this.head = newNode
        }

        return this;
    }

    /**
     * Deletes all occurances of a given value in the list
     * @returns {LinkedListNode | null} last deleted node
     */
    public delete: LinkedListOperation<T, LinkedListNode<T> | null> = value => {
        let deletedNode: LinkedListNode<T> | null = null;

        if (!this.head) {
            return null;
        }

        // Delete head if we need to
        while (this.head && this.compare.equal(this.head.value, value)) {
            deletedNode = this.head;
            this.head = this.head.next;
        }

        let currentNode = this.head;

        if (currentNode) {
            while (currentNode.next) {
                if (this.compare.equal(currentNode.next.value, value)) {
                    deletedNode = currentNode.next;
                    currentNode.next = currentNode.next.next;
                } else {
                    currentNode = currentNode.next;
                }
            }

            // Check if the tail is to be deleted
            if (this.compare.equal(this.tail!.value, value)) {
                deletedNode = this.tail;
                this.tail = currentNode;
                currentNode.next = null;
            }
        }

        return deletedNode
    }

    /** | null
     * Deletes the last element in the list
     * @returns {LinkedListNode | null} deleted node
     */
    public deleteTail = (): LinkedListNode<T> | null => {
        let deletedNode: LinkedListNode<T> | null = null;
        let curretnNode = this.head;

        // Check if there is only one node in the list
        if (this.head === this.tail) {
            deletedNode = this.head;

            this.head = null;
            this.tail = null;

            return deletedNode;
        }

        // Find the last node before the tail 
        while (curretnNode) {
            if (curretnNode.next === this.tail) {
                deletedNode = this.tail;
                curretnNode.next = null;
                this.tail = curretnNode;
            }

            curretnNode = curretnNode.next;
        }

        return deletedNode
    }

    /**
     * Deletes the first element in the list
     * @returns {LinkedListNode | null} deleted node
     */
    public deleteHead = (): LinkedListNode<T> | null => {
        let deletedNode: LinkedListNode<T> | null = null;
        // Check if there is only one node in the list
        if (this.head === this.tail) {
            deletedNode = this.head;
            this.head = null;
            this.tail = null;

            return deletedNode;
        }

        deletedNode = this.head;
        this.head = this.head!.next;

        return deletedNode;
    }

    /**
     * Finds a node based on search criteria
     * @param {λ} (value) => boolean
     * @returns {LinkedListNode | null}
     */
    public find (isCorrectValue: (value: T) => boolean): LinkedListNode<T> | null;
    /**
     * Finds a node based on a subset of props
     * @param {criteria} 
     */
    public find (criteria: Partial<T>): LinkedListNode<T> | null;
    find (isCorrectValue: any) {
        let foundNode: LinkedListNode<T> | null = null;
        const isInterface = (arg: (value: T) => boolean | Partial<T>): arg is (value: T) => boolean =>
            typeof arg !== 'function';

        if (isInterface(isCorrectValue)) {
            // received a { foo: 'bar' } type of quert
            const checkNode = (node: LinkedListNode<T>): boolean => {
                let result = true;
    
                for (const [prop] of Object.entries(isCorrectValue)) {
    
                    if (node.value.hasOwnProperty(prop) &&
                        (node.value as any)[prop] === (isCorrectValue as any)[prop]) {
                        continue;
                    } else {
                        result = false;
                    }
                }
    
                return result
            }
    
            for (const node of this) {
                if (checkNode(node)) {
                    foundNode = node;
                    break;
                }
            }
        } else {
            // received a callback
            for (const node of this) {
                if (isCorrectValue(node.value)) {
                    foundNode = node;
                    break;
                }
            }
        }

        return foundNode;
    }

    /**
     * Re-initializes the list from an array of values
     * @param {Array} 
     */
    public fromArray (source: Array<T>): LinkedList<T> {
        this.head = null;
        this.tail = null;

        for (const element of source) {
            this.append(element);
        }

        return this;
    }

    /**
     * Converts this list to an array of nodes
     * 
     * @returns {LinkedListNode[]} array of nodes
     */
    public toArray (): LinkedListNode<T>[] {
        const nodes: LinkedListNode<T>[] = [];
        let currentNode = this.head;

        while (currentNode) {
            nodes.push(currentNode);
            currentNode = currentNode.next;
        }

        return nodes;
    }

    /**
     * Reverses the list
     * @returns {LinkedList}
     */
    public reverse (): LinkedList<T> {
        let currentNode = this.head;
        const head = this.head;
        let previousNode: LinkedListNode<T> | null = null;

        while (currentNode) {
            const next = currentNode.next;
            currentNode.next = previousNode;
            previousNode = currentNode;
            currentNode = next;
        }

        this.head = this.tail;
        this.tail = head;

        return this;
    }

    public toString = () =>
        this.toArray().map(node => node.toString()).toString()
}