import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonImg,
  IonRange, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { GeneralHeaderComponent } from 'src/app/shared/header/general-header/general-header.component';
import { addIcons } from 'ionicons';
import {
  ellipsisHorizontal,
  expand,
  heart,
  heartOutline,
  pauseCircle,
  playCircle,
  playSkipBackOutline,
  playSkipForwardOutline,
  repeat,
  shareOutline,
  shareSocialOutline,
  shuffle,
} from 'ionicons/icons';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCard,
    IonRange,
    IonImg,
    IonIcon,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    GeneralHeaderComponent,
  ],
})
export class PlayerPage implements OnInit {
  @ViewChild('audioPlayer', { static: false }) audioPlayer: any;
  audio!: HTMLAudioElement;
  isFavorite: boolean = false;
  isPlaying: boolean = true;
  currentTime: string = '0:00';
  duration: string = '0:00';
  progress: number = 0;
  lyrics: string[] = [
    "...la-la-la-la-la-la-la, la, la La-la-la-la-la-la-la-la la la-la",
    "Now that I've lost everything to you You say you wanna start something new And it's breakin' my heart you're leavin' Baby, I'm grievin' But if you wanna leave, take good care Hope you have a lot of nice things to wear But then a lot of nice things turn bad out there",
    "Oh, baby, baby, it's a wild world It's hard to get by just upon a smile Oh, baby, baby, it's a wild world I'll always remember you like a child, girl ",
    "You know I've seen a lot of what the world can do And it's breakin' my heart in two Because I never wanna see you sad, girl Don't be a bad girl But if you wanna leave, take good care Hope you make a lot of nice friends out there But just remember there's a lot of bad and beware",
    "Oh, baby, baby, it's a wild world And it's hard to get by just upon a smile Oh, baby, baby, it's a wild world And I'll always remember you like a child, girl",
    " ...la-la-la-la-la-la-la, la, la La-la-la-la-la-la-la-la la la-la, la Baby, I love you But if you wanna leave, take good care Hope you make a lot of nice friends out there But just remember there's a lot of bad and beware Beware",
    "Oh, baby, baby, it's a wild world It's hard to get by just upon a smile Oh, baby, baby, it's a wild world And I'll always remember you like a child, girl Oh, baby, baby, it's a wild world And it's hard to get by just upon a smile Oh, baby, baby, it's a wild world And I'll always remember you like a child, girl",
  ];
  currentLyric: string = 'No Lyrics Found';
  start_icon: string = 'search';
  end_icon: string = 'search';
  image: string = 'assets/icon/logo_mini.png';

  constructor() {
    addIcons({
      repeat,
      shareOutline,
      heartOutline,
      shareSocialOutline,
      heart,
      playSkipBackOutline,
      playCircle,
      pauseCircle,
      playSkipForwardOutline,
      shuffle,
      ellipsisHorizontal,
      expand,
    });
  }

  ngOnInit() {
    this.audio = new Audio('assets/songs/Wild_World.mp3');
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.formatTime(this.audio.duration);
    });
  }

  playMusic() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  updateProgress() {
    this.progress = (this.audio.currentTime / this.audio.duration) * 100;
    this.currentTime = this.formatTime(this.audio.currentTime);
    this.currentLyric = this.getLyric(this.progress);
  }

  onIonChange(event: any) {
    const value = event.detail.value;
    const seekTime = (value / 100) * this.audio.duration;
    this.audio.currentTime = seekTime;
  }

  makeFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  getLyric(progress: number): string {
    const lyricIndex = Math.floor((progress / 100) * this.lyrics.length);
    return this.lyrics[lyricIndex] || 'No Lyrics Found';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
