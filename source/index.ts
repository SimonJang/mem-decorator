import mem = require('mem');

/**
 * Factory function to create a memoization annotation.
 *
 * @param config - Configuration object for `mem`.
 */
export function memoize(
	config?: mem.Options<any, any, unknown>,
): (target: Object, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
	return (_, key, descriptor) => {
		const symbol = Symbol.for('mem-decorator');
		const method = descriptor.get ? 'get' : 'value';
		const targetFunction = descriptor[method];

		descriptor[method] = function () {
			if (!this[symbol] || !this[symbol][key]) {
				this[symbol] = {
					...this[symbol],
					[key]: mem(targetFunction, config),
				};
			}

			return this[symbol][key].apply(this, arguments);
		};

		return descriptor;
	};
}
