describe('volunteerProfile', () => {
  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createDemoEntities();
    cy.createDatabaseInfoForVolunteerProfile();
  });

  afterEach(() => {
    cy.deleteAllButArs();
  });

  it('voluntario cria perfil', () => {
    cy.demoVolunteerLogin();

    const TOTALENROLLMENTS = 4;
    const TOTALPARTICIPATIONS = 3;
    const TOTALASSESSMENTS = 1;
    const AVERAGERATING = 5;
    const SHORTBIO = 'Short bio test';
    const NAME = 'DEMO-VOLUNTEER';

    cy.intercept('POST', '/profile/volunteer').as('createVolunteerProfile');
    cy.intercept('GET', '/profile/volunteer/**').as('getVolunteerProfile');
    cy.intercept('GET', '/activities').as('getActivities');
    cy.intercept('GET', '/participations/volunteer').as('getParticipations');
    cy.intercept('GET', '/profile/volunteers').as('getVolunteerProfiles');

    // Create form
    cy.get('[data-cy="profiles"]').click(); 
    cy.get('[data-cy="volunteer-profile"]').click(); 
    cy.get('[data-cy="volunteerProfileBtn"]').click();

    cy.wait('@getActivities');
    cy.wait('@getParticipations');

    // Fill form
    cy.get('[data-cy="short-bioInput"]').type(SHORTBIO);
    // Select 2 participations
    cy.get('[data-cy="participationsTable"] tbody tr').eq(0).find('.v-data-table__checkbox').click();
    cy.get('[data-cy="participationsTable"] tbody tr').eq(1).find('.v-data-table__checkbox').click();

    // Save form
    cy.get('[data-cy="saveButton"]').click();

    // Check request was done
    cy.wait('@createVolunteerProfile')
    cy.wait('@getVolunteerProfile')

    // Check if the total participations is shown correctly in the new profile (should be 2 in this case)
    cy.get('[data-cy="volunteerName"]').should('contain', NAME);
    cy.get('[data-cy="volunteerBio"]').should('contain', SHORTBIO);
    cy.get('[data-cy="totalEnrollments"]').should('contain',TOTALENROLLMENTS);
    cy.get('[data-cy="totalParticipations"]').should('contain', TOTALPARTICIPATIONS);
    cy.get('[data-cy="totalAssessments"]').should('contain', TOTALASSESSMENTS);
    cy.get('[data-cy="averageRating"]').should('contain', AVERAGERATING.toFixed(2));
    // Check if at least one of the selected participations appears in the list
    cy.get('[data-cy="participations"] tbody tr').should('have.length.at.least', 2);

    cy.logout();

    // Check that, after a volunteer creates their profile, it is listed in the list of all volunteer profiles
    cy.visit('/');
    // Check that, after a volunteer creates their profile, it is listed in the list of all volunteer profiles
    cy.get('[data-cy="profiles"]').click();
    cy.get('[data-cy="view-profiles"]').click();

    cy.wait('@getVolunteerProfiles');
    
    cy.get('[data-cy="volunteerProfilesTable"]').should('exist');

    cy.get('[data-cy="volunteerProfilesTable"] tbody tr').should('have.length.at.least', 1);

    cy.get('[data-cy="volunteerProfilesTable"] tbody tr')
      .eq(1).children().eq(0).should('contain', NAME);
    cy.get('[data-cy="volunteerProfilesTable"] tbody tr')
      .eq(1).children().eq(1).should('contain', SHORTBIO);
    cy.get('[data-cy="volunteerProfilesTable"] tbody tr')
      .eq(1).children().eq(2).should('contain', '2022-02-06 17:58');
    cy.get('[data-cy="volunteerProfilesTable"] tbody tr')
      .eq(1).children().eq(4).find('button').should('exist');

    cy.get('[data-cy="profileButton"]').eq(1).click();
    cy.get('[data-cy="volunteerName"]').should('contain', NAME);
    cy.get('[data-cy="volunteerBio"]').should('contain', SHORTBIO);
    cy.get('[data-cy="totalEnrollments"]').should('contain',TOTALENROLLMENTS);
    cy.get('[data-cy="totalParticipations"]').should('contain', TOTALPARTICIPATIONS);
    cy.get('[data-cy="totalAssessments"]').should('contain', TOTALASSESSMENTS);
    cy.get('[data-cy="averageRating"]').should('contain', AVERAGERATING.toFixed(2));
    // Check if at least one of the selected participations appears in the list
    cy.get('[data-cy="participations"] tbody tr').should('have.length.at.least', 2);

    //Check if you can view other profiles
    cy.get('[data-cy="profiles"]').click();
    cy.get('[data-cy="view-profiles"]').click();

    cy.wait('@getVolunteerProfiles');

    cy.get('[data-cy="volunteerProfilesTable"]').should('exist');

    cy.get('[data-cy="volunteerProfilesTable"] tbody tr').should('have.length.at.least', 1);

    cy.get('[data-cy="profileButton"]').eq(0).click();

    cy.get('[data-cy="volunteerName"]').should('contain', 'Alberto');
  })

  it('ver perfil do alberto', () => {
    const NAME = 'Alberto';
    const SHORTBIO = 'Olá sou o Albero Caeiro!'
    const TOTALENROLLMENTS = 1;
    const TOTALPARTICIPATIONS = 1;
    const TOTALASSESSMENTS = 0;
    const AVERAGERATING = 5;

    cy.intercept('GET', '/profile/volunteers').as('getVolunteerProfiles');
    // Check that, after a volunteer creates their profile, it is listed in the list of all volunteer profiles
    cy.visit('/');
    // Check that, after a volunteer creates their profile, it is listed in the list of all volunteer profiles
    cy.get('[data-cy="profiles"]').click();
    cy.get('[data-cy="view-profiles"]').click();

    cy.wait('@getVolunteerProfiles');

    cy.get('[data-cy="volunteerProfilesTable"]').should('exist');

    cy.get('[data-cy="volunteerProfilesTable"] tbody tr').should('have.length.at.least', 1);

    cy.get('[data-cy="volunteerProfilesTable"] tbody tr')
      .eq(0).children().eq(0).should('contain', NAME);
    cy.get('[data-cy="volunteerProfilesTable"] tbody tr')
      .eq(0).children().eq(1).should('contain', SHORTBIO);
    cy.get('[data-cy="volunteerProfilesTable"] tbody tr')
      .eq(0).children().eq(2).should('contain', '2022-02-06 17:58');
    cy.get('[data-cy="volunteerProfilesTable"] tbody tr')
      .eq(0).children().eq(4).find('button').should('exist');

    cy.get('[data-cy="profileButton"]').eq(0).click();
    cy.get('[data-cy="volunteerName"]').should('contain', NAME);
    cy.get('[data-cy="volunteerBio"]').should('contain', SHORTBIO);
    cy.get('[data-cy="totalEnrollments"]').should('contain',TOTALENROLLMENTS);
    cy.get('[data-cy="totalParticipations"]').should('contain', TOTALPARTICIPATIONS);
    cy.get('[data-cy="totalAssessments"]').should('contain', TOTALASSESSMENTS);
    cy.get('[data-cy="averageRating"]').should('contain', AVERAGERATING.toFixed(2));
    // Check if at least one of the selected participations appears in the list
    cy.get('[data-cy="participations"] tbody tr').should('have.length.at.least', 1);
  })
});