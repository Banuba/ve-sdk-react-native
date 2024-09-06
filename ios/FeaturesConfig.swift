import Foundation
import BanubaVideoEditorSDK
import BanubaAudioBrowserSDK

struct FeaturesConfig: Codable {
    let aiCaptions: AiCaptions?
    let aiClipping: AiClipping?
    let audioBrowser: AudioBrowser
    let editorConfig: EditorConfig
    let draftsConfig: DraftsConfig
    let gifPickerConfig: GifPickerConfig?
}

struct AiClipping: Codable {
    let audioDataUrl: String
    let audioTracksUrl: String
}

struct AiCaptions: Codable {
    let uploadUrl: String
    let transcribeUrl: String
    let apiKey: String
}

struct AudioBrowser: Codable {
    let source: String
    let params: Params?

    public func value() -> AudioBrowserMusicSource{
        switch source {
            case VideoEditorConfig.featuresConfigAudioBrowserSourceSoundstripe:
                return .soundstripe
            case VideoEditorConfig.featuresConfigAudioBrowserSourceLocal:
                return .localStorageWithMyFiles
            case VideoEditorConfig.featuresConfigAudioBrowserSourceMubert:
                return .mubert
            default:
                return .allSources
        }
    }
}

struct Params: Codable {
    let mubertLicence: String?
    let mubertToken: String?
}

struct EditorConfig: Codable {
    let enableVideoAspectFill: Bool
}

struct DraftsConfig: Codable {
    let option: String

    func value() -> DraftsFeatureConfig {
        switch self.option {
            case VideoEditorConfig.featuresConfigDraftsConfigOptionAuto:
                return .enabledSaveToDraftsByDefault
            case VideoEditorConfig.featuresConfigDraftsConfigOptionСloseOnSave:
                return .enabledAskIfSaveNotExport
            case VideoEditorConfig.featuresConfigDraftsConfigOptionDisabled:
                return .disabled
            default:
                return .enabled
        }
    }
}

struct GifPickerConfig: Codable {
    let giphyApiKey: String
}

