import LinkedList from '@structures/LinkedList';
import Comparator, { ComparatorFunction } from '@utils/Comparator';

const compare = Comparator.defaultComparator;

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

describe('LinkedList', () => {
  it('should create empty linked list', () => {
    const linkedList = new LinkedList(compare);
    expect(linkedList.toString()).toBe('');
  });

  it('should append node to linked list', () => {
    const linkedList = new LinkedList(compare);

    expect(linkedList.head).toBeNull();
    expect(linkedList.tail).toBeNull();

    linkedList.append(1);
    linkedList.append(2);

    expect(linkedList.toString()).toBe('1,2');
    expect(linkedList.tail!.next).toBeNull();
  });

  it('should prepend node to linked list', () => {
    const linkedList = new LinkedList(compare);

    linkedList.prepend(2);
    expect(linkedList.head!.toString()).toBe('2');
    expect(linkedList.tail!.toString()).toBe('2');

    linkedList.append(1);
    linkedList.prepend(3);

    expect(linkedList.toString()).toBe('3,2,1');
  });

  it('should expose an interator as it\'s own value', () => {
      const linkedList = new LinkedList(compare);
      const gotValues: number[] = [];

      linkedList.append(4);
      linkedList.append(8);
      linkedList.append(15);
      linkedList.append(16);
      linkedList.append(23);
      linkedList.append(42);

      for (const currentNode of linkedList) {
          gotValues.push(currentNode.value);
      }

      expect(gotValues.join(' ')).toBe('4 8 15 16 23 42');
  })

  it('should delete node by value from linked list', () => {
    const linkedList = new LinkedList(compare);

    expect(linkedList.delete(5)).toBeNull();

    linkedList.append(1);
    linkedList.append(1);
    linkedList.append(2);
    linkedList.append(3);
    linkedList.append(3);
    linkedList.append(3);
    linkedList.append(4);
    linkedList.append(5);

    expect(linkedList.head!.toString()).toBe('1');
    expect(linkedList.tail!.toString()).toBe('5');

    const deletedNode = linkedList.delete(3);
    expect(deletedNode!.value).toBe(3);
    expect(linkedList.toString()).toBe('1,1,2,4,5');

    linkedList.delete(3);
    expect(linkedList.toString()).toBe('1,1,2,4,5');

    linkedList.delete(1);
    expect(linkedList.toString()).toBe('2,4,5');

    expect(linkedList.head!.toString()).toBe('2');
    expect(linkedList.tail!.toString()).toBe('5');

    linkedList.delete(5);
    expect(linkedList.toString()).toBe('2,4');

    expect(linkedList.head!.toString()).toBe('2');
    expect(linkedList.tail!.toString()).toBe('4');

    linkedList.delete(4);
    expect(linkedList.toString()).toBe('2');

    expect(linkedList.head!.toString()).toBe('2');
    expect(linkedList.tail!.toString()).toBe('2');

    linkedList.delete(2);
    expect(linkedList.toString()).toBe('');
  });

  it('should delete linked list tail', () => {
    const linkedList = new LinkedList(compare);

    linkedList.append(1);
    linkedList.append(2);
    linkedList.append(3);

    expect(linkedList.head!.toString()).toBe('1');
    expect(linkedList.tail!.toString()).toBe('3');

    const deletedNode1 = linkedList.deleteTail();

    expect(deletedNode1!.value).toBe(3);
    expect(linkedList.toString()).toBe('1,2');
    expect(linkedList.head!.toString()).toBe('1');
    expect(linkedList.tail!.toString()).toBe('2');

    const deletedNode2 = linkedList.deleteTail();

    expect(deletedNode2!.value).toBe(2);
    expect(linkedList.toString()).toBe('1');
    expect(linkedList.head!.toString()).toBe('1');
    expect(linkedList.tail!.toString()).toBe('1');

    const deletedNode3 = linkedList.deleteTail();

    expect(deletedNode3!.value).toBe(1);
    expect(linkedList.toString()).toBe('');
    expect(linkedList.head).toBeNull();
    expect(linkedList.tail).toBeNull();
  });

  it('should delete linked list head', () => {
    const linkedList = new LinkedList(compare);

    expect(linkedList.deleteHead()).toBeNull();

    linkedList.append(1);
    linkedList.append(2);

    expect(linkedList.head!.toString()).toBe('1');
    expect(linkedList.tail!.toString()).toBe('2');

    const deletedNode1 = linkedList.deleteHead();

    expect(deletedNode1!.value).toBe(1);
    expect(linkedList.toString()).toBe('2');
    expect(linkedList.head!.toString()).toBe('2');
    expect(linkedList.tail!.toString()).toBe('2');

    const deletedNode2 = linkedList.deleteHead();

    expect(deletedNode2!.value).toBe(2);
    expect(linkedList.toString()).toBe('');
    expect(linkedList.head).toBeNull();
    expect(linkedList.tail).toBeNull();
  });

  it('should be possible to store objects in the list and to print them out', () => {
    const linkedList = new LinkedList<MyValue>(MyValue.compare);
    const nodeValue1 = new MyValue(1, 'key1');
    const nodeValue2 = new MyValue(2, 'key2')

    linkedList
      .append(nodeValue1)
      .prepend(nodeValue2);

    expect(linkedList.toString()).toBe('key2:2,key1:1');
  });

  it('should find node by value callback', () => {
    const linkedList = new LinkedList(compare);

    expect(linkedList.find(val => val === 5)).toBeNull();

    linkedList.append(1);
    expect(linkedList.find(val => val === 3)).toBeDefined();

    linkedList
      .append(2)
      .append(3);

    const node = linkedList.find(val => val === 2);

    expect(node!.value).toBe(2);
    expect(linkedList.find(val => val === 5)).toBeNull();
  });

  it('should find node by value interface', () => {
    const linkedList = new LinkedList<MyValue>(MyValue.compare);

    linkedList.append(new MyValue(1, 'key1'));
    linkedList.append(new MyValue(12, 'key12'));
    linkedList.append(new MyValue(94, 'key94'));
    linkedList.append(new MyValue(-44, 'keyLOL'));

    const node = linkedList.find({ key: 'keyLOL' });
    expect(node).not.toBeNull();
    expect(node!.value.numVal).toBe(-44);
  })

  it('should create linked list from array', () => {
    const linkedList = new LinkedList();
    linkedList.fromArray([1, 1, 2, 3, 3, 3, 4, 5]);

    expect(linkedList.toString()).toBe('1,1,2,3,3,3,4,5');
  });

//   it('should reverse linked list', () => {
//     const linkedList = new LinkedList();

//     // Add test values to linked list.
//     linkedList
//       .append(1)
//       .append(2)
//       .append(3);

//     expect(linkedList.toString()).toBe('1,2,3');
//     expect(linkedList.head.value).toBe(1);
//     expect(linkedList.tail.value).toBe(3);

//     // Reverse linked list.
//     linkedList.reverse();
//     expect(linkedList.toString()).toBe('3,2,1');
//     expect(linkedList.head.value).toBe(3);
//     expect(linkedList.tail.value).toBe(1);

//     // Reverse linked list back to initial state.
//     linkedList.reverse();
//     expect(linkedList.toString()).toBe('1,2,3');
//     expect(linkedList.head.value).toBe(1);
//     expect(linkedList.tail.value).toBe(3);
//   });
});