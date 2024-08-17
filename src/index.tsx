import { NativeModules, Platform } from 'react-native';
import type { FeaturesConfig } from './FeaturesConfig';

export * from './FeaturesConfig';

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
  openFromCamera(
    licenseToken: String,
    featuresConfig: FeaturesConfig
  ): Promise<Map<String, String>> {
    const inputParams = {
      screen: 'camera',
      featuresConfig: JSON.stringify(featuresConfig),
    };
    return Platform.OS === 'ios'
      ? NativeModules.VideoEditorReactNative.openVideoEditor(licenseToken, inputParams)
      : VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }

  openFromPip(
    licenseToken: String,
    featuresConfig: FeaturesConfig,
    pipVideo: String
  ): Promise<Map<String, String>> {
    const inputParams = {
      screen: 'pip',
      featuresConfig: JSON.stringify(featuresConfig),
      videoSources: [pipVideo],
    };
    return Platform.OS === 'ios'
      ? NativeModules.VideoEditorReactNative.openVideoEditor(
          licenseToken,
          inputParams
        )
      : VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }

  openFromTrimmer(
    licenseToken: String,
    featuresConfig: FeaturesConfig,
    videoSourcesArray: Array<String>
  ): Promise<Map<String, String>> {
    const inputParams = {
      screen: 'trimmer',
      featuresConfig: JSON.stringify(featuresConfig),
      videoSources: videoSourcesArray,
    };
    return Platform.OS === 'ios'
      ? NativeModules.VideoEditorReactNative.openVideoEditor(
          licenseToken,
          inputParams
        )
      : VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }
}
