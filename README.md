# Banuba Video Editor React Native plugin

## Overview
[Banuba Video Editor SDK](https://www.banuba.com/video-editor-sdk) allows you to quickly add short video functionality and possibly AR filters and effects into your mobile app.

## Usage
### License
Before you commit to a license, you are free to test all the features of the SDK for free.
The trial period lasts 14 days. To start it, [send us a message](https://www.banuba.com/video-editor-sdk#form).
We will get back to you with the trial token.

Feel free to [contact us](https://www.banuba.com/support) if you have any questions.

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
| React Native | 0.78.2  |
| Android      |  8.0+   |
| iOS          |  15.0+  |
