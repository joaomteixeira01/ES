<template>
  <v-dialog v-model="dialog" persistent width="1300">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ editActivitySuggestion && editActivitySuggestion.id === null ? 'New Activity Suggestion' : 'Edit Activity Suggestion' }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="*Name"
                :rules="[(v) => !!v || 'Activity Suggestion name is required']"
                required
                v-model="editActivitySuggestion.name"
                data-cy="nameInput"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="*Region"
                :rules="[(v) => !!v || 'Region name is required']"
                required
                v-model="editActivitySuggestion.region"
                data-cy="regionInput"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="*Number of Participants"
                :rules="[(v) => isNumberValid(v) || 'Number of participants should be a number']"
                required
                v-model="editActivitySuggestion.participantsNumberLimit"
                data-cy="participantsNumberInput"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                label="*Institution"
                v-model="editActivitySuggestion.institutionId"
                :items="institutions"
                :rules="[(v) => !!v || 'Institution is required']"
                item-text="name"
                item-value="id"
                required
                data-cy = "institutionSelect"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="*Description"
                :rules="[(v) => isDescriptionValid(v) || 'The description should have at least 10 characters']"
                required
                v-model="editActivitySuggestion.description"
                data-cy="descriptionInput"
                ></v-text-field>
            </v-col>
            <v-col>
              <VueCtkDateTimePicker
                id="applicationDeadlineInput"
                v-model="editActivitySuggestion.applicationDeadline"
                format="YYYY-MM-DDTHH:mm:ssZ"
                label="*Application Deadline"
              ></VueCtkDateTimePicker>
            </v-col>
            <v-col>
              <VueCtkDateTimePicker
                id="startingDateInput"
                v-model="editActivitySuggestion.startingDate"
                format="YYYY-MM-DDTHH:mm:ssZ"
                label="*Starting Date"
              ></VueCtkDateTimePicker>
            </v-col>
            <v-col>
              <VueCtkDateTimePicker
                id="endingDateInput"
                v-model="editActivitySuggestion.endingDate"
                format="YYYY-MM-DDTHH:mm:ssZ"
                label="*Ending Date"
              ></VueCtkDateTimePicker>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn 
          color="blue darken-1" 
          variant="text"
          @click="$emit('close-activitySuggestion-dialog')"
        > 
          Close
        </v-btn>
        <v-btn 
          color="blue darken-1" 
          variant="text"
          @click="createActivitySuggestion"
          data-cy="saveActivitySuggstion"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator';
import ActivitySuggestion from '@/models/activitysuggestion/ActivitySuggestion';
import RemoteServices from '@/services/RemoteServices';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import Institution from '@/models/institution/Institution';

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);

@Component
export default class ActivitySuggestionDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: ActivitySuggestion, required: true }) readonly activitySuggestion!: ActivitySuggestion;
  @Prop({ type: Array, required: true }) readonly institutions!: Institution[];

  editActivitySuggestion: ActivitySuggestion = new ActivitySuggestion();

  cypressCondition: boolean = false;
  
  async created() {
    this.editActivitySuggestion = new ActivitySuggestion(this.activitySuggestion);
  }

  isNumberValid(value: any) {
    return /^\d+$/.test(value);
  }

  isDescriptionValid(value: any) {
    return value.length >= 10;
  }

  get canSave(): boolean {
    return(
      this.cypressCondition ||
      (!! this.editActivitySuggestion.name &&
        !! this.editActivitySuggestion.region &&
        !! this.editActivitySuggestion.participantsNumberLimit &&
        !! this.editActivitySuggestion.institutionId &&
        !! this.editActivitySuggestion.description &&
        !! this.editActivitySuggestion.applicationDeadline &&
        !! this.editActivitySuggestion.startingDate &&
        !! this.editActivitySuggestion.endingDate)
    );
  }

  async createActivitySuggestion() {
    console.log(this.editActivitySuggestion);
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      try {
        const result = await RemoteServices.createActivitySuggestion(this.editActivitySuggestion.institutionId, this.editActivitySuggestion);
        console.log(result);
        this.$emit('save-activitySuggestion', result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  } 
}
</script>

<style scoped lang="scss"></style>