export interface UserData {
    uid?: string;
    homeAddress?: string;
    isEdited?: boolean;
    location?: string;
    name?: string;
    photoURL?: string;
    phoneNumber?: string;
    email?: string;
}
export class StreamActivity {
    id?: string;
    actor: string;
    verb: string;
    object: string;
    target?: string;
    time?: string;
    to?: string[];
    foreign_id?: string;
    uid: string;
    photoURL: string;
    likes: number;
}

export class Upload {

    $key: string;
    file: File;
    name: string;
    url: string;
    progress: number;
    createdAt: Date = new Date();

    constructor(file: File) {
      this.file = file;
    }
  }

  export class Activity {
      id?: string;
      uid: string;
      actor: string;
      verb?: string;
      object: string;
      likes: number;
      time: string;
      photoURL: string;
      isLink?: boolean;
      linkContent?: {
          title: string;
          url: string;
          image: string;
          description: string;
      };
      isImage?: boolean;
      imageLink?: string;
      isYoutubeLink?: boolean;
      youtubeLink?: string;
  }
