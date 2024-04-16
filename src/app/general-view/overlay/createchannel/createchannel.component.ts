import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

// import customer component
import { UserlistitemComponent } from '../../../shared/components/userlistitem/userlistitem.component';

// import classes
import { Channel } from '../../../shared/models/channel.class';

// import interfaces
import { User } from '../../../shared/interfaces/interfaces';

// import services
import { OverlaycontrolService } from '../../../services/overlaycontrol.service';
import { ChannelService } from '../../../services/channel.service';

@Component({
  selector: 'app-createchannel',
  standalone: true,
  imports: [FormsModule,UserlistitemComponent],
  templateUrl: './createchannel.component.html',
  styleUrl: './createchannel.component.scss'
})
export class CreatechannelComponent {
  channel: Channel = new Channel('','','');

  formState: 'channelName' | 'addMember' = 'channelName';
  memberSelection: 'all' | 'select' = 'all';

  overlayCtrlService = inject(OverlaycontrolService);
  channelService = inject(ChannelService);

  users: User[] = [
    {
      id: 'dummyID0',
      name: 'User0',
      avatarImgPath: 'assets/img/avatar/avatar0.svg',
      email: 'user0@DABubble.com',
      status: 'Aktiv',
      password: ''
    }, 
    {
      id: 'dummyID1',
      name: 'User1',
      avatarImgPath: 'assets/img/avatar/avatar2.svg',
      email: 'user1@DABubble.com',
      status: 'Abwesend',
      password: ''
    },
    {
      id: 'dummyID2',
      name: 'User2',
      avatarImgPath: 'assets/img/avatar/avatar3.svg',
      email: 'user2@DABubble.com',
      status: 'Aktiv',
      password: ''
    },
    {
      id: 'dummyID3',
      name: 'User3',
      avatarImgPath: 'assets/img/avatar/avatar4.svg',
      email: 'user3@DABubble.com',
      status: 'Abwesend',
      password: ''
    },
    {
      id: 'dummyID4',
      name: 'User4',
      avatarImgPath: 'assets/img/avatar/avatar5.svg',
      email: 'user4@DABubble.com',
      status: 'Aktiv',
      password: ''
    }
  ];

  filteredUser: User[] = this.users;

  onSubmitName(form:NgForm){
    if (form.valid) {
      this.formState = 'addMember';
    }
  }

  onSubmit(form:NgForm){

  }

  removeUser(idx:number){
    this.channel.members.splice(idx,1)
  }

  addUser(idx:number){
    if (!this.channel.members.find(user => user == this.filteredUser[idx])){
      this.channel.members.push(this.filteredUser[idx]);
    }
  }

  getUserData(userID: string): User{
    let user: User = {} as User;
    let idx = this.users.findIndex(user => user.id == userID);
    if(idx >= 0) user = this.users[idx];
    return user;
  }

  filterUsers(prompt:string){
    this.filteredUser = this.users.filter(user => user.name.toLowerCase().includes(prompt.toLowerCase()))
  }

  createChannel(){
    this.overlayCtrlService.hideOverlay();
    console.log('channel created event - save data not implemented');
  }
}
