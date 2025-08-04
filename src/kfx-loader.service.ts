import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class KfxLoaderService {
  private sdkLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        reject('Not running in browser');
        return;
      }

      if (this.sdkLoaded) {
        resolve();
        return;
      }

      if ((window as any).KfxWebSDK) {
        this.sdkLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'assets/KfxWebSDK/Libs/KfxWebSDK.js';
      script.onload = () => {
        this.sdkLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject('Failed to load KfxWebSDK');
      };
      document.body.appendChild(script);
    });
  }

  getSDK(): any {
    return (window as any).KfxWebSDK;
  }
}