describe('Activity Suggestion', () => {

  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createDemoEntities();
    cy.createDatabaseInfoForActivitySuggestions();
  });
  
  afterEach(() => {
    cy.deleteAllButArs();
  });

  it('voluntário cria sugestão de atividade', () => {
    const NAME = 'Colocar árvores de natal';
    const REGION = 'Alameda';
    const NUMBER = '4';
    const DESCRIPTION = 'Colocar 16 árvores de natal no pavilhão de informática';
    const INSTITUTION = 'DEMO INSTITUTION';

    cy.demoVolunteerLogin();

    // intercept create activitySuggestion request and inject date values in the request body
    cy.intercept('POST', '/activitySuggestions/institution/*', (req) => {
      req.body = {
        applicationDeadline: '2025-09-13T12:00:00+00:00',
        startingDate: '2026-01-24T12:00:00+00:00',
        endingDate: '2026-02-15T12:00:00+00:00'
      };
    }).as('register');

    cy.intercept('GET', '/activitySuggestions/volunteer').as('getActivitySuggestions');

    // Aceder a página activitysuggestions
    cy.get('[data-cy="volunteerActivitySuggestions"]').click();
    cy.wait('@getActivitySuggestions');

    // Verifica o número de activitysuggestion inicial
    cy.get('[data-cy="volunteerActivitySuggestionsTable"] tbody tr')
    .should('have.length', 2);

    // Click no botão 
    cy.get('[data-cy="newActivitySuggestion"]').click();

    // Preenche o formulário
    cy.get('[data-cy="nameInput"]').type(NAME);
    cy.get('[data-cy="regionInput"]').type(REGION);
    cy.get('[data-cy="participantsNumberInput"]').type(NUMBER);
    cy.get('[data-cy="institutionSelect"]').click();
    cy.contains('.v-list-item__title', 'DEMO INSTITUTION').click();
    cy.get('[data-cy="descriptionInput"]').type(DESCRIPTION);

    cy.get('#applicationDeadlineInput-input').click();
    cy.selectDateTimePickerDate();
    cy.get('#startingDateInput-input').click();
    cy.selectDateTimePickerDate();
    cy.get('#endingDateInput-input').click();
    cy.selectDateTimePickerDate();
    
    cy.get('[data-cy="saveActivitySuggstion"]').click();
    cy.wait('@register'); //registar a activitysuggestion com data definida

    // Verifica que agora existem 3 sugestões
    cy.get('[data-cy="volunteerActivitySuggestionsTable"] tbody tr')
      .should('have.length', 3);


    // Verificação dos parâmetros
    cy.get('[data-cy="volunteerActivitySuggestionsTable"] tbody tr')
      .eq(0).children().eq(0).should('contain', NAME)
    cy.get('[data-cy="volunteerActivitySuggestionsTable"] tbody tr')
      .eq(0).children().eq(9).should('contain', INSTITUTION)
    cy.get('[data-cy="volunteerActivitySuggestionsTable"] tbody tr')
      .eq(0).children().eq(3).should('contain', NUMBER)
      
    cy.logout();
  });

  it('should display and manage activity suggestions correctly', () => {
    // login as member
    cy.demoMemberLogin();

    // navigate to the institution page
    cy.get('[data-cy="institution"]').click();

    // select activity suggestion
    cy.get('[data-cy="activitysuggestions"]').click();

    // verify that the first suggestion is in the "IN_REVIEW" state
    cy.get('[data-cy="memberActivitySuggestionsTable"] tbody tr')
      .eq(0).children().eq(9) // column 9 contains the state
      .should('contain', 'IN_REVIEW');

    cy.logout();
  });

  it('should approve and verify status change', () => {

    const NAME_ACTIVITYSUGGESTION_1 = 'Activity Suggestion #1';

    // login as member and navigete to the activity suggestion page
    cy.demoMemberLogin();
    cy.get('[data-cy="institution"]').click();
    cy.get('[data-cy="activitysuggestions"]').click();
    
    // ensure that the 'activity suggestion #1' has "IN REVIEW" state
    cy.get('[data-cy="memberActivitySuggestionsTable"] tbody tr')
      .eq(0).children().eq(9).should('contain', 'IN_REVIEW');
    
    // approve activity suggestion
    cy.get('[data-cy="approveActivitySuggestion"]').eq(0).click();
    
    // Check for status changes
    cy.get('[data-cy="memberActivitySuggestionsTable"] tbody tr')
      .contains('td', NAME_ACTIVITYSUGGESTION_1) // Find the row that contains the activity name
      .parent()
      .children().eq(9) 
      .should('contain', 'APPROVED');
    
    cy.logout();
    
    // login as volunteer and go to the activity suggestion page
    cy.demoVolunteerLogin();
    cy.get('[data-cy="volunteerActivitySuggestions"]').click();

    // find for 'Activity Suggestion #1' and check for status changes
    cy.get('[data-cy="volunteerActivitySuggestionsTable"] tbody tr')
      .contains('td', NAME_ACTIVITYSUGGESTION_1)
      .parent()
      .children().eq(8)
      .should('contain', 'APPROVED');
    
    cy.logout();
  });
    
  it('should reject and verify status change', () => {

    const NAME_ACTIVITYSUGGESTION_1 = 'Activity Suggestion #1';

    // login as member and navigete to the activity suggestion page
    cy.demoMemberLogin();
    cy.get('[data-cy="institution"]').click();
    cy.get('[data-cy="activitysuggestions"]').click();
    
    // ensure that the 'activity suggestion #1' has "IN REVIEW" state
    cy.get('[data-cy="memberActivitySuggestionsTable"] tbody tr')
      .eq(0).children().eq(9).should('contain', 'IN_REVIEW');
    
    // reject activity suggestion
    cy.get('[data-cy="rejectActivitySuggestion"]').eq(0).click();
    
    // check for status changes
    cy.get('[data-cy="memberActivitySuggestionsTable"] tbody tr')
      .contains('td', NAME_ACTIVITYSUGGESTION_1)
      .parent()
      .children().eq(9)
      .should('contain', 'REJECTED');
      
    cy.logout();
    
    // login as volunteer and navigate to the activity suggestion page
    cy.demoVolunteerLogin();
    cy.get('[data-cy="volunteerActivitySuggestions"]').click();

    // find for 'Activity Suggestion #1' and check for status changes
    cy.get('[data-cy="volunteerActivitySuggestionsTable"] tbody tr')
      .contains('td', NAME_ACTIVITYSUGGESTION_1)
      .parent()
      .children().eq(8)
      .should('contain', 'REJECTED');
    
    cy.logout();
  });
    
});
  