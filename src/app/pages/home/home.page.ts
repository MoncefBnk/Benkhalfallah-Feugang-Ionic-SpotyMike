import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonRouterLinkWithHref,
  IonRouterLink,
  IonText,
  IonItem,
  IonList,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonImg, 
  IonRow, 
  IonCol, 
  IonGrid, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonIcon,
  IonButtons,
  IonButton } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { arrowForward,search,arrowForwardOutline } from 'ionicons/icons';
import { BehaviorSubject, Observable } from 'rxjs';
import { IAlbum, IAlbumsWithDetails } from 'src/app/core/interfaces/album';
import { IArtist } from 'src/app/core/interfaces/artist';
import { LinkItem } from 'src/app/core/interfaces/item';
import { ISong, ISongWithDetails } from 'src/app/core/interfaces/song';
import { ILastPlayedWithDetails, IPlaylist, IUser } from 'src/app/core/interfaces/user';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { SeeAllComponent } from 'src/app/shared/header/see-all/see-all.component';
import { Horizontal1CardComponent } from 'src/app/shared/horizontal1-card/horizontal1-card.component';
import { SmallplayerComponent } from 'src/app/shared/smallplayer/smallplayer.component';
import { SwitchableButtonsComponent } from 'src/app/shared/switchable-buttons/switchable-buttons.component';
import { VerticalCardComponent } from 'src/app/shared/vertical-card/vertical-card.component';
import { ModalController } from '@ionic/angular';
import { MusicplayerComponent } from 'src/app/shared/musicplayer/musicplayer.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.state';
import { loadLastPlayed } from 'src/app/core/store/action/user.action';
import { selectLastPlayeds } from 'src/app/core/store/selector/user.selector';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    GeneralHeaderComponent,
    SwitchableButtonsComponent,
    VerticalCardComponent,
    SeeAllComponent,
    Horizontal1CardComponent,
    IonText,
    IonItem,
    IonList,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonImg,
    IonRow,
    IonCol,
    IonGrid,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonIcon,
    IonButtons,
    IonButton,
    IonRouterLink,
    TranslateModule,
    SmallplayerComponent,
    CommonModule
  ],

})
export class HomePage {
  constructor(private modalController: ModalController,private cdr: ChangeDetectorRef) {
    addIcons({ search,arrowForward,arrowForwardOutline });
  }

  private serviceFirestore = inject(FirestoreService);
  private localStore = inject(LocalStorageService);
  store = inject(Store<AppState>);
  start_icon : string = "search";
  end_icon : string = "search";
  initial : string =  "";

  musiccateg : string[] = ["All","R&B","Pop","Rock"];
  songs : ISongWithDetails[]=[];

  lastPlayeds$: Observable<ILastPlayedWithDetails[]>  = new Observable<ILastPlayedWithDetails[]>();
  albums : IAlbumsWithDetails[] = [];
  artists : IArtist[] =[];
  playlists : IPlaylist[] =[];
  latestAlbum = {} as IAlbum;
  user = {} as IUser;

  smallPlayerVisible = false;

  ngOnInit() {

    this.getUser();
    this.store.dispatch(loadLastPlayed({userId: this.user.id}));
    this.lastPlayeds$ = this.store.select(selectLastPlayeds);
    this.serviceFirestore.getTopSongsWithDetails(5).then(songs => {
      this.songs = songs;
    });
    this.serviceFirestore.getTopAlbums(5).then(albums => {
      if(albums)
        this.albums = albums;
    });
   
    this.serviceFirestore.getTopArtists(5).then(artists => {
      if(artists)
        this.artists = artists;
    });
    this.serviceFirestore.getTopPlaylist(this.user.id,5).then(playlists => {
      if(playlists)
        this.playlists = playlists;
    });
    this.serviceFirestore.getLatestAlbum().then(latest => {
      if(latest)
        this.latestAlbum = latest;
    });
  
    this.initial = this.getInitials();
  }

  ngAfterViewInit(): void {
    this.lastPlayeds$.subscribe((lastPlayeds) => {
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

  async playMusic(song:ISongWithDetails) {
    await this.serviceFirestore.updateLastPlayed(this.user.id,song.id);
    console.log('music');
    const modal = await this.modalController.create({
      component: MusicplayerComponent,
      componentProps: {
        song: song
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.minimized) {
        this.smallPlayerVisible = true;
      }
    });
    this.cdr.detectChanges();
    return await modal.present();
  }

}
