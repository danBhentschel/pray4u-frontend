/// <reference types="cypress" />

const baseUrl = `http://pray4u-${Cypress.env('SERVERLESS_STAGE')}-deploy-site-bucket.s3-website-us-east-1.amazonaws.com`;
const testUserEmail = Cypress.env('COGNITO_USERNAME');
const testUserPassword = Cypress.env('COGNITO_PASSWORD');

describe('Signup screen', () => {

    beforeEach(() => {
        cy.visit(baseUrl);
        cy.contains('.nav-link', 'Signup').click();
    });

    it('should complete signup process', () => {
        cy.Authentication.deleteTestUser(testUserEmail);

        cy.Signup.createNewCognitoUser(testUserEmail, testUserPassword);
        cy.contains('p', 'Cognito ID');

        cy.Authentication.logout();
        cy.Authentication.shouldNotBeLoggedIn();
        cy.Authentication.shouldDisplayLoginForm();

        cy.Authentication.login(testUserEmail, testUserPassword);
        cy.Authentication.shouldBeLoggedIn();
        cy.contains('p', 'Cognito ID');

        cy.Authentication.logout();
        cy.Authentication.shouldNotBeLoggedIn();
    });

});
