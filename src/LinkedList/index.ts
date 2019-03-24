import Comparator, { ComparatorFunction } from '../utils/Comparator';

export class LinkedListNode<T> {
    constructor (
        public value: T,
        public next: LinkedListNode<T> | null
    ) {};

    public toString = () =>
        (typeof this.value === 'string' || typeof this.value === 'number') ?
            this.value :
            this.value.toString()
}

type LinkedListOperation<T = number, Result = LinkedList<T>> = (value: T) => Result;
export default class LinkedList<T = number> {
    public head: LinkedListNode<T> | null = null;
    public tail: LinkedListNode<T> | null = null;
    private compare: Comparator<T>;

    constructor (comparatorFunction: ComparatorFunction<T>) {
        this.compare = new Comparator(comparatorFunction);

    }

    private * generator(): IterableIterator<T> {
        let currentNode = this.head;
         while (currentNode && currentNode.value) {
             yield currentNode.value;

             currentNode = currentNode.next
         }
    }

    [Symbol.iterator] () {
        return this.generator()
    }

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

    public delete: LinkedListOperation<T, LinkedListNode<T> | null> = value => {
        let nodeToDelete: LinkedListNode<T> | null = null;

        

        return null
    }

    public toArray (): LinkedListNode<T>[] {
        const nodes: LinkedListNode<T>[] = [];
        let currentNode = this.head;

        while (currentNode) {
            nodes.push(currentNode);
            currentNode = currentNode.next;
        }

        return nodes;
    }

    public toString = () =>
        this.toArray().map(node => node.toString()).toString()
}