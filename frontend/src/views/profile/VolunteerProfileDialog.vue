<template>
  <v-dialog
    :value="dialog"
    @input="$emit('close-dialog')"
    @keydown.esc="$emit('close-dialog')"
    max-width="75%"
    max-height="80%"
  >
    <v-card>
      <v-form ref="form" lazy-validation>
        <v-card-title>
          <span class="headline">New Volunteer Profile</span>
        </v-card-title>
        <v-card-text class="text-left">
          <v-text-field
            v-model="volunteerProfile.shortBio"
            label="Short Bio"
            data-cy="short-bioInput"
            :rules="[
              (value) => !!value || 'short-bio is required',
              (value) =>
                (value && value.length >= 10) ||
                'short-bio must be 10 characters long',
            ]"
            required
          />
        </v-card-text>
        <div>
          <h2>Selected Participations</h2>
          <div>
            <v-card class="table">
              <v-data-table
                :headers="headers"
                :items="participations"
                :search="search"
                show-select
                v-model="selected"
                item-key="id"
                disable-pagination
                :hide-default-footer="true"
                :mobile-breakpoint="0"
                data-cy="participationsTable"
              >
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
                <template v-slot:item.activityName="{ item }">
                  {{ activityName(item) }}
                </template>
                <template v-slot:item.institutionName="{ item }">
                  {{ institutionName(item) }}
                </template>
                <template v-slot:item.memberRating="{ item }">
                  {{ getMemberRating(item) }}
                </template>
                <template v-slot:item.memberReview="{ item }">
                  {{ item.memberReview }}
                </template>
                <template v-slot:item.acceptanceDate="{ item }">
                  {{ item.acceptanceDate }}
                </template>
              </v-data-table>
            </v-card>
          </div>
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            @click="$emit('close-dialog')"
            data-cy="cancelButton"
            >Close</v-btn
          >
          <v-btn
            v-if="canSave"
            color="blue darken-1"
            @click="submit"
            data-cy="saveButton"
            >Save</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'vue-property-decorator';
import VolunteerProfile from '@/models/profile/VoluteerProfile';
import RemoteServices from '@/services/RemoteServices';
import Participation from '@/models/participation/Participation';
import Activity from '@/models/activity/Activity';

@Component({})
export default class VolunteerProfileDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: Array, required: true }) readonly activities!: Activity[];
  volunteerProfile: VolunteerProfile = new VolunteerProfile();
  participations: Participation[] = [];
  search: string = '';
  selected: Participation[] = [];

  headers: object = [
    {
      text: 'Activity Name',
      value: 'activityName',
      align: 'left',
      width: '20%',
    },
    {
      text: 'Institution',
      value: 'institutionName',
      align: 'left',
      width: '20%',
    },
    {
      text: 'Rating',
      value: 'memberRating',
      align: 'left',
      width: '20%',
    },
    {
      text: 'Review',
      value: 'memberReview',
      align: 'left',
      width: '40%',
    },
    {
      text: 'Acceptance Date',
      value: 'acceptanceDate',
      align: 'left',
      width: '20%',
    },
  ];

  async created() {
    this.volunteerProfile = new VolunteerProfile();
    try {
      this.participations = await RemoteServices.getVolunteerParticipations();
      this.volunteerProfile.volunteer = this.$store.getters.volunteer;
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
  }

  async submit() {
    let volunteerProfile: VolunteerProfile;

    if (!(this.$refs.form as Vue & { validate: () => boolean }).validate())
      return;
    try {
      this.volunteerProfile.selectedParticipations = this.selected;

      volunteerProfile = await RemoteServices.createVolunteerProfile(
        this.volunteerProfile,
      );
      this.$emit('volunteerProfile-created', volunteerProfile);
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
  }

  activityName(participation: Participation) {
    return this.activities.find(
      (activity) => activity.id == participation.activityId,
    )?.name;
  }

  institutionName(participation: Participation) {
    let activity = this.activities.find(
      (activity) => activity.id == participation.activityId,
    );
    return activity?.institution.name;
  }

  getMemberRating(participation: Participation): string {
    if (!participation || participation.memberRating == null) {
      return '';
    }
    return this.convertToStars(participation.memberRating);
  }

  convertToStars(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(Math.floor(5 - rating));
    return `${fullStars}${emptyStars} ${rating}/5`;
  }

  get canSave(): boolean {
    return (
      !!this.volunteerProfile.shortBio &&
      this.volunteerProfile.shortBio.length >= 10
    );
  }
}
</script>
<style scoped lang="scss"></style>
