import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'video-editor-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const VideoEditorReactNative = NativeModules.VideoEditorReactNative
  ? NativeModules.VideoEditorReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function openVideoEditorFromCamera(licenseToken): Promise {
  const inputParams = { "screen": "camera" };
  return VideoEditorReactNative.openVideoEditor(licenseToken, inputParams);
}

export function openVideoEditorFromPip(licenseToken, pipVideo): Promise {
  const inputParams = { "screen": "pip", "videoSources": [pipVideo] };
  return VideoEditorReactNative.openVideoEditor(licenseToken, inputParams);
}

export function openVideoEditorFromTrimmer(licenseToken, videoSourcesArray): Promise {
  const inputParams = { "screen": "trimmer", "videoSources": videoSourcesArray };
  return VideoEditorReactNative.openVideoEditor(licenseToken, inputParams);
}

export default class VideoEditor {
   openFromCamera(licenseToken) : Promise {
    const inputParams = {
      "screen" : "camera"
    };
    return VideoEditorReactNative.openVideoEditor(licenseToken, inputParams);
  }

  openFromPip(licenseToken, pipVideo): Promise {
    const inputParams = {
        "screen": "pip",
       "videoSources": [pipVideo]
     };
    return VideoEditorReactNative.openVideoEditor(licenseToken, inputParams);
  }

  openFromTrimmer(licenseToken, videoSourcesArray): Promise {
    const inputParams = {
      "screen": "trimmer",
      "videoSources": videoSourcesArray
     };
    return VideoEditorReactNative.openVideoEditor(licenseToken, inputParams);
  }
}
