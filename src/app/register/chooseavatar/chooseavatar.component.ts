import { Component, EventEmitter, Output, inject } from '@angular/core';

// import costumer components
import { OverlayaccountcreatedComponent } from './overlayaccountcreated/overlayaccountcreated.component';

// import classes
import { User } from '../../shared/models/user.class';

// import services
import { StorageService } from '../../services/storage.service';
import { RegisterService } from '../../services/register.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chooseavatar',
  standalone: true,
  imports: [OverlayaccountcreatedComponent],
  templateUrl: './chooseavatar.component.html',
  styleUrl: './chooseavatar.component.scss',
})
export class ChooseavatarComponent {
  user: User = new User();
  toggleOverlay: boolean = false;
  @Output() isShowen = new EventEmitter();

  storageService = inject(StorageService);
  userService = inject(UserService);

  customImage: File | undefined;
  customImgPath: string | undefined;

  avatarImgPathList: string[] = [
    'assets/img/avatar/avatar0.svg',
    'assets/img/avatar/avatar1.svg',
    'assets/img/avatar/avatar2.svg',
    'assets/img/avatar/avatar3.svg',
    'assets/img/avatar/avatar4.svg',
    'assets/img/avatar/avatar5.svg',
  ];

  subscription;

  constructor(private registerService: RegisterService) {
    this.subscription = this.registerService.userToCreate$.subscribe(
      (userData) => {
        this.user = userData;
      }
    );
    this.registerService.userToCreate$.next(this.user);
  }

  changeAvatarImg(imgPath: string) {
    this.user.imgPath = imgPath;
    this.registerService.userToCreate$.next(this.user);
  }

  async createAccount() {
    if (this.user.password) {
      await this.registerService.createAcc(this.user.email, this.user.password);
      this.toggleOverlay = !this.toggleOverlay;
      await this.uploadUserImage(this.registerService.userToCreate$.value.id);
      this.deleteUserData();
      this.goBack();
    }
  }

  goBack() {
    this.isShowen.emit(false);
  }

  deleteUserData() {
    this.user = new User();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
  unsubscribe() {
    this.subscription.unsubscribe();
  }

  onFileSelected(event: Event) {
    const fileList: FileList | null = (event.target as HTMLInputElement).files;
    if (fileList && fileList[0].type.includes('image')) {
      this.customImage = fileList[0];
      this.customImgPath = URL.createObjectURL(this.customImage);
      let fileName ='customProfileIMG.' + this.customImage.name.split('.').slice(-1);
      this.changeAvatarImg(fileName);
    }
  }

  async uploadUserImage(userID: string) {
    if (this.customImage){
      this.user.id = userID;
      await this.storageService.uploadProfileIMG(userID, this.customImage);
      let storageRef = this.storageService.getUserRef(userID);
      let fileName ='customProfileIMG.' + this.customImage.name.split('.').slice(-1);
      let path = await this.storageService.getFileURL(storageRef,fileName);
      if(path){
        this.user.imgPath = path;
        this.userService.saveUser(this.user);
      }
    }
  }

  clearCustomImg() {
    this.customImage = undefined;
    this.customImgPath = undefined;
  }
}
