# Draft Configuration

Drafts are enabled by default, asks the user to save a draft before leave any VideoEditor screen.

## Usage

Specify instance of ```DraftConfig``` in ```FeaturesConfig``` builder to change drafts configuration:

```typescript
private config = new FeaturesConfigBuilder()
    .setDraftConfig(DraftConfig.fromOption({ option: DraftOption.auto }))
    ...
    .build();
```

### Options

- ```DraftOption.askToSave``` - drafts enabled, asks the user to save a draft
- ```DraftOption.auto``` - drafts enabled, saved by default without asking the user
- ```DraftOption.closeOnSave``` - drafts enabled, asks the user to save a draft without export
- ```DraftOption.disable``` - disabled drafts
