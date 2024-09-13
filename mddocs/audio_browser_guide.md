# Audio Browser

```Audio Browser``` - a specific module and set of screens that include the built-in support of browsing and applying audio content within the Video Editor. The user does not leave the SDK while using audio.

> [!NOTE]
> Banuba does not deliver audio content for the Video Editor SDK.
The Video Editor can apply audio files stored on the device. The SDK is not responsible for downloading audio content except for [Soundstripe](https://www.soundstripe.com/) and [Mubert](https://mubert.com/).

Audio Browser is a specific module that allows to browse, play and apply audio content within video editor.
It supports 3 sources for audio content:

1. Soundstripe - includes built in integration with Soundstripe API.

2. Mubert - includes built in integration with Mubert API.

3. Banuba FM - includes built in integration with Banuba FM

4. My Library - includes audio content available on the user's device

## Usage

### Soundstripe

[Soundstripe](https://www.soundstripe.com/) is a service for providing the best audio tracks for creating video content. Your users will be able to add audio tracks while recording or editing video content.

> [!NOTE]
> The feature is not activated by default.
> Please contact Banuba representatives to know more about using this feature.

Specify the instance of ```AudioBrowser``` in ```FeaturesConfig``` builder with Soundstripe source:

```typescript
private config = new FeaturesConfigBuilder()
    .setAudioBrowser(AudioBrowser.fromSource({
        source: AudioBrowserSource.soundstripe,
        params: null
    }))
    ...
    .build();
```

### Mubert

[Mubert](https://mubert.com/) is a service that delivers Generative AI Music. Your users will be able to add audio tracks while recording or editing video content.

> [!NOTE]
> Please contact Mubert representatives to request keys.

Specify the instance of ```AudioBrowser``` in ```FeaturesConfig``` builder with Mubert source and params:

```typescript
private config = new FeaturesConfigBuilder()
    .setAudioBrowser(AudioBrowser.fromSource({
        source: AudioBrowserSource.mubert,
        params: {
            mubertLicence: ...,
            mubertToken: ...
        }
    }))
    ...
    .build();
```

### Banuba FM

Over 35 GB of royalty-free tracks available from within the Video Editor SDK. Your users could check them out through an inbuilt music browser and legally include them in their content.

> [!NOTE]
> The feature is not activated by default.
> Please contact Banuba representatives to know more about using this feature.

Specify the instance of ```AudioBrowser``` in ```FeaturesConfig``` builder with Banuba FM source and params:

```dart
private config = new FeaturesConfigBuilder()
    .setAudioBrowser(AudioBrowser.fromSource({
        source: AudioBrowserSource.banubaFm,
        params: null
    }))
    ...
    .build();
```

### My Library

```My Library``` is a default implementation in AudioBrowser . It allows the user to apply audio that is available on a device.

Specify the instance of ```AudioBrowser``` in ```FeaturesConfig``` builder with local source:

```typescript
private config = new FeaturesConfigBuilder()
    .setAudioBrowser(AudioBrowser.fromSource({
        source: AudioBrowserSource.local,
        params: null
    }))
    ...
    .build();
```
