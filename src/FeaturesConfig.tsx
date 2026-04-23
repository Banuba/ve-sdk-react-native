class FeaturesConfig {
  readonly aiClipping: AiClipping | null;
  readonly captions: Captions | null;
  readonly audioBrowser: AudioBrowser;
  readonly cameraConfig: CameraConfig;
  readonly editorConfig: EditorConfig;
  readonly coverConfig: CoverConfig;
  readonly templatesConfig: TemplatesConfig | null;
  readonly draftsConfig: DraftsConfig;
  readonly gifPickerConfig: GifPickerConfig | null;
  readonly videoDurationConfig: VideoDurationConfig;
  readonly enableEditorV2: boolean;
  readonly processPictureExternally: boolean;
  readonly releaseOnExport: boolean;

  constructor(
    aiClipping: AiClipping | null,
    captions: Captions | null,
    audioBrowser: AudioBrowser,
    cameraConfig: CameraConfig,
    editorConfig: EditorConfig,
    coverConfig: CoverConfig,
    templatesConfig: TemplatesConfig | null,
    draftsConfig: DraftsConfig,
    gifPickerConfig: GifPickerConfig | null,
    videoDurationConfig: VideoDurationConfig,
    enableEditorV2: boolean,
    processPictureExternally: boolean,
    releaseOnExport: boolean
  ) {
    this.aiClipping = aiClipping;
    this.captions = captions;
    this.audioBrowser = audioBrowser;
    this.cameraConfig = cameraConfig;
    this.editorConfig = editorConfig;
    this.coverConfig = coverConfig;
    this.templatesConfig = templatesConfig;
    this.draftsConfig = draftsConfig;
    this.coverConfig = coverConfig;
    this.gifPickerConfig = gifPickerConfig;
    this.videoDurationConfig = videoDurationConfig;
    this.enableEditorV2 = enableEditorV2;
    this.processPictureExternally = processPictureExternally;
    this.releaseOnExport = releaseOnExport;
  }
}

export class FeaturesConfigBuilder {
  private aiClipping: AiClipping | null = null;
  private captions: Captions | null = null;
  private audioBrowser: AudioBrowser = AudioBrowser.fromSource({
    source: AudioBrowserSource.local,
    params: null,
  });
  private cameraConfig: CameraConfig = new CameraConfig({
    supportsBeauty: true,
    supportsColorEffects: true,
    supportsMasks: true,
    recordModes: [RecordMode.video, RecordMode.story],
    autoStartLocalMask: null,
  });
  private editorConfig: EditorConfig = new EditorConfig({
    enableVideoAspectFill: true,
    supportsVisualEffects: true,
    supportsColorEffects: true,
  });
  private coverConfig: CoverConfig = new CoverConfig({
    supportsCoverScreen: true,
  });
  private templatesConfig: TemplatesConfig | null = null;
  private draftsConfig: DraftsConfig = DraftsConfig.fromOption({
    option: DraftsOption.askToSave,
  });
  private gifPickerConfig: GifPickerConfig | null = null;
  private videoDurationConfig: VideoDurationConfig = new VideoDurationConfig();
  private enableEditorV2: boolean = true;
  private processPictureExternally: boolean = false;
  private releaseOnExport: boolean = true;

  setAiClipping(aiClipping: AiClipping | null): this {
    this.aiClipping = aiClipping;
    return this;
  }

  setCaptions(captions: Captions | null): this {
    this.captions = captions;
    return this;
  }

  setAudioBrowser(audioBrowser: AudioBrowser): this {
    this.audioBrowser = audioBrowser;
    return this;
  }

  setCameraConfig(cameraConfig: CameraConfig): this {
    this.cameraConfig = cameraConfig;
    return this;
  }

  setEditorConfig(editorConfig: EditorConfig): this {
    this.editorConfig = editorConfig;
    return this;
  }

  setCoverConfig(coverConfig: CoverConfig): this {
    this.coverConfig = coverConfig;
    return this;
  }

  setTemplatesConfig(templatesConfig: TemplatesConfig | null): this {
    this.templatesConfig = templatesConfig;
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

  setVideoDurationConfig(videoDurationConfig: VideoDurationConfig): this {
    this.videoDurationConfig = videoDurationConfig;
    return this;
  }

  setEditorV2(enableEditorV2: boolean): this {
    this.enableEditorV2 = enableEditorV2;
    return this;
  }

  setReleaseOnExport(releaseOnExport: boolean): this {
    this.releaseOnExport = releaseOnExport;
    return this;
  }

  setProcessPictureExternally(processPictureExternally: boolean): this {
    this.processPictureExternally = processPictureExternally;
    return this;
  }

  build(): FeaturesConfig {
    return new FeaturesConfig(
      this.aiClipping,
      this.captions,
      this.audioBrowser,
      this.cameraConfig,
      this.editorConfig,
      this.coverConfig,
      this.templatesConfig,
      this.draftsConfig,
      this.gifPickerConfig,
      this.videoDurationConfig,
      this.enableEditorV2,
      this.processPictureExternally,
      this.releaseOnExport
    );
  }
}

export type { FeaturesConfig };

export enum AudioBrowserSource {
  soundstripe = 'soundstripe',
  local = 'local',
  mubert = 'mubert',
  banubaMusic = 'banubaMusic',
  disabled = 'disabled',
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
    params = null,
  }: {
    source: AudioBrowserSource;
    params?: { [key: string]: any } | null;
  }): AudioBrowser {
    return new AudioBrowser({ source, params });
  }
}

export class AiClipping {
  audioDataUrl: string;
  audioTracksUrl: string;

  constructor({
    audioDataUrl,
    audioTracksUrl,
  }: {
    audioDataUrl: string;
    audioTracksUrl: string;
  }) {
    this.audioDataUrl = audioDataUrl;
    this.audioTracksUrl = audioTracksUrl;
  }
}

export class Captions {
  uploadUrl: string | null;
  transcribeUrl: string | null;
  apiKey: string | null;
  apiV2Key: string | null;

  constructor({
    uploadUrl = null,
    transcribeUrl = null,
    apiKey = null,
    apiV2Key = null,
  }: {
    uploadUrl?: string | null;
    transcribeUrl?: string | null;
    apiKey?: string | null;
    apiV2Key?: string | null;
  }) {
    this.uploadUrl = uploadUrl;
    this.transcribeUrl = transcribeUrl;
    this.apiKey = apiKey;
    this.apiV2Key = apiV2Key;
  }
}

export enum RecordMode {
  video = 'video',
  story = 'story',
}

export class CameraConfig {
  supportsBeauty: boolean | null;
  supportsColorEffects: boolean | null;
  supportsMasks: boolean | null;
  recordModes: RecordMode[] | null;
  autoStartLocalMask: string | null;

  constructor({
    supportsBeauty = true,
    supportsColorEffects = true,
    supportsMasks = true,
    recordModes = [RecordMode.video, RecordMode.story],
    autoStartLocalMask = null,
  }: {
    supportsBeauty?: boolean | null;
    supportsColorEffects?: boolean | null;
    supportsMasks?: boolean | null;
    recordModes?: RecordMode[] | null;
    autoStartLocalMask?: string | null;
  }) {
    this.supportsBeauty = supportsBeauty;
    this.supportsColorEffects = supportsColorEffects;
    this.supportsMasks = supportsMasks;
    this.recordModes = recordModes;
    this.autoStartLocalMask = autoStartLocalMask;
  }
}

export class EditorConfig {
  enableVideoAspectFill: boolean | null;
  supportsVisualEffects: boolean | null;
  supportsColorEffects: boolean | null;
  supportsVoiceOver: boolean | null;
  supportsAudioEditing: boolean | null;
  supportPhotoEditing: boolean | null;
  supportsStickersOnVideo: boolean | null;

  constructor({
    enableVideoAspectFill = true,
    supportsVisualEffects = true,
    supportsColorEffects = true,
    supportsVoiceOver = true,
    supportsAudioEditing = true,
    supportPhotoEditing = false,
    supportsStickersOnVideo = true,
  }: {
    enableVideoAspectFill?: boolean | null;
    supportsVisualEffects?: boolean | null;
    supportsColorEffects?: boolean | null;
    supportsVoiceOver?: boolean | null;
    supportsAudioEditing?: boolean | null;
    supportPhotoEditing?: boolean | null;
    supportsStickersOnVideo?: boolean | null;
  }) {
    this.enableVideoAspectFill = enableVideoAspectFill;
    this.supportsVisualEffects = supportsVisualEffects;
    this.supportsColorEffects = supportsColorEffects;
    this.supportsVoiceOver = supportsVoiceOver;
    this.supportsAudioEditing = supportsAudioEditing;
    this.supportPhotoEditing = supportPhotoEditing;
    this.supportsStickersOnVideo = supportsStickersOnVideo;
  }
}

export class CoverConfig {
  supportsCoverScreen: boolean;

  constructor({
    supportsCoverScreen = true,
  }: {
    supportsCoverScreen: boolean;
  }) {
    this.supportsCoverScreen = supportsCoverScreen;
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

export class TemplatesConfig {
  url: string | null;

  constructor({
    url = null
  }: {
    url: string | null
  }) {
    this.url = url
  }
}

export enum GiphyMode {
  search = 'search',
  list = 'list',
}

export class GifPickerConfig {
  giphyApiKey: string;
  mode?: GiphyMode;
  ids?: string[] | null;

  constructor({
    giphyApiKey,
    mode = GiphyMode.search,
    ids = null,
  }: {
    giphyApiKey: string;
    mode?: GiphyMode;
    ids?: string[] | null;
  }) {
    this.giphyApiKey = giphyApiKey;
    this.mode = mode ?? GiphyMode.search;
    this.ids = ids;
  }
}

export class VideoDurationConfig {
  maxTotalVideoDuration?: number;
  videoDurations?: number[];

  constructor({
    maxTotalVideoDuration = 120.0,
    videoDurations = [60.0, 30.0, 15.0],
  }: {
    maxTotalVideoDuration?: number;
    videoDurations?: number[];
  } = {}) {
    this.maxTotalVideoDuration = maxTotalVideoDuration;
    this.videoDurations = videoDurations;
  }
}
