import config from '../../../src/config';

const poolId = config.cognito.USER_POOL_ID;

cy.Authentication = {
    deleteTestUser: (email: string): Cypress.Chainable<Cypress.Exec> => {
        return cy.exec(
            `aws cognito-idp admin-delete-user --user-pool-id ${poolId} --username "${email}"`,
            { failOnNonZeroExit: false },
        );
    },

    login: (email: string, password: string) => {
        cy.contains('.nav-link', 'Login').click();
        cy.get('#email').type(email);
        cy.get('#password').type(password);
        cy.get('.LoaderButton').click();
    },

    logout: () => {
        cy.contains('.nav-link', 'Logout').click();
    },

    shouldDisplayLoginForm: () => {
        cy.get('.form-label').first().should('have.text', 'Email');
    },

    shouldBeLoggedIn: () => {
        cy.contains('.nav-link', 'Logout');
    },

    shouldNotBeLoggedIn: () => {
        cy.contains('.nav-link', 'Login');
        cy.contains('.nav-link', 'Signup');
    },
};

declare global {
    namespace Cypress {
        interface Chainable {
            Authentication: {
                deleteTestUser: (email: string) => Cypress.Chainable<Cypress.Exec>
                login: (email: string, password: string) => void,
                logout: () => void,
                shouldDisplayLoginForm: () => void,
                shouldBeLoggedIn: () => void,
                shouldNotBeLoggedIn: () => void,
            }
        }
    }
}

export {};
