import mem = require('mem');

const symbol = Symbol.for('mem-decorator');

type TargetFunction = (...arguments_: any[]) => any;

type StandardDecoratorContext = {
	kind: 'method' | 'getter';
	name: PropertyKey;
};

type MemoizeDecorator = {
	(target: Object, key: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor;
	(value: TargetFunction, context: StandardDecoratorContext): TargetFunction;
};

/**
 * Factory function to create a memoization annotation.
 *
 * @param config - Configuration object for `mem`.
 */
export function memoize(config?: mem.Options<any, any, unknown>): MemoizeDecorator {
	const wrap = (targetFunction: TargetFunction): TargetFunction => {
		const cacheKey = Symbol('mem-decorator-cache');

		return function (this: any) {
			if (!this[symbol] || !this[symbol][cacheKey]) {
				this[symbol] = {
					...this[symbol],
					[cacheKey]: mem(targetFunction, config),
				};
			}

			return this[symbol][cacheKey].apply(this, arguments);
		};
	};

	return ((
		targetOrValue: Object | TargetFunction,
		keyOrContext: PropertyKey | StandardDecoratorContext,
		descriptor?: PropertyDescriptor,
	) => {
		if (typeof keyOrContext === 'object' && 'kind' in keyOrContext) {
			return wrap(targetOrValue as TargetFunction);
		}

		if (!descriptor) {
			throw new Error('Missing property descriptor');
		}

		const method = descriptor.get ? 'get' : 'value';
		const targetFunction = descriptor[method];

		descriptor[method] = wrap(targetFunction);

		return descriptor;
	}) as MemoizeDecorator;
}
