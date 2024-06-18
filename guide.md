# Integration Guide

## Installation

Run this command via terminal in the root of your project:
```
npm install video-editor-react-native
```

## Configuration

### Android

#### Download Android modules

GitHub Packages is used for downloading Android Video Editor SDK modules.
Add repositories to [gradle](example/android/app/build.gradle#L107) file.
```groovy
repositories {
  maven {
    name = "GitHubPackages"
    url = uri("https://maven.pkg.github.com/Banuba/banuba-ve-sdk")
    credentials {
      username = "Banuba"
      password = "\u0038\u0036\u0032\u0037\u0063\u0035\u0031\u0030\u0033\u0034\u0032\u0063\u0061\u0033\u0065\u0061\u0031\u0032\u0034\u0064\u0065\u0066\u0039\u0062\u0034\u0030\u0063\u0063\u0037\u0039\u0038\u0063\u0038\u0038\u0066\u0034\u0031\u0032\u0061\u0038"
    }
  }
  maven {
    name = "ARCloudPackages"
    url = uri("https://github.com/Banuba/banuba-ar")
    credentials {
      username = "Banuba"
      password = "\u0038\u0036\u0032\u0037\u0063\u0035\u0031\u0030\u0033\u0034\u0032\u0063\u0061\u0033\u0065\u0061\u0031\u0032\u0034\u0064\u0065\u0066\u0039\u0062\u0034\u0030\u0063\u0063\u0037\u0039\u0038\u0063\u0038\u0038\u0066\u0034\u0031\u0032\u0061\u0038"
    }
  }
  maven {
    name = "GitHubPackagesEffectPlayer"
    url = "https://maven.pkg.github.com/sdk-banuba/banuba-sdk-android"
    credentials {
      username = "sdk-banuba"
      password = "\u0067\u0068\u0070\u005f\u0033\u0057\u006a\u0059\u004a\u0067\u0071\u0054\u0058\u0058\u0068\u0074\u0051\u0033\u0075\u0038\u0051\u0046\u0036\u005a\u0067\u004f\u0041\u0053\u0064\u0046\u0032\u0045\u0046\u006a\u0030\u0036\u006d\u006e\u004a\u004a"
    }
  }
}
```

#### Add Android Activity
Add ```VideoCreationActivity``` in [AndroidManifest.xml](example/android/app/src/main/AndroidManifest.xml#L27) file.
``` xml
    <activity
        android:name="com.banuba.sdk.ve.flow.VideoCreationActivity"
        android:screenOrientation="portrait"
        android:theme="@style/CustomIntegrationAppTheme"
        android:windowSoftInputMode="adjustResize"
        tools:replace="android:theme" />
```

### IOS

> [!IMPORTANT]
> Check if you have an empty Swift file and Bridge Header in you IOS project.

#### Add an empty Swift file and Bridge Header

Open your IOS project via Xcode and create [a new empty Swift file](example/ios/File.swift) in your project by following the path ```File -> New -> File```. Xcode will suggest you to configure an Objective-C bridging Header. Click ```Create Bridging Header```.

#### Add specs to Podfile

Add the following specs at the top of your [Podfile](example/ios/Podfile)

```
platform :ios, '15.0'
source 'https://github.com/CocoaPods/Specs.git'
source 'https://github.com/Banuba/specs.git'
source 'https://github.com/sdk-banuba/banuba-sdk-podspecs.git'
```

#### Add permissions for IOS project

Specify the required permissions for ```VE SDK``` in your [Info.plist](example/ios/VideoEditorReactNativeExample/Info.plist):
```
<key>NSAppleMusicUsageDescription</key>
<string>This app requires access to the media library</string>
<key>NSCameraUsageDescription</key>
<string>This app requires access to the camera.</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app requires access to the microphone.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app requires access to the photo library.</string>
```

## Add AR effects
[Banuba Face AR SDK](https://www.banuba.com/facear-sdk/face-filters) product is used on camera and editor screens for applying various AR effects while making video content.

:exclamation: IMPORTANT
Add beautification effect to your project.

1. Android - copy [Beauty](example/android/app/src/main/assets/bnb-resources/effects/Beauty) effect from example project and paste it to ```assets/bnb-resources/effects``` in your project.
1. iOS - add the effect to resource folder ```bundleEffects```. You can drag and drop the [BeautyEffects](example/ios/bundleEffects/BeautyEffects) from [bundleEffects](example/ios/bundleEffects) folder from example project to your project's sidebar in Xcode. Make sure to select the "Copy items if needed" and "Create folder references" checkboxes. When done correctly, the ```bundleEffects``` folder's icon will be blue and the folder itself will be present in Copy bundle resources build phase.

## Add Color filters
Color filter previews are images(```.png``` files) used to represent texture.

:exclamation: IMPORTANT
Previews files are not part of plugin by default since these resources add extra MBs to your app.

### Android
Preview files are in [drawable-xhdpi](example/android/app/src/main/res/drawable-xhdpi),
[drawable-xxhdpi](example/android/app/src/main/res/drawable-xxhdpi), [drawable-xxxhdpi](example/android/app/src/main/res/drawable-xxxhdpi) folders.
Keep in mind that ```drawable-xxxhdpi``` contains files with the highest resolution. Additionally, you can copy paste just one set of previews if it meets your requirements.

### iOS

Copy the ```ColorEffectsPreview``` folder from [example's asset catalog](example/ios/Runner/Assets.xcassets) to your app's asset catalog.

## Limit processor architectures on Android
Banuba Video Editor on Android supports the following processor architectures - ```arm64-v8a```, ```armeabi-v7a```, ```x86-64```.
Please keep in mind that each architecture adds extra MBs to your app.
To reduce the app size you can filter architectures in your ```app/build.gradle file```.

```groovy
...
defaultConfig {
    ...
    // Use only ARM processors
    ndk {
        abiFilters 'armeabi-v7a', 'arm64-v8a'
    }
}
```
