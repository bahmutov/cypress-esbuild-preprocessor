/// <reference types="cypress" />

describe('spec with process.env.NODE_ENV', () => {
  it('was set in the ESBuild define', () => {
    // when we created our ESBuild bundler
    // we passed a "define" object with "process.env.NODE_END"
    // to be replaced with "development"
    expect(process.env.NODE_ENV, 'NODE_ENV').to.equal('development')

    // we also set another text substitution
    expect(myVariable, 'my variable').to.equal(42)
  })
})
