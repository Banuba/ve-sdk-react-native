class FeaturesConfig {
  readonly aiClipping: AiClipping | null;
  readonly aiCaptions: AiCaptions | null;
  readonly audioBrowser: AudioBrowser;
  readonly editorConfig: EditorConfig;
  readonly draftConfig: DraftConfig;
  readonly gifPickerConfig: GifPickerConfig | null;

  constructor(
    aiClipping: AiClipping | null,
    aiCaptions: AiCaptions | null,
    audioBrowser: AudioBrowser,
    editorConfig: EditorConfig,
    draftConfig: DraftConfig,
    gifPickerConfig: GifPickerConfig | null
  ) {
    this.aiClipping = aiClipping;
    this.aiCaptions = aiCaptions;
    this.audioBrowser = audioBrowser;
    this.editorConfig = editorConfig;
    this.draftConfig = draftConfig;
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
  private draftConfig: DraftConfig = DraftConfig.fromOption({
    option: DraftOption.askToSave,
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

  setDraftConfig(draftConfig: DraftConfig): this {
    this.draftConfig = draftConfig;
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
      this.draftConfig,
      this.gifPickerConfig
    );
  }
}

export type { FeaturesConfig };

export enum AudioBrowserSource {
  soundstripe = 'soundstripe',
  local = 'local',
  mubert = 'mubert',
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

export enum DraftOption {
  askToSave = 'askToSave',
  closeOnSave = 'closeOnSave',
  auto = 'auto',
  disabled = 'disabled',
}

export class DraftConfig {
  option: DraftOption;

  private constructor({ option }: { option: DraftOption }) {
    this.option = option;
  }

  static fromOption({ option }: { option: DraftOption }): DraftConfig {
    return new DraftConfig({ option });
  }
}

export class GifPickerConfig {
  giphyApiKey: String;

  constructor({ giphyApiKey }: { giphyApiKey: String }) {
    this.giphyApiKey = giphyApiKey;
  }
}
