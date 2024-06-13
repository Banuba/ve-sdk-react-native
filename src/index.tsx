import { NativeModules, Platform } from 'react-native';

 const LINKING_ERROR =
  `The package 'video-editor-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

 const VideoEditorModule = NativeModules.VideoEditorModule
  ? NativeModules.VideoEditorModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export default class VideoEditorPlugin {
   openFromCamera(licenseToken) : Promise {
    const inputParams = {
      "screen" : "camera"
    };
    return VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }

  openFromPip(licenseToken, pipVideo): Promise {
    const inputParams = {
        "screen": "pip",
       "videoSources": [pipVideo]
     };
    return VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }

  openFromTrimmer(licenseToken, videoSourcesArray): Promise {
    const inputParams = {
      "screen": "trimmer",
      "videoSources": videoSourcesArray
     };
    return VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }
}
