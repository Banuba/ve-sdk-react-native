export class FeaturesConfig{
    private aiClipping: AiClipping | undefined
    private aiCaptions: AiCaptions | undefined
    private audioBrowser: AudioBrowser 
    private editorConfig: EditorConfig
    private draftConfig: DraftConfig
    private gifPickerConfig: GifPickerConfig | undefined

    private constructor(
        aiClipping: AiClipping | undefined,
         aiCaptions: AiCaptions | undefined,
         audioBrowser: AudioBrowser,
         editorConfig: EditorConfig,
         draftConfig: DraftConfig,
         gifPickerConfig: GifPickerConfig | undefined
    ) {
        this.aiClipping = aiClipping
        this.aiCaptions = aiCaptions
        this.audioBrowser = audioBrowser
        this.editorConfig = editorConfig
        this.draftConfig = draftConfig
        this.gifPickerConfig = gifPickerConfig
    }

    static Builder = class FeaturesConfigBuilder {
        private aiClipping: AiClipping | undefined
        private aiCaptions: AiCaptions | undefined
        private audioBrowser = AudioBrowser.fromSource({source: AudioBrowserSource.local, params: undefined})
        private editorConfig = new EditorConfig({enableVideoAspectFill: true})
        private draftConfig = DraftConfig.fromOption({option: DraftOption.askToSave})
        private gifPickerConfig: GifPickerConfig | undefined

        setAiClipping(aiClipping: AiClipping): FeaturesConfigBuilder {
            this.aiClipping = aiClipping;
            return this;
        }

        setAiCaptions(aiCaptions: AiCaptions): FeaturesConfigBuilder {
            this.aiCaptions = aiCaptions;
            return this;
        }

        setAudioBrowser(audioBrowser: AudioBrowser): FeaturesConfigBuilder {
            this.audioBrowser = audioBrowser
            return this
        }

        setEditorConfig(editorConfig: EditorConfig): FeaturesConfigBuilder {
            this.editorConfig = editorConfig
            return this
        }

        setDraftConfig(draftConfig: DraftConfig): FeaturesConfigBuilder {
            this.draftConfig = draftConfig
            return this
        }

        setGifPickerConfig(gifPickerConfig: GifPickerConfig): FeaturesConfigBuilder {
            this.gifPickerConfig = gifPickerConfig
            return this
        }

        build(): FeaturesConfig {
            return new FeaturesConfig(this.aiClipping, this.aiCaptions, this.audioBrowser, this.editorConfig, this.draftConfig, this.gifPickerConfig); 
        }
    };
}

export enum AudioBrowserSource { soundstripe = "soundstripe", local = "local", mubert = "mubert" }

export class AudioBrowser{
    source: AudioBrowserSource
    params: { [key: string]: any } | undefined

    private constructor ({source, params}:{source: AudioBrowserSource, params: {[key: string]: any} | undefined }){
        this.source = source
        this.params = params
    }

    static fromSource({source, params}: {source: AudioBrowserSource, params: {[key: string]: any} | undefined}): AudioBrowser{
        return new AudioBrowser({source, params});
    }
}

export class AiClipping{
    audioDataUrl: String
    audioTracksUrl: String

    constructor ({ audioDataUrl, audioTracksUrl }: { audioDataUrl: String, audioTracksUrl: string }){
        this.audioDataUrl = audioDataUrl
        this.audioTracksUrl = audioTracksUrl
    }
}

export class AiCaptions{
    uploadUrl: String
    transcribeUrl: String
    apiKey: String

    constructor ({uploadUrl, transcribeUrl, apiKey}:{uploadUrl: String, transcribeUrl: String, apiKey: String}){
        this.uploadUrl = uploadUrl
        this.transcribeUrl = transcribeUrl
        this.apiKey = apiKey
    }
}

export class EditorConfig{
    enableVideoAspectFill: Boolean | undefined

    constructor ({enableVideoAspectFill}:{enableVideoAspectFill: Boolean}){
        this.enableVideoAspectFill = enableVideoAspectFill
    }
}

export enum DraftOption { askToSave = "askToSave", closeOnSave = "closeOnSave", auto = "auto", disabled = "disabled" }

export class DraftConfig{
    option: DraftOption

    private constructor({option}:{option: DraftOption}) {
        this.option = option;
    }
    
    static fromOption({option}: {option: DraftOption}): DraftConfig {
        return new DraftConfig({option});
    }
}

export class GifPickerConfig {
    giphyApiKey: String

    constructor({giphyApiKey}:{giphyApiKey: String}){
        this.giphyApiKey = giphyApiKey
    }
} 