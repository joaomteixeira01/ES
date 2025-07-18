describe('InstitutionProfile', () => {
    beforeEach(() => {
        cy.deleteAllButArs();
        cy.createDemoEntities();
        cy.createDatabaseInfoForInstitutionProfiles();
      });
    
      afterEach(() => {
        cy.deleteAllButArs();
      });

    it('create institution profile', () => {
        const SHORTDESCRIPTION = "This is a short description!";

        cy.demoMemberLogin();
        // intercept create institution profile request
        cy.intercept('POST', '/profile/institution').as('register'); //colocar o url do controller ou do router?
        // intercept get institution profile
        cy.intercept('GET', '/profile/institution/*').as('getInstitutionProfile');
        // go to create institution profile form
        cy.get('[data-cy="profiles"]').click();

        cy.get('[data-cy="member-profile"]').click();
        cy.wait('@getInstitutionProfile');

        cy.get('[data-cy="createInstitutionProfile"]').click();
        
        // fill form
        cy.get('[data-cy="shortDescriptionInput"]').type(SHORTDESCRIPTION);
        cy.get('[data-cy="institutionAssessmentsTableSelect"] tbody tr')
          .eq(0)
          .children()
          .eq(0)
          .click();
        // save form
        cy.get('[data-cy="saveInstitutionProfile"').click();
        // check request was done
        cy.wait('@register');
        // check results
        cy.get('[data-cy="institutionAssessmentsTable"] tbody tr')
          .should('have.length', 1)
          .eq(0)
          .children()
          .should('have.length', 3);
        cy.get('[data-cy="TotalMembers"]')
          .should('have.text', '1');
        cy.get('[data-cy="TotalActivities"]')
          .should('have.text', '6');
        cy.get('[data-cy="TotalVolunteers"]')
          .should('have.text', '3');
        cy.get('[data-cy="TotalAssessments"]')
          .should('have.text', '1');

        cy.logout();
        // intercept get all institution profiles
        cy.intercept('GET', '/profile/institutions').as('getInstitutionsProfile');
        // go to institution profile list
        cy.get('[data-cy="profiles"]').click();

        cy.get('[data-cy="view-profiles"]').click();
        cy.wait('@getInstitutionsProfile');
        // check results
        cy.get('[data-cy="profilesInstitutionTable"] tbody tr')
          .should('have.length', 1)
          .eq(0)
          .children()
          .should('have.length', 5);
        cy.get('[data-cy="profilesInstitutionTable"] tbody tr')
          .eq(0).children().eq(1).should('contain', SHORTDESCRIPTION);
    });
});