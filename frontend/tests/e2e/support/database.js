const credentials = {
  user: Cypress.env('psql_db_username'),
  host: Cypress.env('psql_db_host'),
  database: Cypress.env('psql_db_name'),
  password: Cypress.env('psql_db_password'),
  port: Cypress.env('psql_db_port'),
};

const INSTITUTION_COLUMNS = "institutions (id, active, confirmation_token, creation_date, email, name, nif, token_generation_date)";
const USER_COLUMNS = "users (user_type, id, creation_date, name, role, state, institution_id)";
const AUTH_USERS_COLUMNS = "auth_users (auth_type, id, active, email, username, user_id)";
const ACTIVITY_COLUMNS = "activity (id, application_deadline, creation_date, description, ending_date, name, participants_number_limit, region, starting_date, state, institution_id)";
const ENROLLMENT_COLUMNS = "enrollment (id, enrollment_date_time, motivation, activity_id, volunteer_id)"
const PARTICIPATION_COLUMNS = "participation (id, acceptance_date, member_rating, member_review, volunteer_rating, volunteer_review, activity_id, volunteer_id)"
const ASSESSMENT_COLUMNS = "assessment (id, review, review_date, institution_id, volunteer_id)";
const REPORT_COLUMNS = "report (id, justification, activity_id, volunteer_id)";
const ACTIVITY_SUGGESTION_COLUMNS = "activity_suggestion (id, volunteer_id, name, region, description, institution_id, participants_number_limit, creation_date, application_deadline, starting_date, ending_date, state)";
const VOLUNTEER_PROFILE_COLUMNS = "volunteer_profile (id, short_bio, num_total_assessments, num_total_enrollments, num_total_participations, average_rating, volunteer_id)";

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const dayAfterTomorrow = new Date(now);
dayAfterTomorrow.setDate(now.getDate() + 2);
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const dayBeforeYesterday = new Date(now);
dayBeforeYesterday.setDate(now.getDate() - 2);

Cypress.Commands.add('deleteAllButArs', () => {
  cy.task('queryDatabase', {
    query: "DELETE FROM ASSESSMENT",
    credentials: credentials,
  })
  cy.task('queryDatabase', {
    query: "DELETE FROM PARTICIPATION",
    credentials: credentials,
  })
  cy.task('queryDatabase', {
    query: "DELETE FROM VOLUNTEER_PROFILE",
    credentials: credentials,
  })
  cy.task('queryDatabase', {
    query: "DELETE FROM ENROLLMENT",
    credentials: credentials,
  })
  cy.task('queryDatabase', {
    query: "DELETE FROM REPORT",
    credentials: credentials,
  })
  cy.task('queryDatabase', {
    query: "DELETE FROM ACTIVITY",
    credentials: credentials,
  })
  cy.task('queryDatabase', {
    query: "DELETE FROM ACTIVITY_SUGGESTION",
    credentials: credentials,
  })
  cy.task('queryDatabase', {
    query: "DELETE FROM AUTH_USERS WHERE NOT (username = 'ars')",
    credentials: credentials,
  });
  cy.task('queryDatabase', {
    query: "DELETE FROM USERS WHERE NOT (name = 'ars')",
    credentials: credentials,
  });
  cy.task('queryDatabase', {
  query: "DELETE FROM INSTITUTION_PROFILE",
    credentials: credentials,
  });
  cy.task('queryDatabase', {
    query: "DELETE FROM INSTITUTIONS",
    credentials: credentials,
  });
});

Cypress.Commands.add('createDemoEntities', () => {
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + INSTITUTION_COLUMNS + generateInstitutionTuple(1, "DEMO INSTITUTION", "000000000"),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + USER_COLUMNS + generateUserTuple(2, "MEMBER","DEMO-MEMBER", "MEMBER", 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + AUTH_USERS_COLUMNS + generateAuthUserTuple(2, "DEMO", "demo-member", 2),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + USER_COLUMNS + generateUserTuple(3, "VOLUNTEER","DEMO-VOLUNTEER", "VOLUNTEER", "NULL"),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + AUTH_USERS_COLUMNS + generateAuthUserTuple(3, "DEMO", "demo-volunteer", 3),
    credentials: credentials,
  })
});

Cypress.Commands.add('createDatabaseInfoForEnrollments', () => {
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(1, "A1", "Enrollment is open",  tomorrow.toISOString(), tomorrow.toISOString(),
      tomorrow.toISOString(),1, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(2, "A2", "Enrollment is open and it is already enrolled",  tomorrow.toISOString(), tomorrow.toISOString(),
      tomorrow.toISOString(),1, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(3, "A3", "Enrollment is closed",  yesterday.toISOString(), tomorrow.toISOString(),
      tomorrow.toISOString(),1, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(5, 2, 3),
    credentials: credentials,
  })
});

Cypress.Commands.add('createDatabaseInfoForReports', () => {
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(1, "A1", "Enrollment is open",  tomorrow.toISOString(), tomorrow.toISOString(),
      tomorrow.toISOString(),1, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(2, "A2", "Enrollment is open and it is already enrolled",  tomorrow.toISOString(), tomorrow.toISOString(),
      tomorrow.toISOString(),1, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(3, "A3", "Enrollment is closed",  yesterday.toISOString(), tomorrow.toISOString(),
      tomorrow.toISOString(),1, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(5, 2, 3),
    credentials: credentials,
  })
});

Cypress.Commands.add('createDatabaseInfoForParticipations', () => {
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + USER_COLUMNS + generateUserTuple(4, "VOLUNTEER","DEMO-VOLUNTEER-2", "VOLUNTEER", "NULL"),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + AUTH_USERS_COLUMNS + generateAuthUserTuple(4, "DEMO", "demo-volunteer-2", 4),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + USER_COLUMNS + generateUserTuple(5, "VOLUNTEER","DEMO-VOLUNTEER-3", "VOLUNTEER", "NULL"),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + AUTH_USERS_COLUMNS + generateAuthUserTuple(5, "DEMO", "demo-volunteer-3", 5),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(1, "A1", "Has vacancies",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),2, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(2, "A2", "Has no vacancies",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),1, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(1, 1, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(2, 1, 4),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(3, 2, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(4, 2, 5),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + PARTICIPATION_COLUMNS + generateParticipationTuple(5, 1, 4),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + PARTICIPATION_COLUMNS + generateParticipationTuple(6, 2, 3),
    credentials: credentials,
  })
});

Cypress.Commands.add('createDatabaseInfoForAssessments', () => {
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + INSTITUTION_COLUMNS + generateInstitutionTuple(2, "DEMO INSTITUTION-2", "000000002"),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(1, "A1", "Same institution is enrolled and participates", dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),1, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(2, "A2", "Same institution is enrolled and participates",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),2, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(3, "A3", "Same institution is enrolled and does not participate",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),3, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(4, "A4", "Same institution is not enrolled",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),3, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(5, "A5", "Same institution before end date",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      tomorrow.toISOString(),3, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(6, "A6", "Other institution is enrolled and participates",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),3, 2),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(1, 1, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(2, 2, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(3, 3, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(4, 6, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + PARTICIPATION_COLUMNS + generateParticipationTuple(1, 1, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + PARTICIPATION_COLUMNS + generateParticipationTuple(2, 2, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + PARTICIPATION_COLUMNS + generateParticipationTuple(3, 6, 3),
    credentials: credentials,
  })
});

Cypress.Commands.add('createDatabaseInfoForVolunteerAssessments', () => {
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ASSESSMENT_COLUMNS + generateAssessmentTuple(1, "Muito bom!", 2, 3),
    credentials: credentials,
  })
});

Cypress.Commands.add('createDatabaseInfoForActivitySuggestions', () => {
  cy.task('queryDatabase', {
    query: "INSERT INTO " + ACTIVITY_SUGGESTION_COLUMNS + generateActivitySuggestionTuple(1, 3 ,"Activity Suggestion #1", "Lisbon", "Description for Activity Suggestion #1", 1, 10, tomorrow.toISOString(), tomorrow.toISOString(), dayAfterTomorrow.toISOString()),
    credentials: credentials,
  })
  cy.task('queryDatabase', {
    query: "INSERT INTO " + ACTIVITY_SUGGESTION_COLUMNS + generateActivitySuggestionTuple(2, 3, "Activity Suggestion #2", "Lisbon", "Description for Activity Suggestion #2", 1, 20, tomorrow.toISOString(), tomorrow.toISOString(), dayAfterTomorrow.toISOString()),
    credentials: credentials,
  })
});

Cypress.Commands.add('createDatabaseInfoForVolunteerProfile', () => {

  //Create new user
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + USER_COLUMNS + generateUserTuple(10, "VOLUNTEER","Alberto", "VOLUNTEER", "NULL"),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + AUTH_USERS_COLUMNS + generateAuthUserTuple(10, "DEMO", "Caeiro123", 10),
    credentials: credentials,
  })

  const activity_data = [
    [1, '2025-03-15 21:32:00', '2025-03-15 21:29:40.923181', 'Corrida ou caminhada solidária com cães para adopção.', '2025-03-15 21:34:00', 'Cãorrida Solidária', 5, 'Cascais', '2025-03-15 21:33:00', 'APPROVED', 1],
    [2, '2025-03-15 21:34:00', '2025-03-15 21:32:21.397277', 'Feira solidária para angariar fundos para a associação.', '2025-03-15 21:36:00', 'Latidos do Bem', 3, 'Lisboa', '2025-03-15 21:35:00', 'APPROVED', 1],
    [3, '2025-03-15 21:42:00', '2025-03-15 21:41:33.069243', 'Jantar de confraternização para membros, voluntários e amigos da instituição.', '2025-03-15 21:44:00', 'Cãofraternização', 4, 'Évora', '2025-03-15 21:43:00', 'APPROVED', 1],
    [4, '2025-03-15 21:49:00', '2025-03-15 21:47:58.805785', 'Acção de resgate e cuidado de cães de rua', '2025-03-15 21:51:00', 'Patrulha Canina do Bem', 5, 'Leiria', '2025-03-15 21:50:00', 'APPROVED', 1],
    [5, '2025-03-15 21:53:00', '2025-03-15 21:52:27.135158', 'Evento para promover a adopção de cães.', '2025-03-15 21:55:00', 'Patudos à Procura', 2, 'Lisboa', '2025-03-15 21:54:00', 'APPROVED', 1],
    [6, '2025-03-15 21:55:00', '2025-03-15 21:54:33.008279', 'Evento de doação de comida e brinquedos.', '2025-03-15 21:57:00', 'Focinhos Felizes', 4, 'Porto', '2025-03-15 21:56:00', 'APPROVED', 1]
  ];

  activity_data.forEach((row) => {
    cy.task('queryDatabase',  {
      query: "INSERT INTO " + ACTIVITY_COLUMNS + generateFullActivityTuple(...row),
      credentials: credentials,
    })
  })

  const enrollment_data = [
    [1, '2025-03-15 21:31:01.756194', 'Eu gosto muito de cães e gostaria de participar!', 1, 3],
    [2, '2025-03-15 21:32:54.151576', 'Gostaria de ajudar e tenho experiência com vendas em feiras.', 2, 10],
    [3, '2025-03-15 21:41:48.828746', 'Adoraria participar!', 3, 3],
    [4, '2025-03-15 21:48:45.887907', 'Adoro a iniciativa!', 4, 3],
    [5, '2025-03-15 21:52:54.073817', 'Gostaria de participar porque gosto muito da missão da vossa instituição!', 5, 3]
  ];


  enrollment_data.forEach((row) => {
    cy.task('queryDatabase',  {
      query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateFullEnrollmentTuple(...row),
      credentials: credentials,
    })
  })

  cy.task('queryDatabase', {
    query: "INSERT INTO " + ASSESSMENT_COLUMNS + generateAssessmentTuple(1, "Muito bom!", 1, 3),
    credentials: credentials,
  })
  const participation_data = [
    [1, '2025-03-15 21:32:26.130136', 5, 'O voluntário foi muito prestável na organização da cãorrida.', 5, 'Evento muito bem organizado!', 1, 3],
    [2, '2025-03-15 21:34:02.772345', 5, 'A ajuda do voluntário foi muito útil, obrigado!', 4, 'A feira foi bem organizada!', 2, 10],
    [3, '2025-03-15 21:42:13.722332', 5, 'Participação excelente, obrigado!', 5, 'O jantar correu muito bem. Continuem o bom trabalho!', 3, 3],
    [4, '2025-03-15 21:49:18.180227', null, null, null, null, 4, 3]
  ];

  participation_data.forEach((row) => {
    cy.task('queryDatabase',  {
      query: "INSERT INTO " + PARTICIPATION_COLUMNS + generateFullParticipationTuple(...row),
      credentials: credentials,
    })
  })

  cy.task('queryDatabase', {
    query: "INSERT INTO " + VOLUNTEER_PROFILE_COLUMNS
      + generateVolunteerProfileTuple(10, "Olá sou o Albero Caeiro!"
        , 0, 1,1,5,10),
    credentials: credentials,
  })
});

function generateFullEnrollmentTuple(id, enrollment_date_time, motivation, activity_id, volunteer_id) {
  return "VALUES (" + id + ",'" + enrollment_date_time + "','" + motivation + "'," + activity_id + "," + volunteer_id+")";
}

function generateFullParticipationTuple(id, acceptance_date, member_rating, member_review, volunteer_rating, volunteer_review, activity_id, volunteer_id){
  return "VALUES (" + id + ", '" + (acceptance_date || 'NULL') + "'," +
    (member_rating !== null ? member_rating : 'NULL') + "," +
    (member_review !== null ? "'" + member_review + "'" : 'NULL') + "," +
    (volunteer_rating !== null ? volunteer_rating : 'NULL') + "," +
    (volunteer_review !== null ? "'" + volunteer_review + "'" : 'NULL') + "," +
    activity_id + "," + volunteer_id + ")";
}

function generateFullActivityTuple(id, application_deadline, creation_date, description, ending_date, name, participants_number_limit, region, starting_date, state, institution_id) {
  return "VALUES (" +
    id + ", " +
    (application_deadline ? "'" + application_deadline + "'" : "NULL") + ", " +
    (creation_date ? "'" + creation_date + "'" : "NULL") + ", " +
    (description ? "'" + description + "'" : "NULL") + ", " +
    (ending_date ? "'" + ending_date + "'" : "NULL") + ", " +
    (name ? "'" + name + "'" : "NULL") + ", " +
    (participants_number_limit !== null ? participants_number_limit : "NULL") + ", " +
    (region ? "'" + region + "'" : "NULL") + ", " +
    (starting_date ? "'" + starting_date + "'" : "NULL") + ", " +
    (state ? "'" + state + "'" : "NULL") + ", " +
    (institution_id !== null ? institution_id : "NULL") +
    ")";

}

function generateVolunteerProfileTuple(id, shortBio, num_total_assessments, num_total_enrollments, num_total_participations, averageRating, volunteerId) {
  return "VALUES (" +
    id + ", '" +
    shortBio + "', " +
    num_total_assessments + ", " +
    num_total_enrollments + ", " +
    num_total_participations + ", " +
    averageRating + ", " +
    volunteerId + ")";
}

Cypress.Commands.add('createDatabaseInfoForInstitutionProfiles', () => {
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(1, "A1", "Same institution is enrolled and participates", dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),1, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(2, "A2", "Same institution is enrolled and participates",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),2, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(3, "A3", "Same institution is enrolled and does not participate",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),3, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(4, "A4", "Same institution is not enrolled",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),3, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(5, "A5", "Same institution before end date",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      tomorrow.toISOString(),3, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ACTIVITY_COLUMNS + generateActivityTuple(6, "A6", "Other institution is enrolled and participates",  dayBeforeYesterday.toISOString(), yesterday.toISOString(),
      yesterday.toISOString(),3, 1),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(1, 1, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(2, 2, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(3, 3, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + ENROLLMENT_COLUMNS + generateEnrollmentTuple(4, 6, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + PARTICIPATION_COLUMNS + generateParticipationTuple(1, 1, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + PARTICIPATION_COLUMNS + generateParticipationTuple(2, 2, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase',  {
    query: "INSERT INTO " + PARTICIPATION_COLUMNS + generateParticipationTuple(3, 6, 3),
    credentials: credentials,
  })
  cy.task('queryDatabase', {
    query: "INSERT INTO " + ASSESSMENT_COLUMNS + generateAssessmentTuple(1, "Participei numa cãorrida da Demo Institution. O evento foi muito bem organizado, parabéns!", 1, 3),
    credentials: credentials,
  })
});

function generateAuthUserTuple(id, authType, username, userId) {
  return "VALUES ('"
    + authType + "', '"
    + id + "', 't', 'demo_member@mail.com','"
    + username + "', '"
    + userId + "')"
}

function generateUserTuple(id, userType, name, role, institutionId) {
  return "VALUES ('"
    + userType + "', '"
    + id + "', '2022-02-06 17:58:21.419878', '"
    + name + "', '"
    + role + "', 'ACTIVE', "
    + institutionId + ")";
}

function generateInstitutionTuple(id, name, nif) {
  return "VALUES ('"
    + id + "', 't', 'abca428c09862e89', '2022-08-06 17:58:21.402146','demo_institution@mail.com', '" +
    name + "', '" +
    nif + "', '2024-02-06 17:58:21.402134')";
}

function generateActivityTuple(id, name, description, deadline, start, end, participants, institutionId) {
  return "VALUES ('"
    + id + "', '"
    + deadline +
    "', '2022-08-06 17:58:21.402146', '" +
    description + "', '"
    + end + "', '"
    + name + "', '" +
    participants +
    "', 'Lisbon',  '"
    + start + "', 'APPROVED', " +
    institutionId + ")";
}

function generateActivitySuggestionTuple(id, volunteer_id, name, region, description, institutionId, participants, applicationDeadline, startingDate, endingDate) {
  return "VALUES ('"
    + id + "', '"
    + volunteer_id + "', '"
    + name + "', '"
    + region + "', '"
    + description + "', '"
    + institutionId + "', '"
    + participants + "', "
    + "'2022-08-06 17:58:21.402146', '"
    + applicationDeadline + "', '"
    + startingDate + "', '"
    + endingDate + "', "
    + "'IN_REVIEW')";
}

function generateEnrollmentTuple(id, activityId, volunteerId) {
  return "VALUES ("
    + id + ", '2022-08-06 17:58:21.402146', 'sql-inserted-motivation', "
    + activityId + ", "
    + volunteerId + ")";
}

function generateParticipationTuple(id, activityId, volunteerId) {
  return "VALUES ("
    + id + ", '2024-02-06 18:51:37.595713', '5', 'Muito Bom!', '3', 'Nao foi a melhor experiencia', " +
    activityId + ", " +
    volunteerId + ")";
}

function generateAssessmentTuple(id, review, institutionId, volunteerId) {
  return "VALUES (" + id + ", '" + review + "', '2024-02-07 18:51:37.595713', '" + institutionId + "', " + volunteerId + ")";
}