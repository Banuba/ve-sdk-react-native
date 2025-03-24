# AI Clipping

The ```AI Clipping``` feature automates the video creation process by leveraging the power of artificial intelligence. The neural network transforms raw input into ready-to-post videos with various transitions, effects, and a precise music match.

Here is how users can interact with it:

1. User selects clips and music. People can choose their desired clips and accompanying music within the app.
2. AI trims the videos. The AI algorithm intelligently trims the selected clips to match the tempo and rhythm of the chosen track.
3. AI adds various effects. AI Clipping enhances the content by adding a variety of effects to create visually stunning content.
4. User exports, edits, or regenerates the clip. Upon completion, users have the flexibility to export the video as is, make further edits, or regenerate the clip for a fresh perspective.
5. Regardless of the user’s editing skills, with the help of Auto Cut, everyone can get a stunning video within seconds.

## Supported music providers

1. [Soundstripe](audio_browser_guide.md#soundstripe)
2. [Banuba Music](audio_browser_guide.md#banuba-music)

> [!NOTE]
> Please contact Banuba representatives to know more about using the ```Banuba music``` with ```AI Clipping```.

## Usage

### Setup configuration

Specify instance of ```AiClipping``` in ```FeaturesConfig``` builder:

> [!IMPORTANT]
> Contact Banuba representatives to get trial keys for ```audioDataUrl``` and ```audioTracksUrl``` use in production.

```typescript
private featuresConfig = new FeaturesConfigBuilder()
    .setAiClipping(new AiClipping({
      audioDataUrl: "...",
      audioTracksUrl: "..."
    })
    )
    ...
    .build();
```

### Launch AI Clipping

> [!NOTE]
> Video creation with AI Clipping is available on Gallery screen by default.

For better experience we added new entry point to `VideoEditorPlugin` for opening AI Clipping as a separate mode. In this scenario the user starts from the gallery screen and is taken to AI Clipping screen after selecting media.

```typescript
videoEditor.openFromAiClipping(LICENSE_TOKEN, this.featuresConfig)
    .then(response => { this.handleVideoExport(response); })
    .catch(e => { this.handleSdkError(e); });
```
