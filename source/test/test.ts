import {memoize} from '..';
import test from 'ava';

// Mock class for memoization testing
class Counter {
	private series = 0;
	private name_: string;

	constructor(name: string) {
		this.name_ = name;
	}

	@memoize()
	increment(amount: number) {
		this.series += amount;

		return this.getCounter();
	}

	getCounter(): number {
		return this.series;
	}

	@memoize()
	get name(): string {
		return this.name_;
	}
}

test('Testing memoization', t => {
	const counter = new Counter('counter1');
	const counter2 = new Counter('counter2');

	counter.increment(1);
	counter.increment(1);

	counter2.increment(1);

	t.is(counter.getCounter(), 1);
	t.is(counter2.getCounter(), 1);

	counter2.increment(1);
	t.is(counter2.getCounter(), 1);

	counter2.increment(2);
	t.is(counter2.getCounter(), 3);

	t.is(counter.name, 'counter1');
	t.is(counter2.name, 'counter2');
});
