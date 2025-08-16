Cypress.Commands.add('fillLoginFields', (email, password) => {
  cy
    .get('.login__title')
    .should('have.text', 'Авторизация')
    .and('be.visible');

  cy
    .get('.login__wrapper')
    .should('be.visible')
    .and('contain', 'E-mail')
    .and('contain', 'Пароль');

  cy
    .contains('Авторизоваться')
    .should('be.visible')
    .then(() => {
      cy.get('[name="email"]').type(email);
      cy.get('[name="password"]').type(password);
    });
});
