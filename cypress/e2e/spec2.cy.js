/// <reference types="cypress" />

import { add } from '../add'

describe('second spec', () => {
  it('adds two numbers', () => {
    expect(add(2, -3)).to.equal(-1)
  })
})
