# Camera screen

## Usage

Specify instance of ```CameraConfig``` in ```FeaturesConfig``` builder:

```typescript
final featuresConfig = new FeaturesConfigBuilder()
    .setCameraConfig(new CameraConfig({
        supportsBeauty: false,
        supportsColorEffects: false,
        supportsMasks: false,
        recordModes: [RecordMode.video, RecordMode.photo]
    }))
    ...
    .build()
```

### Options

- ```supportsBeauty``` - Determines whether the camera supports beauty effect. Default value is ```true```.
- ```supportsColorEffects``` - Determines whether the camera supports color effects. Default value is ```true```.
- ```supportsMasks``` - Determines whether the camera supports visual effects. Default value is ```true```.
- ```recordModes``` - Determines which recording modes are supported. Default value is ```[RecordMode.video, RecordMode.photo]```.
