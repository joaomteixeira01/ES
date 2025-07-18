<template>
  <v-card class="table">
    <v-data-table
      :headers="headers"
      :items="activitySuggestions"
      :search="search"
      disable-pagination
      :hide-default-footer="true"
      :mobile-breakpoint="0"
      data-cy="memberActivitySuggestionsTable"
    >
      <template v-slot:item.institutionName="{ item }">
        {{ institutionName() }}
      </template>

      <template v-slot:top>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            class="mx-2"
          />
        </v-card-title>
      </template>

      Example columns (Title, Description, State)
      <template v-slot:[`item.state`]="{ item }">
        <v-chip>{{ item.state }}</v-chip>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <!-- Botão para aceitar/rejeitar atividade (visível apenas se estiver in_review) -->
        <v-tooltip bottom v-if="item.state === 'IN_REVIEW'">
          <template v-slot:activator="{ on }">
            <v-icon class="mr-2 action-button" color="green" v-on="on" @click="approveActivitySuggestion(item)" data-cy="approveActivitySuggestion">
              mdi-check
            </v-icon>
          </template>
          <span>Approve Activity</span>
        </v-tooltip>

        <v-tooltip bottom v-if="item.state === 'IN_REVIEW'">
          <template v-slot:activator="{ on }">
            <v-icon class="mr-2 action-button" color="red" v-on="on" @click="rejectActivitySuggestion(item)" data-cy="rejectActivitySuggestion">
              mdi-close
            </v-icon>
          </template>
          <span>Reject Activity</span>
        </v-tooltip>
        <!-- Botão para rejeitar atividade (visível apenas se estiver aprovada) -->
        <v-tooltip bottom v-if="item.state === 'APPROVED'">
          <template v-slot:activator="{ on }">
            <v-icon class="mr-2 action-button" color="red" v-on="on" @click="rejectActivitySuggestion(item)">
              mdi-close
            </v-icon>
          </template>
          <span>Reject Activity</span>
        </v-tooltip>
        <!-- Botão para aceitar atividade (visível apenas se estiver rejeitada) -->
        <v-tooltip bottom v-if="item.state === 'REJECTED'">
          <template v-slot:activator="{ on }">
            <v-icon class="mr-2 action-button" color="green" v-on="on" @click="approveActivitySuggestion(item)">
              mdi-check
            </v-icon>
          </template>
          <span>Approve Activity</span>
        </v-tooltip>
        </template>>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RemoteServices from '@/services/RemoteServices';
import Institution from '@/models/institution/Institution';
import ActivitySuggestion from '@/models/activitysuggestion/ActivitySuggestion';

@Component({
  components: {
  },
})
export default class VolunteerActivitySuggestionsView extends Vue {
  activitySuggestions: ActivitySuggestion[] = []; // TODO: this is the object that will be used to fill in the table
  institution: Institution = new Institution();
  search: string = '';
  headers: object = [
    {
      text: 'Name',
      value: 'name',
      align: 'left',
      width: '10%',
    },
    {
      text: 'Institution',
      value: 'institutionName',
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
      text: 'Action',
      value: 'action',
      align: 'left',
      width: '5%',
    } // Coluna de ação para aprovar/rejeitar
  ];

  async created() {
    await this.$store.dispatch('loading');
    try {
      // TODO
      const userId = this.$store.getters.getUser.id;
      this.institution = await RemoteServices.getInstitution(userId);
      const institutionId = this.institution.id;
      this.activitySuggestions = await RemoteServices.getActivitySuggestionsByInstitution(institutionId);
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }


  institutionName() {
    return this.institution.name;
  }

    async approveActivitySuggestion(activitySuggestion: ActivitySuggestion) {
    if (!activitySuggestion.id) {
      console.error("Cannot approve: suggestion ID is null.");
      return;
    }
    try {
      await RemoteServices.approveActivitySuggestion(activitySuggestion.id);
      await this.refreshActivitySuggestions();
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
  }

  async rejectActivitySuggestion(activitySuggestion: ActivitySuggestion) {
    if (!activitySuggestion.id) {
      console.error("Cannot reject: suggestion ID is null.");
      return;
    }
    try {
      await RemoteServices.rejectActivitySuggestion(activitySuggestion.id);
      await this.refreshActivitySuggestions();
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
  }

  async refreshActivitySuggestions() {
    try {
      const userId = this.$store.getters.getUser.id;
      this.institution = await RemoteServices.getInstitution(userId);
      this.activitySuggestions = await RemoteServices.getActivitySuggestionsByInstitution(this.institution.id);
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
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