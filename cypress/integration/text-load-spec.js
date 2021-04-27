/// <reference types="cypress" />

import words from '../words.txt'

it('loads a list of words', () => {
  expect(words).to.deep.equal(['hello', 'world!'])
})
