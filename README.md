# Banuba Video Editor React Native plugin

## Overview
Build apps like TikTok and Videoshop faster with the Banuba [Video Editor SDK](https://www.banuba.com/video-editor-sdk-api-social-media-app) for React Native.

With an extensive feature set, simple integration process, and user-friendly interface, it is a comprehensive toolkit that will bring your app to the level of industry giants. Its flexibility allows you to only pick the features that you need, optimizing the app’s download size and license costs.

Banuba Video Editor React Native plugin offers [certain features that few competitors do](https://www.banuba.com/blog/best-video-editor-sdks-compared), including high-quality Face AR masks and AI video editing tools.

Features:

- Recording
- Trimming & merging
- Sound track editing
- Hands-free mode
- Transition effects
- Color filters (LUTs)
- Text, picture, and GIF overlays
- 3D masks
- Beauty effects
- Picture-in-picture (Duets)
- AR filters
- AI clipping
- AI video generation
- AI subtitles
- Royalty-free music library
- Music provider integration
  And more

Refer to the documentation for more details:

- [Android](https://docs.banuba.com/ve-pe-sdk/docs/android/requirements-ve/)
- [iOS](https://docs.banuba.com/ve-pe-sdk/docs/ios/requirements)

Video Editor SDK **works offline**, and doesn’t send, store, or process any user information, making it **compliant with GDPR and other data protection regulations**.

## Usage
### License
[Start a 14-day free trial](https://www.banuba.com/video-editor-sdk#form) and see how the Video Editor SDK React Native plugin works. No credit card information is needed.

Feel free to [contact us](https://www.banuba.com/support) if you have any questions regarding this plugin.

## Installation
Run in Terminal to install Video Editor React Native plugin
```sh
npm install video-editor-react-native
```

## Integration guide
Please follow our [Integration Guide](mddocs/integration_guide.md) to complete full integration.

## Launch
Set Banuba license token [within the app](example/src/App.tsx#L8)

### Android
1. Make sure variable ```ANDROID_SDK_ROOT``` is set in your environment or configure [sdk.dir](android/local.properties#1).
2. Run ```npm run android``` in Terminal to launch the sample app on a device or launch the app in IDE i.e. Intellij, VC, etc.

### iOS
1. Install CocoaPods dependencies. Open ```ios``` directory and run in terminal ```pod install```.
2. Open **Signing & Capabilities** tab in Target settings and select your Development Team.
3. Run ```npm run ios``` in Terminal to launch the sample on a device or launch the app in IDE i.e. XCode, Intellij, VC, etc.

## Dependencies
|              | Version |
|--------------|:-------:|
| Yarn         |  3.6.1  |
| React Native | 0.79.5  |
| Android      |  8.0+   |
| iOS          |  15.0+  |
