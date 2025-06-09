import Foundation
import BanubaVideoEditorSDK
import BanubaAudioBrowserSDK

struct FeaturesConfig: Codable {
    let captions: Captions?
    let aiClipping: AiClipping?
    let audioBrowser: AudioBrowser
    let cameraConfig: CameraConfig
    let editorConfig: EditorConfig
    let draftsConfig: DraftsConfig
    let gifPickerConfig: GifPickerConfig?
    let videoDurationConfig: VideoDurationConfig
    let enableEditorV2: Bool
    let processPictureExternally: Bool
}

struct AiClipping: Codable {
    let audioDataUrl: String
    let audioTracksUrl: String
}

struct Captions: Codable {
    let uploadUrl: String?
    let transcribeUrl: String?
    let apiKey: String?
    let apiV2Key: String?
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
            case VideoEditorConfig.featuresConfigAudioBrowserSourceBanubaMusic:
                return .banubaMusic
            default:
                return .allSources
        }
    }
}

struct Params: Codable {
    let mubertLicence: String?
    let mubertToken: String?
}

struct CameraConfig: Codable {
    let supportsBeauty: Bool
    let supportsColorEffects: Bool
    let supportsMasks: Bool
    let recordModes: [String]
}

struct EditorConfig: Codable {
    let enableVideoAspectFill: Bool
    let supportsVisualEffects: Bool
    let supportsColorEffects: Bool
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

struct VideoDurationConfig: Codable {
    let maxTotalVideoDuration: TimeInterval
    let videoDurations: [TimeInterval]
    public func value() -> VideoEditorDurationConfig {
        return VideoEditorDurationConfig(
            maximumVideoDuration: maxTotalVideoDuration,
            videoDurations: videoDurations,
            minimumDurationFromCamera: 3.0,
            minimumDurationFromGallery: 0.3,
            minimumVideoDuration: 1.0,
            minimumTrimmedPartDuration: 0.3,
            slideshowDuration: 3.0
        )
    }
}

