const s3Obj = 'http://pray4u-e2e-testing-email-verification.s3-website-us-east-1.amazonaws.com/EmailVerificationMessage';

cy.VerificationCode = {
    fetch: (): Cypress.Chainable<string> => {
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
    },

    fetchDifferent: (originalCode: string): Cypress.Chainable<any> => {
        return cy.VerificationCode.fetch().then((code: string) => {
            if (code == '' || code == originalCode) {
                cy.wait(500);
                return cy.VerificationCode.fetchDifferent(originalCode)
                    .then((code) => code);
            }

            return code;
        });
    }
};

declare global {
    namespace Cypress {
        interface Chainable {
            VerificationCode: {
                fetch: () => Cypress.Chainable<string>,
                fetchDifferent: (originalCode: string) => Cypress.Chainable<any>
            }
        }
    }
}

export {};
