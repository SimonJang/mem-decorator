import * as mem from 'mem';

/**
 * Factory function to create a memoization annotation
 *
 * @param config - Configuration object for `mem`
 */
export function memoize(config?: mem.Options<any, any, unknown>) {
	return (_: Object, __: string, descriptor: PropertyDescriptor) => {
		const symbol = Symbol.for('mem-decorator');
		const method = descriptor.get ? 'get' : 'value';
		const targetFunction = descriptor[method];

		descriptor[method] = function() {
			if (!this[symbol] || !this[symbol][method]) {
				this[symbol] = {
					...this[symbol],
					[method]: mem(targetFunction, config)
				};
			}

			return this[symbol][method].apply(this, arguments);
		};

		return descriptor;
	};
}
