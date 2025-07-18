<template>
  <v-card class="table">
    <v-data-table
      :headers="headers"
      :items="activitySuggestions"
      :search="search"
      disable-pagination
      :hide-default-footer="true"
      :mobile-breakpoint="0"
      data-cy="volunteerActivitySuggestionsTable"
    >
    <template v-slot:item.institutionId="{ item }">
      {{  getInstitutionName(item.institutionId) }}
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
          <v-btn color="primary" dark @click="newActivitySuggestion" data-cy="newActivitySuggestion"
            >New Activity Suggestion</v-btn
          >
        </v-card-title>
      </template>
    </v-data-table>
    <activitySuggestion-dialog
      v-if="currentActivitySuggestion && editActivitySuggestionDialog"
      v-model="editActivitySuggestionDialog"
      :activitySuggestion="currentActivitySuggestion"
      :institutions="institutions"
      v-on:save-activitySuggestion="onSaveActivitySuggestion"
      v-on:close-activitySuggestion-dialog="onCloseActivitySuggestionDialog"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RemoteServices from '@/services/RemoteServices';
import ActivitySuggestion from '@/models/activitysuggestion/ActivitySuggestion';
import ActivitySuggestionDialog from '@/views/volunteer/ActivitySuggestionDialog.vue';
import Institution from '@/models/institution/Institution';

@Component({
  components: {
    'activitySuggestion-dialog': ActivitySuggestionDialog,
  },
})
export default class VolunteerActivitySuggestionsView extends Vue {
  activitySuggestions: ActivitySuggestion[] = []; // The object that will be used to fill in the table
  search: string = '';
  institutions: Institution[] = [];
  
  currentActivitySuggestion: ActivitySuggestion | null = null;
  editActivitySuggestionDialog: boolean = false;
  
  headers: object = [
    {
      text: 'Name',
      value: 'name',
      align: 'left',
      width: '10%',
    },
    {
      text: 'Description',
      value: 'description',
      align: 'left',
      width: '30%',
    },
    {
      text: 'Region',
      value: 'region',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Participants Limit',
      value: 'participantsNumberLimit',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Start Date',
      value: 'formattedStartingDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'End Date',
      value: 'formattedEndingDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Application Deadline',
      value: 'formattedApplicationDeadline',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Creation Date',
      value: 'creationDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'State',
      value: 'state',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Institution',
      value: 'institutionId',
      align: 'left',
      width: '5%',
    },
  ];

  async created() {
    await this.$store.dispatch('loading');
    try {
      this.institutions = await RemoteServices.getInstitutions();
      this.activitySuggestions = await RemoteServices.getActivitySuggestionsByVolunteer();
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }


  newActivitySuggestion() {
    this.currentActivitySuggestion = new ActivitySuggestion();
    this.editActivitySuggestionDialog = true;
  }

  editActivitySuggestion(activitySuggestion: ActivitySuggestion) {
    this.currentActivitySuggestion = activitySuggestion;
    this.editActivitySuggestionDialog = true;
  }

  onCloseActivitySuggestionDialog() {
    this.currentActivitySuggestion = null;
    this.editActivitySuggestionDialog = false;
  }

  onSaveActivitySuggestion(activitySuggestion: ActivitySuggestion) {
    this.activitySuggestions = this.activitySuggestions.filter(
      (a) => a.id !== activitySuggestion.id,
    );
    
    console.log(activitySuggestion);
    this.activitySuggestions.unshift(activitySuggestion);
    this.editActivitySuggestionDialog = false;
    this.currentActivitySuggestion = null;
  }

  getInstitutionName(id: number) {
    const institution = this.institutions.find(inst => inst.id === id);
    return institution ? institution.name : 'Unknown Instituion';
  }

}
</script>

<style lang="scss" scoped>
.date-fields-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.date-fields-row {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
</style>