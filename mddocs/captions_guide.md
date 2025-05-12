# Closed Captions

AI Captions are a textual representation of the audio within a media file.

Over 80% of videos played on mobile devices don’t have sound turned on. This means many forms of content (e.g. skits, monologues, educational clips, etc.) will be skipped if there are no subtitles. But making captions by hand is tedious. AI-generated subtitles solve this issue, as they are created and placed automatically. The users can then edit the text as well as change its style and color.

[AWS Transcribe service](https://docs.aws.amazon.com/transcribe/) is used to generate captions.

## Supported languages

- Arabic
- English
- Mandarin
- Spanish
- Portuguese

## Usage

Specify instance of ```Captions``` in ```FeaturesConfig``` builder:

> [!IMPORTANT]
> A trial option for AI Captions
> Please contact Banuba representatives before use in production.

```typescript
  private featuresConfig = new FeaturesConfigBuilder()
    .setCaptions(
      new Captions({
        uploadUrl: "https://internal.transcribe.banuba.net",
        transcribeUrl: "https://rest.internal.transcribe.banuba.net/transcribe/v1/status",
        apiKey: "CheiYaaphoK6eungecheec4eingeik9shaijiech"
      })
    )
    ...
    .build();
```
