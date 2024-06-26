import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';

import { register } from 'swiper/element/bundle';
import { SmallplayerComponent } from './shared/smallplayer/smallplayer.component';
import { MusicService } from './core/services/music.service';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet,SmallplayerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);

  displayplayer: boolean = false;
  

  constructor(private router: Router,private musicService: MusicService,private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.translate.use('en_US');
    this.translate.setDefaultLang('en_US');

   /* this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        if(event.url.startsWith('/player') || event.url ==='/auth/login' || event.url ==='/auth/register') {
          this.displayplayer = false;
        } else {
          this.displayplayer = true;
        }
      }
    });*/

    this.musicService.isPlaying().subscribe(isPlaying => {
      this.displayplayer = isPlaying;
      //this.currentTrack = this.musicService.getCurrentTrack();
      this.cdr.detectChanges();
    })
    /*const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['login']);
    }*/
  }
}
