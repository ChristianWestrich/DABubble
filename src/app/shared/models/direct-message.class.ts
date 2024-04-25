// import classes
import { Message } from './message.class';
import { User } from './user.class';

export class DirektMessage {
  users: User[];
  id: string;
  messages: Message[];

  constructor(users: User[], id: string, messages: Message[]){
    this.users = users || [];
    this.id = id || '';
    this.messages = messages || [];
    this.sortMessagesChronologically();
  }

  sortMessagesChronologically(){
    this.messages.sort((a,b) => a.date.getTime() - b.date.getTime());
  }
}