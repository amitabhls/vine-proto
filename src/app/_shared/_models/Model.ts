export interface UserData {
    uid: string;
    displayName?: string;
    photoURL?: string;
    providerId?: string;
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
