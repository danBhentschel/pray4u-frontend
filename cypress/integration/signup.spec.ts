/// <reference types="cypress" />

import config from '../../src/config';

const testUserEmail = Cypress.env('COGNITO_USERNAME');
const testUserPassword = Cypress.env('COGNITO_PASSWORD');
const baseUrl = `http://pray4u-${Cypress.env('SERVERLESS_STAGE')}-deploy-site-bucket.s3-website-us-east-1.amazonaws.com`;

describe('Signup screen', () => {

    beforeEach(() => {
        cy.visit(baseUrl);
        cy.get('.nav-link').contains('Signup').click();
    });

    it('should complete signup process', () => {
        cy.get('#email').type(testUserEmail);
        cy.get('#password').type(testUserPassword);
        cy.get('#confirmPassword').type(testUserPassword);
        cy.get('.LoaderButton').click();

        cy.get('#confirmationCode').get('.form-label').should('have.text', 'Confirmation Code');
    });

});
