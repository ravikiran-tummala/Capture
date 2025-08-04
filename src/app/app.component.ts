import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { KfxLoaderService } from '../kfx-loader.service';

// Add type declarations for KfxWebSDK
declare global {
  interface Window {
    KfxWebSDK: any;
  }
}

declare var KfxWebSDK: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit{
  title = 'my-app';
  options = {
    containerId: 'previewContainer',
    preference: "camera",
    preview: false,
    useVideoStream: true,

    useTargetFrameCrop: true,
    captureGuidance: true,
    showCapturePreview: false,
    useFrontCamera: false,
    enableAutoCapture: true,
    showEdges: false,
    edgesColor: '#FFFF00',
    edgesWidth: 4,
    guidanceSize: 150,

    frameAspectRatio: 0.628,
    framePadding: 2,
    frameCornerColor: "#00FF00",
    frameCornerHeight: 2,
    frameCornerWidth: 7,
    frameBorderColor: "#00FF00",
    frameBorderWidth: 2,
    outOfFrameTransparency: 0.5,

    lookAndFeel: {
      showEdgesDuringCapture: true,
      targetFrameVisible: true,
      targetFrameSuccessColor: "#00FF00",
      targetFrameErrorColor: "#FF0000",
      showTapToDismissMessage: true,
      forceCapture: 10,
      gallery: false,
      alwaysShowFrame: true
    },

  

    criteria: {
      captureTimeout: 1700,
      centerToleranceFraction: 0.15,
      longAxisThreshold: 85,
      shortAxisThreshold: 60,
      maxFillFraction: 1.8,
      minFillFraction: 0.65,
      turnSkewAngleTolerance: 10,
      pitchThreshold: 15,
      rollThreshold: 15
    },

    tapToDismissInstruction: { visible: true, text: "Tap to dismiss" },
    fitDocumentInstruction: { visible: true, text: "Fit document in the frame" },
    zoomInInstruction: { visible: true, text: "Move closer" },
    zoomOutInstruction: { visible: true, text: "Move back" },
    centerDocumentInstruction: { visible: true, text: "Center the document" },
    rotateDeviceInstruction: { visible: true, text: "Rotate device" },
    holdDeviceLevelInstruction: { visible: true, text: "Hold device level" },
    holdSteadyInstruction: { visible: true, text: "Hold steady" },
    doneInstruction: { visible: true, text: "Done" },
    motionPermissionInstruction: { visible: false },
    capturePauseInstruction: { visible: true, text: "Capture is paused. Tap to continue." }
  };


waitForSDK(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      const KfxWebSDK = (window as any).KfxWebSDK;
      if (KfxWebSDK && KfxWebSDK.Capture) {
        console.log('KfxWebSDK loaded');
        resolve();
      } else {
        console.warn('Waiting for KfxWebSDK...');
        setTimeout(check, 100); // Retry every 100ms
      }
    };
    check();
  });
}


  getSDK(): any {
    return (window as any).KfxWebSDK;
  }

  constructor(){
  }



  ngOnInit(): void {
    if(typeof KfxWebSDK !== 'undefined'){
      console.log('KfxWebSDK  found!!!!!!!!!!!!!!!!!');
    }
    else{
      console.error('KfxWebSDK func not found!');
    }
  }


  capturedImage: string | null = null;




  captureFeature(): void {
    console.log('Capture button clicked');

    KfxWebSDK.Utilities.supportsAutoCapture(
      () => {
        console.log('AutoCapture supported');

        KfxWebSDK.Capture.create(
          this.options,
          () => {
            console.log('KfxWebSDK create successful');

            // Remove any SDK fallback <input>
            document.querySelectorAll('input[type="file"]').forEach(el => el.remove());

            KfxWebSDK.Capture.takePicture(
              (imageData: any) => {
                const canvas = document.createElement('canvas');
                canvas.width = imageData.width;
                canvas.height = imageData.height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                  console.error('Could not get 2D context');
                  return;
                }

                const imgData = new ImageData(imageData.data, imageData.width, imageData.height);
                ctx.putImageData(imgData, 0, 0);

                const imageContainer = document.getElementById('capturedImageContainer');
                if (imageContainer) {
                  imageContainer.innerHTML = '';
                  imageContainer.appendChild(canvas);
                }

                const base64Image = canvas.toDataURL('image/png');
                console.log('Base64:', base64Image);
              },
              (error: any) => {
                console.error('TakePicture Error', error);
              }
            );
          },
          (error: any) => {
            console.error('Create Error', error);
          }
        );
      },
      () => {
        alert('Your device or browser does not support Kofax camera capture.');
      },
      KfxWebSDK.resolution.RES_FULL_HD
    );
  }






  
}
