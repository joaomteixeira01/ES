<template>
  <div class="container">
    <div v-if="!institutionProfile || !institutionProfile.institution" class="d-flex flex-column align-center text-center">
      <h1>Institution Profile</h1>
      <v-card-subtitle>No institution profile found. Click the button below to create a new one!</v-card-subtitle>
      <v-btn
        depressed
        color="primary"
        @click="createInstitutionProfile"
        data-cy="createInstitutionProfile"
      >
        Create Institution Profile
      </v-btn>
    </div>

    <div v-if="institutionProfile && institutionProfile.institution">
      <h1>Institution: {{ institutionProfile.institution.name }}</h1>
      <div class="text-description">
        <p><strong>Short Description: </strong> {{ institutionProfile.shortDescription }}</p>
      </div>
      <div class="stats-container">
        <div class="items">
          <div class="icon-wrapper">
            <span data-cy="TotalMembers">{{ institutionProfile.numMembers }}</span>
          </div>
          <div class="project-name">
            <p>Total Members</p>
          </div>
        </div>
        <div class="items">
          <div class="icon-wrapper">
            <span data-cy="TotalActivities">{{ institutionProfile.numActivities }}</span>
          </div>
          <div class="project-name">
            <p>Total Activities</p>
          </div>
        </div>
        <div class="items">
          <div class="icon-wrapper">
            <span data-cy="TotalVolunteers">{{ institutionProfile.numVolunteers }}</span>
          </div>
          <div class="project-name">
            <p>Total Volunteers</p>
          </div>
        </div>
        <div class="items">
          <div class="icon-wrapper">
            <span data-cy="TotalAssessments">{{ institutionProfile.numAssessments }}</span>
          </div>
          <div class="project-name">
            <p>Total Assessments</p>
          </div>
        </div>
        <div class="items">
          <div class="icon-wrapper">
            <span>{{ institutionProfile.averageRating.toFixed(2) }}</span>
          </div>
          <div class="project-name">
            <p>Average Rating</p>
          </div>
        </div>
     </div>

      <div v-if="institutionProfile.selectedAssessments">
        <h2>Selected Assessments</h2>
        <div>
          <v-card class="table">
            <v-data-table
              :headers="headers"
              :items="institutionProfile.selectedAssessments"
              :search="search"
              disable-pagination
              :hide-default-footer="true"
              :mobile-breakpoint="0"
              data-cy="institutionAssessmentsTable"
            >
              <template v-slot:item.reviewDate="{ item }">
                {{ ISOtoString(item.reviewDate) }}
              </template>
              <template v-slot:top>
                <v-card-title>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    class="mx-2"
                  />
                  <v-spacer />
                </v-card-title>
              </template>
            </v-data-table>
          </v-card>
        </div>
      </div>
    </div>

    <institution-profile-dialog
      v-if="createInstitutionProfileDialog"
      v-model="createInstitutionProfileDialog"
      :institutionId="institutionId"
      v-on:save-institution-profile="onSaveInstitutionProfile"
      v-on:close-institution-profile-dialog="onCloseInstitutionProfileDialog"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ISOtoString } from "../../services/ConvertDateService";
import RemoteServices from '@/services/RemoteServices';
import InstitutionProfile from '@/models/profile/InstitutionProfile';
import InstitutionProfileDialog from '@/views/profile/InstitutionProfileDialog.vue'

@Component({
  methods: { ISOtoString },
  components: {
    'institution-profile-dialog': InstitutionProfileDialog,
  }
})
export default class InstitutionProfileView extends Vue {
  institutionId: number = 0;
  institutionProfile: InstitutionProfile | null = null;
  createInstitutionProfileDialog: boolean = false;

  search: string = '';
  headers: object = [
    {
      text: 'Volunteer Name',
      value: 'volunteerName',
      align: 'left',
      width: '30%',
    },
    {
      text: 'Review',
      value: 'review',
      align: 'left',
      width: '30%',
    },
    {
      text: 'Review Date',
      value: 'reviewDate',
      align: 'left',
      width: '40%',
    }
  ];

  async created() {
    await this.$store.dispatch('loading');

    try {
      this.institutionId = Number(this.$route.params.id);

      this.institutionProfile = await RemoteServices.getInstitutionProfile(this.institutionId);
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }

  async createInstitutionProfile() {
    this.institutionProfile = new InstitutionProfile();
    this.createInstitutionProfileDialog = true;
  }

  async onSaveInstitutionProfile(institutionProfile: InstitutionProfile) {
    this.institutionProfile = institutionProfile;
    this.createInstitutionProfileDialog = false;
  }

  async onCloseInstitutionProfileDialog() {
    this.institutionProfile = null;
    this.createInstitutionProfileDialog = false;
  }
}
</script>

<style lang="scss" scoped>
.stats-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  align-content: center;
  height: 100%;

  .items {
    background-color: rgba(255, 255, 255, 0.75);
    color: #696969;
    border-radius: 5px;
    flex-basis: 25%;
    margin: 20px;
    cursor: pointer;
    transition: all 0.6s;
  }
}

.icon-wrapper,
.project-name {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  font-size: 100px;
  transform: translateY(0px);
  transition: all 0.6s;
}

.icon-wrapper {
  align-self: end;
}

.project-name {
  align-self: start;
}

.project-name p {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  transform: translateY(0px);
  transition: all 0.5s;
}

.items:hover {
  border: 3px solid black;

  & .project-name p {
    transform: translateY(-10px);
  }

  & .icon-wrapper i {
    transform: translateY(5px);
  }
}

.text-description {
  display: block;
  padding: 1em;
}
</style>