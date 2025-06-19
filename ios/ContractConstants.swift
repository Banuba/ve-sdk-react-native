
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
    static let inputParamExportData = "exportData"
    static let inputParamScreen = "screen"
    static let inputParamVideoSources = "videoSources"
    static let argExportedAudioMeta = "exportedAudioMeta"

    static let screenCamera = "camera"
    static let screenPip = "pip"
    static let screenTrimmer = "trimmer"
    static let screenAiClipping = "aiClipping"
    static let screenTemplates = "templates"

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
        static let errMessageMissingExportData =
    "❌ Missing or invalid config: \(inputParamExportData)"

    static let errMessageMissingHost = "Missing host ViewController to start video editor"

    var defaultFeaturesConfig : FeaturesConfig {
        return FeaturesConfig(
            captions: nil,
            aiClipping: nil,
            audioBrowser: AudioBrowser(
                source: "local",
                params: nil
            ),
            cameraConfig: CameraConfig(
              supportsBeauty: true,
              supportsColorEffects: true,
              supportsMasks: true,
              recordModes: [
                  VideoEditorConfig.featuresConfigCameraConfigRecordModeVideo,
                  VideoEditorConfig.featuresConfigCameraConfigRecordModePhoto
              ]
            ),
            editorConfig: EditorConfig(
              enableVideoAspectFill: true,
              supportsVisualEffects: true,
              supportsColorEffects: true
            ),
            draftsConfig: DraftsConfig(
                option: "enable"
            ),
            gifPickerConfig: nil,
            videoDurationConfig: VideoDurationConfig(
                maxTotalVideoDuration: 120.0,
                videoDurations: [60.0, 30.0, 15.0]
            ),
            enableEditorV2: false,
            processPictureExternally: false
        )
    }

    // Default Export Config
    var defaultExportData : ExportData {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH-mm-ss.SSS"

        return ExportData(exportedVideos: [
            ExportedVideo(
            fileName: "export_\(dateFormatter.string(from: Date()))",
            videoResolution: "auto",
            useHevcIfPossible: true
        )
        ],
        watermark: nil)
    }
}

extension VideoEditorConfig {
    // Features config params
    static let featuresConfigAudioBrowserSourceSoundstripe = "soundstripe"
    static let featuresConfigAudioBrowserSourceMubert = "mubert"
    static let featuresConfigAudioBrowserSourceLocal = "local"
    static let featuresConfigAudioBrowserSourceBanubaMusic = "banubaMusic"
    static let featuresConfigAudioBrowserSourceDisabled = "disabled"

    // Draft Configs
    static let featuresConfigDraftsConfigOptionAskToSave = "askToSave"
    static let featuresConfigDraftsConfigOptionСloseOnSave = "closeOnSave"
    static let featuresConfigDraftsConfigOptionAuto = "auto"
    static let featuresConfigDraftsConfigOptionDisabled = "disabled"

    //Record Mode
    static let featuresConfigCameraConfigRecordModeVideo = "video"
    static let featuresConfigCameraConfigRecordModePhoto = "photo"

    //Editor Configs
    static let featuresConfigEnableVideoAspectFill = "enableVideoAspectFill"

    // Unknown params
    static let featuresConfigUnknownParams = "Undefined"
}

extension ExportData {
    // Video Resolutions
    static let exportedVideoVideoResolutionsHD720p = "hd720p"
    static let exportedVideoVideoResolutionsVGA360p = "vga360p"
    static let exportedVideoVideoResolutionsVGA480p = "vga480p"
    static let exportedVideoVideoResolutionsQHD540p = "qhd540p"
    static let exportedVideoVideoResolutionsFHD1080p = "fhd1080p"
    static let exportedVideoVideoResolutionsQHD1440p = "qhd1440p"
    static let exportedVideoVideoResolutionsUHD2160p = "uhd2160p"
    static let exportedVideoVideoResolutionsAuto = "auto"
    static let exportedVideoVideoResolutionsOriginal = "original"

    // Watermark Alignment
    static let exportDataWatermarkAlignmentTopLeft = "topLeft"
    static let exportDataWatermarkAlignmentTopRight = "topRight"
    static let exportDataWatermarkAlignmentBottomLeft = "bottomLeft"
    static let exportDataWatermarkAlignmentBottomRight = "bottomRight"
}

