describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    cy.wait(2)
    cy.contains('Login').click() 
    cy.contains('Github').click() 
  })
})
