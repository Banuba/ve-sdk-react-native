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

export function multiply(): Promise<String> {
  return VideoEditorReactNative.multiply();
}
