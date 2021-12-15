cy.Signup = {
    createNewCognitoUser: (email: string, password: string): void => {
        let origVerificationCode = '';
        cy.VerificationCode.fetch().then((code) => {
            origVerificationCode = code;
            cy.log(`Original verification code: ${code}`);
        });

        cy.Signup.fillInSignupForm(email, password);
        cy.get('.LoaderButton').click();

        cy.get('.form-label').should('have.text', 'Confirmation Code');

        cy.then(() => {
            cy.VerificationCode.fetchDifferent(origVerificationCode).then((newVerificationCode) => {
                cy.log(`New verification code: ${newVerificationCode}`);
                cy.get('#confirmationCode').type(newVerificationCode);
            });
        });

        cy.get('.LoaderButton').click();
    },

    fillInSignupForm: (email: string, password: string): void => {
        cy.get('#email').type(email);
        cy.get('#password').type(password);
        cy.get('#confirmPassword').type(password);
    },
};

declare global {
    namespace Cypress {
        interface Chainable {
            Signup: {
                createNewCognitoUser: (email: string, password:  string) => void,
                fillInSignupForm: (email: string, password:  string) => void,
            }
        }
    }
}

export {};
