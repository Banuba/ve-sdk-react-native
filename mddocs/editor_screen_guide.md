# Editor screen

## Usage

Specify instance of ```EditorConfig``` in ```FeaturesConfig``` builder:

```typescript
final config = new FeaturesConfigBuilder()
    .setEditorConfig(new EditorConfig({ enableVideoAspectFill: false }))
    ...
    .build()
```

### Options

- ```enableVideoAspectFill``` - Fill video aspect on the editor screen while playback. Default value is ```true```.
