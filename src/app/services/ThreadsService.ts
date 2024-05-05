import { Injectable, inject, signal } from '@angular/core';
import { FirebaseInitService } from './firebase-init.service';
import { UserService } from './user.service';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { ChannelService } from './channel.service';
import { MessageService } from './message.service';
import { Message } from '../shared/models/message.class';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../shared/models/user.class';
import { Reaction } from '../shared/models/reaction.class';

@Injectable({
  providedIn: 'root',
})
export class ThreadsService {
  channelService = inject(ChannelService);
  messagesService = inject(MessageService);

  currentChannel: string = ''
  activeUser!: User;
  idOfThisThreads!: string;
  unsubUser!: Subscription;
  unsubMessage!: Subscription;
  isShowingSig = signal(false);
  messages: Message[] = [];
  threadMessages$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  threadAmount: [{}] = [{}]
  activeChannel: string = ''


  constructor(
    private firebaseInitService: FirebaseInitService,
    private userService: UserService
  ) {
    this.unsubUser = this.userService.activeUser$.subscribe((user) => {
      this.activeUser = user;
    });
  }

  async getThread(messageId: string) {

    this.currentChannel = messageId
    let firstMessage: Message = new Message();
    this.idOfThisThreads = messageId;
    this.unsubMessage = this.messagesService.messages$.subscribe((messages) => {
      firstMessage = messages.filter((message) => message.id == messageId)[0];
    });
    await onSnapshot(
      collection(this.getThreadColRef(messageId), 'threads'),
      (messages) => {
        this.messages = [];

        this.messages.push(firstMessage);
        messages.forEach((message) => {
          let msg = new Message(
            this.getCleanMessageObj(message.data()),
            message.id
          );
          this.messages.push(msg);
        });
        this.messages = this.messagesService.sortMessagesChronologically(
          this.messages
        );
        this.threadMessages$.next(this.messages);
      }
    );
  }

  getChannelColRef() {
    return collection(this.firebaseInitService.getDatabase(), 'Channels');
  }

  getChannelDocRef() {
    return doc(
      this.getChannelColRef(),
      this.channelService.activeChannel$.value.id
    );
  }

  getChannelMessagesColRef() {
    return collection(this.getChannelDocRef(), 'messages');
  }

  getThreadColRef(messageID: string) {
    return doc(this.getChannelMessagesColRef(), messageID);
  }

  getThreadMsgRef(messageID: string, threadMsgID: string) {
    return doc(
      collection(this.getThreadColRef(messageID), 'threads'),
      threadMsgID
    );
  }

  async updateThreadMessage(threadMsgID: string, message: Message) {
    await updateDoc(
      this.getThreadMsgRef(this.idOfThisThreads, threadMsgID),
      message.getCleanBEJSON()
    );
  }

  async deleteThreadMessage(threadMsgID: string) {
    await deleteDoc(this.getThreadMsgRef(this.idOfThisThreads, threadMsgID));
  }

  async saveThread(message: Message) {
    await setDoc(
      doc(collection(this.getThreadColRef(this.idOfThisThreads), 'threads')),
      message.getCleanBEJSON()
    );
    this.getMessagesOfChannel(this.activeChannel)
  }

  ngOnDestroy(): void {
    this.unsubUser.unsubscribe();
    this.unsubMessage.unsubscribe();
  }

  getCleanMessageObj(obj: any) {
    return {
      creator: this.userService.getUser(obj.creatorId),
      date: obj.date,
      content: obj.content,
      answers: obj.answers,
      reactions: this.getCleanReactionArray(obj.reaction),
      files: obj.files,
    };
  }

  getCleanReactionArray(obj: any) {
    let reactions: Reaction[] = [];
    obj.forEach((reactionBEObject: any) => {
      let users: User[] = this.userService.getFilterdUserList(
        reactionBEObject.users
      );
      reactions.push(new Reaction({ emoji: reactionBEObject['emoji'], users }));
    });
    return reactions;
  }

  async getMessagesOfChannel(docId: string) {
    this.threadAmount = [{}]
    let messages: Message[] = []
     onSnapshot(
      this.messagesService.getMessageRef('Channels', docId),
      (msgList) => {
        msgList.forEach((msg) => {
          let message = new Message(msg.data(), msg.id);
          messages.push(message)
        });
        messages = this.messagesService.sortMessagesChronologically(messages)
        messages.forEach((msg) => {
            this.getNumberOfThreads(docId, msg.id)
        })
      }
    );
  }

  async getNumberOfThreads(channelId: string, msgId:string) {
    onSnapshot(collection((this.messagesService.getSingleMessageRef('Channels', channelId, msgId)), 'threads'), (threads) => {
      let amount: number = 0
      let time;
      threads.forEach((thread) => {amount++;  
          time = this.getTimeOfThread(thread.id, msgId)
      })
   this.threadAmount.push({amount:amount, time:time})
   console.log(this.threadAmount)

  })
  this.threadAmount.splice(0)
  this.channelService.numberOfThreads$.next(this.threadAmount)
  }


  async getTimeOfThread(threadId: string, msgId:string) {
    onSnapshot(this.getThreadMsgRef(msgId, threadId), (thread) => {
    if (thread.exists()) {
      let allThreads: number[] = [];
        allThreads.push(thread.data()['date'])
        return allThreads[-1]
    } else {
      return null
    }
  });
}

}
