class FeaturesConfig {
  readonly aiClipping: AiClipping | null;
  readonly aiCaptions: AiCaptions | null;
  readonly audioBrowser: AudioBrowser;
  readonly editorConfig: EditorConfig;
  readonly draftsConfig: DraftsConfig;
  readonly gifPickerConfig: GifPickerConfig | null;

  constructor(
    aiClipping: AiClipping | null,
    aiCaptions: AiCaptions | null,
    audioBrowser: AudioBrowser,
    editorConfig: EditorConfig,
    draftsConfig: DraftsConfig,
    gifPickerConfig: GifPickerConfig | null
  ) {
    this.aiClipping = aiClipping;
    this.aiCaptions = aiCaptions;
    this.audioBrowser = audioBrowser;
    this.editorConfig = editorConfig;
    this.draftsConfig = draftsConfig;
    this.gifPickerConfig = gifPickerConfig;
  }
}

export class FeaturesConfigBuilder {
  private aiClipping: AiClipping | null = null;
  private aiCaptions: AiCaptions | null = null;
  private audioBrowser: AudioBrowser = AudioBrowser.fromSource({
    source: AudioBrowserSource.local,
    params: null,
  });
  private editorConfig: EditorConfig = new EditorConfig({
    enableVideoAspectFill: false,
  });
  private draftsConfig: DraftsConfig = DraftsConfig.fromOption({
    option: DraftsOption.askToSave,
  });
  private gifPickerConfig: GifPickerConfig | null = null;

  setAiClipping(aiClipping: AiClipping | null): this {
    this.aiClipping = aiClipping;
    return this;
  }

  setAiCaptions(aiCaptions: AiCaptions | null): this {
    this.aiCaptions = aiCaptions;
    return this;
  }

  setAudioBrowser(audioBrowser: AudioBrowser): this {
    this.audioBrowser = audioBrowser;
    return this;
  }

  setEditorConfig(editorConfig: EditorConfig): this {
    this.editorConfig = editorConfig;
    return this;
  }

  setDraftsConfig(draftsConfig: DraftsConfig): this {
    this.draftsConfig = draftsConfig;
    return this;
  }

  setGifPickerConfig(gifPickerConfig: GifPickerConfig | null): this {
    this.gifPickerConfig = gifPickerConfig;
    return this;
  }

  build(): FeaturesConfig {
    return new FeaturesConfig(
      this.aiClipping,
      this.aiCaptions,
      this.audioBrowser,
      this.editorConfig,
      this.draftsConfig,
      this.gifPickerConfig
    );
  }
}

export type { FeaturesConfig };

export enum AudioBrowserSource {
  soundstripe = 'soundstripe',
  local = 'local',
  mubert = 'mubert',
  banubaFm = 'banubaMusic'
}

export class AudioBrowser {
  source: AudioBrowserSource;
  params: { [key: string]: any } | null;

  private constructor({
    source,
    params,
  }: {
    source: AudioBrowserSource;
    params: { [key: string]: any } | null;
  }) {
    this.source = source;
    this.params = params;
  }

  static fromSource({
    source,
    params,
  }: {
    source: AudioBrowserSource;
    params: { [key: string]: any } | null;
  }): AudioBrowser {
    return new AudioBrowser({ source, params });
  }
}

export class AiClipping {
  audioDataUrl: String;
  audioTracksUrl: String;

  constructor({
    audioDataUrl,
    audioTracksUrl,
  }: {
    audioDataUrl: String;
    audioTracksUrl: string;
  }) {
    this.audioDataUrl = audioDataUrl;
    this.audioTracksUrl = audioTracksUrl;
  }
}

export class AiCaptions {
  uploadUrl: String;
  transcribeUrl: String;
  apiKey: String;

  constructor({
    uploadUrl,
    transcribeUrl,
    apiKey,
  }: {
    uploadUrl: String;
    transcribeUrl: String;
    apiKey: String;
  }) {
    this.uploadUrl = uploadUrl;
    this.transcribeUrl = transcribeUrl;
    this.apiKey = apiKey;
  }
}

export class EditorConfig {
  enableVideoAspectFill: Boolean;

  constructor({ enableVideoAspectFill }: { enableVideoAspectFill: Boolean }) {
    this.enableVideoAspectFill = enableVideoAspectFill;
  }
}

export enum DraftsOption {
  askToSave = 'askToSave',
  closeOnSave = 'closeOnSave',
  auto = 'auto',
  disabled = 'disabled',
}

export class DraftsConfig {
  option: DraftsOption;

  private constructor({ option }: { option: DraftsOption }) {
    this.option = option;
  }

  static fromOption({ option }: { option: DraftsOption }): DraftsConfig {
    return new DraftsConfig({ option });
  }
}

export class GifPickerConfig {
  giphyApiKey: String;

  constructor({ giphyApiKey }: { giphyApiKey: String }) {
    this.giphyApiKey = giphyApiKey;
  }
}
