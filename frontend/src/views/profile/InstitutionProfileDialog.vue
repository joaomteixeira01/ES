<template>
  <v-dialog v-model="dialog" persistent width="1300">
    <v-card>
      <v-card-title>
        <span class="headline">
          New Institution Profile
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="*Short description"
                :rules="[(v) => !!v || 'Short Description is required']"
                required
                v-model="institutionProfile.shortDescription"
                data-cy="shortDescriptionInput"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card class="table">
        <v-data-table
          v-model="institutionProfile.selectedAssessments"
          :headers="headers"
          :items="institutionAssessments"
          :search="search"
          disable-pagination
          show-select
          :hide-default-footer="true"
          :mobile-breakpoint="0"
          data-cy="institutionAssessmentsTableSelect"
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

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="$emit('close-institution-profile-dialog')"
        >
          Close
        </v-btn>
        <v-btn
          v-if="institutionProfile.shortDescription"
          color="blue-darken-1"
          variant="text"
          @click="createInstitutionProfile"
          data-cy="saveInstitutionProfile"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator';
import InstitutionProfile from '@/models/profile/InstitutionProfile';
import RemoteServices from '@/services/RemoteServices';
import { ISOtoString } from '@/services/ConvertDateService';
import Assessment from '@/models/assessment/Assessment';

@Component({
  methods: { ISOtoString },
})
export default class InstitutionProfileDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: Number, required: true }) readonly institutionId!: number;

  institutionProfile: InstitutionProfile = new InstitutionProfile();
  institutionAssessments: Assessment[] = [];

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
    this.institutionAssessments = await RemoteServices.getInstitutionAssessments(this.institutionId);
  }

  async createInstitutionProfile() {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      try {
        const result = await RemoteServices.createInstitutionProfile(this.institutionProfile)
        this.$emit('save-institution-profile', result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }  
}
</script>

<style scoped lang="scss"></style>
