import { ISOtoString } from '@/services/ConvertDateService';

export default class ActivitySuggestion {
    id: number | null = null;
    name!: string;
    description!: string;
    region!: string;
    creationDate!: string;
    applicationDeadline!: string;
    formattedApplicationDeadline!: string;
    startingDate!: string;
    formattedStartingDate!: string;
    endingDate!: string;
    formattedEndingDate!: string;
    participantsNumberLimit: number | null = null;
    state!: string;
    institutionId: number | null = null;
    volunteerId: number | null = null;

    constructor(jsonObj?: ActivitySuggestion) {
      if (jsonObj) {
        this.id = jsonObj.id;
        this.name = jsonObj.name;
        this.description = jsonObj.description;
        this.region = jsonObj.region;
        this.creationDate = ISOtoString(jsonObj.creationDate);

        this.startingDate = jsonObj.startingDate;
        if (jsonObj.startingDate)
          this.formattedStartingDate = ISOtoString(jsonObj.startingDate);

        this.endingDate = jsonObj.endingDate;
        if (jsonObj.endingDate)
          this.formattedEndingDate = ISOtoString(jsonObj.endingDate);

        this.applicationDeadline = jsonObj.applicationDeadline;
        if (jsonObj.applicationDeadline)
          this.formattedApplicationDeadline = ISOtoString(jsonObj.applicationDeadline,);

        this.participantsNumberLimit = jsonObj.participantsNumberLimit;
        this.state = jsonObj.state;

        this.institutionId = jsonObj.institutionId;
        this.volunteerId = jsonObj.volunteerId;
      }
    }

}