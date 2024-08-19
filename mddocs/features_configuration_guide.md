# Customizations

## Usage

Create instance of the ```FeaturesConfig``` to apply various Video Editor configurations.

Pass the ```FeaturesConfig``` instance to any Video Editor [start method](../example/src/App.tsx#L102-105). For example:

```typescript
  private featuresConfig = new FeaturesConfigBuilder()
    .setAudioBrowser(AudioBrowser.fromSource({
        source: AudioBrowserSource.local,
        params: null
        })
    )
    .build();
```

```typescript
const videoEditor = new VideoEditorPlugin();
videoEditor.openFromCamera(LICENSE_TOKEN, this.featuresConfig)
    .then(response => { this.handleVideoExport(response); })
    .catch(e => { this.handleSdkError(e); });
```

## Configurations

1. [AI Captions](ai_captions_guide.md)
2. [AI Clipping](ai_clipping_guide.md)
3. [Audio Browser](audio_browser_guide.md)
4. [Editor screen](editor_screen_guide.md)
5. [Draft](drafts_guide)
6. [Stickers](stickers_guide.md)
