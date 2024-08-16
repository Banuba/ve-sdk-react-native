interface FeaturesConfigParams {
  aiClipping?: AiClipping | null;
  aiCaptions?: AiCaptions | null;
  audioBrowser?: AudioBrowser;
  draftConfig?: DraftConfig;
  editorConfig?: EditorConfig;
  gifPickerConfig?: GifPickerConfig | null;
}

export class FeaturesConfig {
  readonly aiClipping: AiClipping | null;
  readonly aiCaptions: AiCaptions | null;
  readonly audioBrowser: AudioBrowser;
  readonly editorConfig: EditorConfig;
  readonly draftConfig: DraftConfig;
  readonly gifPickerConfig: GifPickerConfig | null;

  constructor({
    aiClipping = null,
    aiCaptions = null,
    audioBrowser = AudioBrowser.fromSource({
      source: AudioBrowserSource.local,
      params: null,
    }),
    editorConfig = new EditorConfig({ enableVideoAspectFill: false }),
    draftConfig = DraftConfig.fromOption({ option: DraftOption.askToSave }),
    gifPickerConfig = null,
  }: FeaturesConfigParams = {}) {
    this.aiClipping = aiClipping;
    this.aiCaptions = aiCaptions;
    this.audioBrowser = audioBrowser;
    this.editorConfig = editorConfig;
    this.draftConfig = draftConfig;
    this.gifPickerConfig = gifPickerConfig;
  }
}

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
