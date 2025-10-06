# Stickers

Stickers are interactive objects (gif images) that can be added to the video recording.

## Giphy

Video Editor uses [Giphy service](https://developers.giphy.com/docs/api/) for loading stickers.
Any sticker effect is a GIF file.

## Usage

Specify instance of ```GifPickerConfig``` in ```FeaturesConfig```:

> [!IMPORTANT]
> To use stickers in your project you need to request personal [Giphy API key](https://support.giphy.com/hc/en-us/articles/360020283431-Request-A-GIPHY-API-Key)

```typescript
private featuresConfig = new FeaturesConfigBuilder()
    .setGifPickerConfig(new GifPickerConfig({
         giphyApiKey: "...",
         mode: GiphyMode.search,
         ids: ["...","..."]
    }))
    ...
    .build();
```
