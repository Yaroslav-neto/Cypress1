const adminConfig = require('../fixtures/adminConfig.json');
const selectors = require('../fixtures/selectors.json')

describe('should download main page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('open cinema page', () => {
        cy
          .get(selectors.mainPageHeaderTitle)
          .should('have.text', 'Идёмвкино')
          .and('be.visible');

        cy
          .get(selectors.weekShow)
          .should('have.length', 7);
    });

    it('checking tab today', () => {
        const today = new Date();
        const dayOfMonth = today.getDate();

        const daysRu = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
        const dayNameRu = daysRu[new Date().getDay()];

        cy.get(selectors.tabToday).eq(0).then(($el) => {
          cy
            .wrap($el)
            .should('contain', dayNameRu)
            .and('be.visible')
            .and('contain', dayOfMonth)
            .and('be.visible');
    });
            
            

        
    });
});


describe('should Login form', () => {
  const comands = require('../support/commands');
  const unregisteredConfig = require('../fixtures/unregisteredConfig.json');
  const incorrectedConfig = require('../fixtures/incorrectedConfig.json');

  beforeEach(() => {
    cy.visit(adminConfig.urlAdmin);
  });

  it('should successfully log in with valid credentials', () => {
    cy.fillLoginFields(adminConfig.emailAdmin, adminConfig.passwordAdmin);

    cy
      .contains('Авторизоваться')
      .should('be.enabled')
      .click();
   
    cy
      .get(selectors.mainAdminPageHeaderTitle)
      .first()
      .should('be.visible')
      .and('contain', 'Идёмвкино')
      .and('contain', 'Администраторррская');

    cy
      .get(selectors.titleHallControl)
      .should('contain', 'Управление залами')
      .and('be.visible');

  });

  it('should failed log in with not valid credentials', () => {
    cy.fillLoginFields(unregisteredConfig.emailUnregistered, unregisteredConfig.passwordUnregistered);

    cy
      .contains('Авторизоваться')
      .should('be.enabled')
      .click();

    cy
      .get(selectors.bodyPageErrorAutorisation)
      .should('have.text', 'Ошибка авторизации!')
      .and('be.visible');
  });

  it('should fail validation of input fields on not valid characters (direct validity check)', () => {
    cy.fillLoginFields(incorrectedConfig.emailIncorrect, incorrectedConfig.passwordIncorrect);

    cy
      .get(selectors.emailField)
      .then($el => {
        expect($el[0].checkValidity()).to.equal(false);
      });

    cy
      .get(selectors.passwordField)
      .then($el => {
        expect($el[0].checkValidity()).to.equal(false);
      });
  });
});


describe('should booking booking a seat', () => {
  const seatConfig = require('../fixtures/seatConfig.json')
  it('should booking tickets', () => {
    cy.visit('/');

    cy
      .get(selectors.tabNavigationWeek)
      .children().eq(2)
      .click();

    cy
      .contains('Мир Юрского периода')
      .should('be.visible')
      .parent()
      .parent()
      .parent()
      .contains('22:00')
      .should('be.visible')
      .click();

    cy.wrap(seatConfig).each(({ row, seat }) => {
      cy
        .get(`.buying-scheme__wrapper > :nth-child(${row}) > :nth-child(${seat})`)
        .click();
    });

    cy.contains('Забронировать')
      .should('be.visible')
      .should('be.enabled')
      .click();

    cy
      .get('.ticket__check-title')
      .should('contain', 'Вы выбрали билеты:');

    cy
      .get('.ticket__info-wrapper > :nth-child(1)')
      .should('contain', 'Мир Юрского периода') ; 

    cy
      .get(':nth-child(2) > .ticket__details')
      .should('contain', '1/1, 1/2, 2/2, 2/3');

    cy
      .get('.ticket__info-wrapper > :nth-child(5)')
      .should('contain', '22:00');

    cy.contains('Получить код бронирования')
      .should('be.visible')
      .and('be.enabled');
  });
    
});

describe('should booking seat with API', () => {
  let seatApiConfig;

  before(() => {
    cy.fixture('seatApiConfig').then((data) => {
      seatApiConfig = data;
    });
  });

  it('sends salesPlaces via POST as form data and validates response', () => {
    const url = '/client/scripts/reservation.php';
    const payload = {
      salesPlaces: JSON.stringify(seatApiConfig)
    };

    cy.request({
      method: 'POST',
      url: url,
      body: payload,
      form: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    });
  });
});
