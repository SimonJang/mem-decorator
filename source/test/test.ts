import assert from 'node:assert/strict';
import test from 'node:test';
import {memoize} from '..';

// Mock class for memoization testing
class Counter {
	private series = 0;
	private name_: string;

	constructor(name: string) {
		this.name_ = name;
	}

	increment(amount: number) {
		this.series += amount;

		return this.getCounter();
	}

	decrement(amount: number) {
		this.series -= amount;

		return this.getCounter();
	}

	getCounter(): number {
		return this.series;
	}

	get name(): string {
		return this.name_;
	}
}

const decorate = (target: Object, key: string): void => {
	const descriptor = Object.getOwnPropertyDescriptor(target, key);

	if (!descriptor) {
		throw Error(`Missing descriptor for ${key}`);
	}

	Object.defineProperty(target, key, memoize()(target, key, descriptor));
};

decorate(Counter.prototype, 'increment');
decorate(Counter.prototype, 'decrement');
decorate(Counter.prototype, 'name');

test('Testing memoization', (t) => {
	const counter = new Counter('counter1');
	const counter2 = new Counter('counter2');

	counter.increment(1);
	counter.increment(1);

	counter2.increment(1);

	assert.equal(counter.getCounter(), 1);
	assert.equal(counter2.getCounter(), 1);

	counter2.increment(1);
	assert.equal(counter2.getCounter(), 1);

	counter2.increment(2);
	assert.equal(counter2.getCounter(), 3);

	counter2.decrement(1);
	counter2.decrement(1);
	assert.equal(counter2.getCounter(), 2);

	assert.equal(counter.name, 'counter1');
	assert.equal(counter2.name, 'counter2');
});
