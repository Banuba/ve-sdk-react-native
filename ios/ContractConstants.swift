
import Foundation
import BanubaVideoEditorSDK

extension VideoEditorReactNative {
    static let errInvalidParams = "ERR_INVALID_PARAMS"
    static let errSdkNotInitialized = "ERR_SDK_NOT_INITIALIZED"
    static let errLicenseRevoked = "ERR_SDK_LICENSE_REVOKED"
    static let errMissingHost = "ERR_MISSING_HOST"
    static let errMissingExportResult = "ERR_MISSING_EXPORT_RESULT"
    
    static let inputParamToken = "token"
    static let inputParamFeaturesConfig = "featuresConfig"
    static let inputParamScreen = "screen"
    static let inputParamVideoSources = "videoSources"
    
    static let screenCamera = "camera"
    static let screenPip = "pip"
    static let screenTrimmer = "trimmer"
    
    static let argExportedVideoSources = "exportedVideoSources"
    static let argExportedPreview = "exportedPreview"
    static let argExportedMeta = "exportedMeta"
    
    static let errMessageSdkNotInitialized = """
        Failed to initialize SDK!!!
        The license token is incorrect: empty or truncated.
        Please check the license token and try again.
    """
    static let errMessageLicenseRevoked = """
        WARNING!!!
        YOUR LICENSE TOKEN EITHER EXPIRED OR REVOKED!
        Please contact Banuba
    """
    static let errMessageInvalidParams = "Method started with invalid params!"
    static let errMessageMissingToken = "Missing license token: set correct value to \(inputParamToken) input params"
    static let errMessageMissingScreen = "Missing screen: set correct value to \(inputParamScreen) input params"
    static let errMessageUnknownMethod = "Unknown method name"
    static let errMessageInvalidPiPVideo = "Missing pip video source: set correct value to \(inputParamVideoSources) input params"
    static let errMessageInvalidTrimmerVideo = "Missing trimmer video sources: set correct value to \(inputParamVideoSources) input params"
    static let errMessageUnknownScreen = "Invalid inputParams value: available values(\(screenCamera), \(screenPip), \(screenTrimmer))"
    
    static let errMessageMissingExportResult =
    "Missing export result: video export has not been completed successfully. Please try again"
    
    static let errMessageMissingConfigParams =
    "❌ Missing or invalid config: \(inputParamFeaturesConfig)"
    
    static let errMessageMissingHost = "Missing host ViewController to start video editor"
    
    var emptyFeaturesConfig : FeaturesConfig {
        return FeaturesConfig(
            aiCaptions: nil,
            aiClipping: nil,
            audioBrowser: AudioBrowser(
                source: "local",
                params: nil
            ),
            editorConfig: EditorConfig(
                enableVideoAspectFill: true
            ),
            draftConfig: DraftConfig(
                option: "enable"
            ),
            gifPickerConfig: nil
        )
    }
}

extension VideoEditorConfig {
    // Tag
    static let featuresConfigTag = "Features Config"
    
    // Features config params
    static let featuresConfigAudioBrowserSourceSoundstripe = "soundstripe"
    static let featuresConfigAudioBrowserSourceMubert = "mubert"
    static let featuresConfigAudioBrowserSourceLocal = "local"

    // Draft Configs
    static let featuresConfigDraftConfigOptionAskToSave = "askToSave"
    static let featuresConfigDraftConfigOptionСloseOnSave = "closeOnSave"
    static let featuresConfigDraftConfigOptionAuto = "auto"
    static let featuresConfigDraftConfigOptionDisabled = "disabled"
    
    //Editor Configs
    static let featuresConfigEnableVideoAspectFill = "enableVideoAspectFill"
    
    // Unknown params
    static let featuresConfigUnknownParams = "Undefined"
}
