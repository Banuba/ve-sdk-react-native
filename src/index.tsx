import { NativeModules, Platform } from 'react-native';
import type { FeaturesConfig } from './FeaturesConfig';
import type { ExportData } from './ExportData';

export * from './FeaturesConfig';
export * from './ExportData';

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
    featuresConfig: FeaturesConfig,
    exportData?: ExportData | null
  ): Promise<Map<String, String>> {
    const inputParams = {
      screen: 'camera',
      featuresConfig: JSON.stringify(featuresConfig),
      exportData: JSON.stringify(exportData),
    };
    return Platform.OS === 'ios'
      ? NativeModules.VideoEditorReactNative.openVideoEditor(licenseToken, inputParams)
      : VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }

  openFromPip(
    licenseToken: String,
    featuresConfig: FeaturesConfig,
    pipVideo: String,
    exportData?: ExportData | null
  ): Promise<Map<String, String>> {
    const inputParams = {
      screen: 'pip',
      featuresConfig: JSON.stringify(featuresConfig),
      videoSources: [pipVideo],
      exportData: JSON.stringify(exportData),
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
    videoSourcesArray: Array<String>,
    exportData?: ExportData | null
  ): Promise<Map<String, String>> {
    if (featuresConfig.enableEditorV2 === true) {
      console.log('Editor V2 is not available from Trimmer screen');
    }
    const inputParams = {
      screen: 'trimmer',
      featuresConfig: JSON.stringify(featuresConfig),
      exportData: JSON.stringify(exportData),
      videoSources: videoSourcesArray,
    };
    return Platform.OS === 'ios'
      ? NativeModules.VideoEditorReactNative.openVideoEditor(
          licenseToken,
          inputParams
        )
      : VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }

  openFromAiClipping(
    licenseToken: String,
    featuresConfig: FeaturesConfig,
    exportData?: ExportData | null
  ): Promise<Map<String, String>> {
    const inputParams = {
      screen: 'aiClipping',
      featuresConfig: JSON.stringify(featuresConfig),
      exportData: JSON.stringify(exportData),
    };
    return Platform.OS === 'ios'
      ? NativeModules.VideoEditorReactNative.openVideoEditor(licenseToken, inputParams)
      : VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }

  openFromTemplates(
    licenseToken: String,
    featuresConfig: FeaturesConfig,
    exportData?: ExportData | null
  ): Promise<Map<String, String>> {
    const inputParams = {
      screen: 'templates',
      featuresConfig: JSON.stringify(featuresConfig),
      exportData: JSON.stringify(exportData),
    };
    return Platform.OS === 'ios'
      ? NativeModules.VideoEditorReactNative.openVideoEditor(
          licenseToken,
          inputParams
        )
      : VideoEditorModule.openVideoEditor(licenseToken, inputParams);
  }
}
