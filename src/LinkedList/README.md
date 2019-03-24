Linked List
===========
A a linear collection of data elements, in which linear order is not given by their physical placement in memory. Instead, each element points to the next. It is a data structure consisting of a group of nodes which together represent a sequence. Under the simplest form, each node is composed of data and a reference (in other words, a link) to the next node in the sequence. This structure allows for efficient insertion or removal of elements from any position in the sequence during iteration. More complex variants add additional links, allowing efficient insertion or removal from arbitrary element references. A drawback of linked lists is that access time is linear (and difficult to pipeline). Faster access, such as random access, is not feasible. Arrays have better cache locality as compared to linked lists.

![Linked List](https://upload.wikimedia.org/wikipedia/commons/6/6d/Singly-linked-list.svg)

## Basic usage
Before creating and using linked list of certain type, create a comparation function for said type, as definition from `@utils/Comparator.ts` suggests.

```typescript
import LinkedList, { LinkedListNode } from '@structures/LinkedList';
import { ComparatorFunction } from '@utils/Comparator';

class MyValue {
  constructor (
      public numVal: number,
      public key: string,
  ) {};
  toString = () => `${this.key}:${this.numVal}`;
  static compare: ComparatorFunction<MyValue> = (a, b) => {
      if (a.numVal === b.numVal) { return 0 }
      return a.numVal < b.numVal ? -1 : 1;
  }
}

const myList = new LinkedList<MyValue>(compareFunction);
const item1 = new MyValue(1, 'one');
const item2 = new MyValue(2, 'two');
const item3 = new MyValue(3, 'three');

myList.prepend(new MyValue(4, 'four'));
myList.append(new MyValue(5, 'five'));
myList.prepend(item);
myList.delete(item);
myList.fromArray([item3, item2, item1]); // Re-initialize from an array
myList.reverse();

for (const item of myList) {
    // Iterate over items    
}

const nodeItem2: LinkedListNode<MyValue> = myList.find(listItem => item === item2);
const nodeItem3: LinkedListNode<MyValue> = myList.find({ key: 'three' });
const itemAfter2: LinkedListNode<MyValue> | null = nodeItem2.next;
const items: LinkedListNode<MyValue>[] = myList.toArray();
```

## Complexities

### Time Complexity

| Access    | Search    | Insertion | Deletion  |
| :-------: | :-------: | :-------: | :-------: |
| O(n)      | O(n)      | O(1)      | O(n)      |

### Space Complexity

O(n)

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Linked_list)
- [YouTube](https://www.youtube.com/watch?v=njTh_OwMljA&index=2&t=1s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)