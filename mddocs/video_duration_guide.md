# Video Duration

```VideoDurationConfig``` is responsible for customizing video recording durations.

## Usage

Specify instance of ```VideoDurationConfig``` in ```FeaturesConfig```:

```typescript
  private featuresConfig = new FeaturesConfigBuilder()
    .setVideoDurationConfig(new VideoDurationConfig({
      maxTotalVideoDuration: 180.0,
      videoDurations: [180.0, 60.0]
    }))
    .build();
```
