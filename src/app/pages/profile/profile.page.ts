import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText,IonGrid,IonRow,IonCol } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { BehaviorSubject } from 'rxjs';
import { IPlaylist, IUser } from 'src/app/core/interfaces/user';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { LinkItem } from 'src/app/core/interfaces/item';
import { SeeAllComponent } from 'src/app/shared/header/see-all/see-all.component';
import { Horizontal1CardComponent } from 'src/app/shared/horizontal1-card/horizontal1-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonText,IonGrid,IonRow,IonCol, CommonModule, FormsModule,GeneralHeaderComponent,SeeAllComponent,Horizontal1CardComponent,TranslateModule]
})
export class ProfilePage implements OnInit {
  private localStore = inject(LocalStorageService);
  private firebaseservice = inject(FirestoreService);
  title : string = "Profile"
  end_icon : string = "settings";
  endLink : string = "/setting";
  user = {} as IUser;
  playlists : IPlaylist[] = [];
  
  constructor() { }

  ngOnInit() {
    this.getUser();
    this.firebaseservice.getTopPlaylist(this.user.id,5).then(playlists => {
      if(playlists)
        this.playlists = playlists;
    });
  }

  getUser() {
    const userSubject: BehaviorSubject<IUser>= this.localStore.getItem<IUser>('user');
    const userdata = userSubject.getValue();
    if(userdata) {
      this.user = userdata;
    }
  }

  getInitials() {
    return this.user.firstname[0].toUpperCase() + this.user.lastname[0].toUpperCase();
  }

}
