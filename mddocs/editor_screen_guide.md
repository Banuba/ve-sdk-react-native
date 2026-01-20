# Editor screen

## Usage

Specify instance of ```EditorConfig``` in ```FeaturesConfig``` builder:

```typescript
final featuresConfig = new FeaturesConfigBuilder()
    .setEditorConfig(new EditorConfig({
        enableVideoAspectFill: false,
        supportsColorEffects: false,
        supportsVisualEffects: false,
        supportsVoiceOver: false,
        supportsAudioEditing: false,
        supportPhotoEditing: false,
        supportsStickersOnVideo: false,
    }))
    ...
    .build()
```

### Options

- ```enableVideoAspectFill``` - Fill video aspect on the editor screen while playback. Default value is ```true```.
- ```supportsColorEffects``` - Determines whether the editor supports color effects. Default value is ```true```.
- ```supportsVisualEffects``` - Determines whether the editor supports visual effects. Default value is ```true```.
- ```supportsVoiceOver``` - Determines whether the editor supports voice over. Default value is ```true```.
- ```supportsAudioEditing``` - Determines whether the editor supports audio editing. Default value is ```true```.
- ```supportPhotoEditing``` - Requires the [pe-sdk-react-native](https://www.npmjs.com/package/pe-sdk-react-native) plugin. Determines whether the editor supports photo editing flow in Banuba Photo Editor. Default value is ```false```.
- ```supportsStickersOnVideo``` - Determines whether the editor supports stickers on video. Default value is ```true```.
