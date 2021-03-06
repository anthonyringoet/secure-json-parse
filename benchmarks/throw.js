'use strict'

const Benchmark = require('benchmark')
const Bourne = require('..')

const internals = {
  text: '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } }',
  invalid: '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } } }'
}

const suite = new Benchmark.Suite()

suite
  .add('JSON.parse', () => {
    JSON.parse(internals.text)
  })
  .add('JSON.parse error', () => {
    try {
      JSON.parse(internals.invalid)
    } catch (ignoreErr) { }
  })
  .add('Bourne.parse', () => {
    try {
      Bourne.parse(internals.text)
    } catch (ignoreErr) { }
  })
  .add('reviver', () => {
    try {
      JSON.parse(internals.text, internals.reviver)
    } catch (ignoreErr) { }
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })

internals.reviver = function (key, value) {
  if (key === '__proto__') {
    throw new Error('kaboom')
  }

  return value
}
