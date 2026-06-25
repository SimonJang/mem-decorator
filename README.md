# mem-decorator [![CI](https://github.com/SimonJang/mem-decorator/actions/workflows/ci.yml/badge.svg)](https://github.com/SimonJang/mem-decorator/actions/workflows/ci.yml)

> Decorator to [memoize](https://en.wikipedia.org/wiki/Memoization) a class method.

[Mem](https://github.com/sindresorhus/mem) is used as caching library. When using with Typescript, don't forget to enable the flag `"experimentalDecorators": true` in `tsconfig.json`.

## Requirements

- Node >= 22

## Install

```
$ npm install mem-decorator --save
```

## Usage

```js
const {memoize} = require('mem-decorator');

class Fibonacci {
	@memoize()
	calculateSequence(sequence) {
		// Fibonacci algorithm
	}
}

const fib = new Fibonacci()

console.log(fib.calculateSequence(1)) // Calculation executed (1)
console.log(fib.calculateSequence(2)) // Calculation executed (2)
console.log(fib.calculateSequence(1)) // Cache hit, returning previous calculation (1)
```

## API

### @memoize([configuration])

Annotation to memoize a class method. Works for getters as well.

#### configuration

Required: `false`
Type: `object`

Uses the same configuration as [mem](https://github.com/sindresorhus/mem)

## License

MIT © [Simon Jang](https://github.com/SimonJang)
