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

class DecoratedCounter {
	private series = 0;
	private nameCalls = 0;

	constructor(private readonly name_: string) {}

	@memoize()
	increment(amount: number) {
		this.series += amount;

		return this.series;
	}

	@memoize()
	get name(): string {
		this.nameCalls++;

		return this.name_;
	}

	getNameCalls(): number {
		return this.nameCalls;
	}
}

class BaseCounter {
	private series = 0;

	foo(amount: number): string {
		this.series += amount;

		return `base:${this.series}`;
	}
}

class ChildCounter extends BaseCounter {
	foo(amount: number): string {
		return `child:${super.foo(amount)}`;
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
decorate(BaseCounter.prototype, 'foo');
decorate(ChildCounter.prototype, 'foo');

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

test('Testing memoization with decorator syntax', () => {
	const counter = new DecoratedCounter('counter1');
	const counter2 = new DecoratedCounter('counter2');

	counter.increment(1);
	counter.increment(1);
	counter2.increment(1);

	assert.equal(counter.increment(1), 1);
	assert.equal(counter2.increment(1), 1);
	assert.equal(counter2.increment(2), 3);

	assert.equal(counter.name, 'counter1');
	assert.equal(counter.name, 'counter1');
	assert.equal(counter.getNameCalls(), 1);
	assert.equal(counter2.name, 'counter2');
	assert.equal(counter2.getNameCalls(), 1);
});

test('Testing decorated override with decorated super method', () => {
	const counter = new ChildCounter();

	assert.equal(counter.foo(1), 'child:base:1');
	assert.equal(counter.foo(1), 'child:base:1');
	assert.equal(counter.foo(2), 'child:base:3');
});
