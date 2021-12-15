/// <reference types="cypress" />

const testUserEmail = Cypress.env('COGNITO_USERNAME');
const testUserPassword = Cypress.env('COGNITO_PASSWORD');
const baseUrl = `http://pray4u-${Cypress.env('SERVERLESS_STAGE')}-deploy-site-bucket.s3-website-us-east-1.amazonaws.com`;

describe('Signup screen', () => {

    beforeEach(() => {
        cy.visit(baseUrl);
        cy.contains('.nav-link', 'Signup').click();
    });

    it('should complete signup process', () => {
        fetchVerificationCode().then((origVerificationCode) => {
            cy.log(`Original verification code: ${origVerificationCode}`);

            cy.get('#email').type(testUserEmail);
            cy.get('#password').type(testUserPassword);
            cy.get('#confirmPassword').type(testUserPassword);
            cy.get('.LoaderButton').click();

            cy.get('#confirmationCode').get('.form-label').should('have.text', 'Confirmation Code');

            waitForDifferentVerificationCode(origVerificationCode).then(() => {
                fetchVerificationCode().then((newVerificationCode) => {
                    cy.log(`New verification code: ${newVerificationCode}`);

                    cy.get('#confirmationCode').type(newVerificationCode);
                    cy.get('.LoaderButton').click();

                    cy.contains('p', 'Cognito ID');
                    cy.contains('.nav-link', 'Logout').click();

                    cy.contains('.nav-link', 'Login');
                    cy.contains('.nav-link', 'Signup');
                    cy.get('#email').type(testUserEmail);
                    cy.get('#password').type(testUserPassword);
                    cy.get('.LoaderButton').click();

                    cy.contains('p', 'Cognito ID');
                    cy.contains('.nav-link', 'Logout').click();

                    cy.contains('.nav-link', 'Login');
                    cy.contains('.nav-link', 'Signup');
                });
            });
        });
    });

});

const s3Obj = 'http://pray4u-e2e-testing-email-verification.s3-website-us-east-1.amazonaws.com/EmailVerificationMessage';
const fetchVerificationCode = () => {
    return cy.request({
        url: s3Obj,
        encoding: 'ascii',
    }).then((response) => {
        if (response.status !== 200) {
            return '';
        }

        const match = response.body.match(/Your confirmation code is (\d{6})/);
        return match ? match[1] : '';
    });
};

const waitForDifferentVerificationCode = (originalCode) => {
    return fetchVerificationCode().then((code) => {
        if (code == '' || code == originalCode) {
            waitForDifferentVerificationCode(originalCode);
        }

        return;
    });
};
