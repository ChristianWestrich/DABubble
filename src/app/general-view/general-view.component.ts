import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// import services
import { UserService } from '../services/user.service';
import { OverlaycontrolService } from '../services/overlaycontrol.service';
import { ChannelService } from '../services/channel.service';
import { MessageService } from '../services/message.service';


// import customer components
import { OverlayComponent } from './overlay/overlay.component';
import { LeftSideComponent } from './left-side/left-side.component';
import { NewMessageComponent } from './messages/new-message/new-message.component';
import { DirectMessageComponent } from './messages/direct-message/direct-message.component';
import { ChannelMessageComponent } from './messages/channel-message/channel-message.component';
import { ThreadComponent } from './thread/thread.component';

// import classes
import { User } from '../shared/models/user.class';


@Component({
  selector: 'app-general-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverlayComponent,
    LeftSideComponent,
    NewMessageComponent,
    DirectMessageComponent,
    ChannelMessageComponent,
    ThreadComponent
  ],
  templateUrl: './general-view.component.html',
  styleUrl: './general-view.component.scss',
})
export class GeneralViewComponent {

    currentMessageComponent: "channel-message" | "direct-message" | "new-message" = "channel-message";


  constructor(private userService: UserService) {
    this.unsubscribe = this.userService.user.subscribe(
      (user) => (this.activeUser = user)
    );
  }

  toggleMessageComponent(nextComponent: "channel-message" | "direct-message" | "new-message") {
    this.currentMessageComponent = nextComponent;
     switch (this.currentMessageComponent) {
      case 'channel-message':
        this.currentMessageComponent = 'direct-message';
        break;
      case 'direct-message':
        this.currentMessageComponent = 'new-message';
        break;
      case 'new-message':
        this.currentMessageComponent = 'channel-message';
        break;
      default:
        this.currentMessageComponent = 'channel-message';
        break;
    }
  }

  activeUser!: User;
  search!: string;
  private unsubscribe!: Subscription;

  overlayCtrlService = inject(OverlaycontrolService);
  channelService = inject(ChannelService);
 

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }
}
