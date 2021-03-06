/* eslint-env mocha */

import { assert } from 'chai'

import loadTestFactory from './utils/loadTestFactory'
 // import container from '../src/browser'
import container from '../browser'

const loadTest = loadTestFactory(container, (name) => {
  const path = name.split('/')
  const root = path.shift()
  switch (root) {
    case 'rules':
      return require('./rules/' + path).default
    case 'config':
      return require('./config/' + path).default
    case 'decorator':
      return require('./decorator').default
  }
})

describe('rules', function () {
  loadTest('rules/classDef')
  loadTest('rules/instanceOf')
  loadTest('rules/shared')
  loadTest('rules/params')
  loadTest('rules/singleton')
  loadTest('rules/substitutions')
  loadTest('rules/sharedInTree')
  loadTest('rules/calls')
  loadTest('rules/lazyCalls')
  loadTest('rules/inheritInstanceOf')
  loadTest('rules/inheritPrototype-decorator')
  loadTest('rules/inheritMixins')
  loadTest('rules/asyncResolve')
  loadTest('rules/asyncCallsSeries')
  loadTest('rules/asyncCallsParamsSerie')
})
describe('decorator', function () {
  loadTest('decorator')
})
describe('config', function () {
  loadTest('config/promiseFactory')
  loadTest('config/promiseInterfaces')
  loadTest('config/interfacePrototype')

  describe('dependencies', function () {
    const di = container({
      rules: (di) => ({
        'app/A': {

        },
        'app/B': {

        },
        'app/B/C': {

        },

        'requireA': {
          instanceOf: 'app/A',
          params: [ di.require('app/B') ]
        }
      }),
      dependencies: {
        'app': require.context('./autoload', true, /\.js$/)
      }
    })

    it('sould be instance of A', function () {
      const A = di.get('app/A')
      assert.instanceOf(A, require('./autoload/A').default)
    })

    it('sould be instance of B', function () {
      const B = di.get('app/B')
      assert.instanceOf(B, require('./autoload/B').default)
    })

    it('sould be instance of C', function () {
      const C = di.get('app/B/C')
      assert.instanceOf(C, require('./autoload/B/C').default)
    })

    it('sould be equal to B', function () {
      const A = di.get('requireA')
      assert.strictEqual(A.params[0], require('./autoload/B'))
    })
  })
})
