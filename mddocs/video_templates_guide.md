# Video Templates

Templates let users create stunning videos quickly and easily using predefined sets of effects, transitions, and music.
All it takes to make a shareable piece is changing the placeholders. With templates, even people who are new to video editing or just lack time can make impressive content in minutes.

> [!NOTE]
> The ```Video Templates``` is not enabled by default. Contact Banuba representatives to know more.

## Launch Video Templates

```typescript
videoEditor.openFromTemplates(LICENSE_TOKEN, this.featuresConfig)
    .then(response => { this.handleVideoExport(response); })
    .catch(e => { this.handleSdkError(e); });
```

## Setup Custom Templates

```typescript
final featuresConfig = new FeaturesConfigBuilder()
    .setTemplatesConfig(new TemplatesConfig({ url: "YOUR_URL" }))
    ...
    .build()
```

## Launch Template Builder on iOS

To open the Template Builder flow on iOS, launch Video Templates with `openFromTemplates`
and enable the builder mode in `TemplatesConfig`. The Video Templates feature must also be
enabled in your Banuba license, and the iOS SDK version must be `1.51.3` or later.

```typescript
final featuresConfig = new FeaturesConfigBuilder()
    .setTemplatesConfig(new TemplatesConfig({
        url: "YOUR_URL",
        enableBuilder: true,
        termsOfUseUrl: "https://example.com/terms"
    }))
    ...
    .build()
```
