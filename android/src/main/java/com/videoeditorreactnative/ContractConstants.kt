package com.videoeditorreactnative

import androidx.core.os.bundleOf
import android.os.Bundle
import com.banuba.sdk.veui.data.captions.CaptionsApiService
import android.util.Log
import java.text.SimpleDateFormat

// Tags
internal const val TAG = "VideoEditorPlugin"

internal const val TAG_FEATURES_CONFIG = "FeaturesConfig"

// Input params
internal const val INPUT_PARAM_SCREEN = "screen"
internal const val INPUT_PARAM_FEATURES_CONFIG = "featuresConfig"
internal const val INPUT_PARAM_EXPORT_DATA = "exportData"
internal const val INPUT_PARAM_VIDEO_SOURCES = "videoSources"
internal const val INPUT_PARAM_TRACK_DATA = "trackData"

// Exported params
internal const val EXPORTED_VIDEO_SOURCES = "exportedVideoSources"
internal const val EXPORTED_PREVIEW = "exportedPreview"
internal const val EXPORTED_META = "exportedMeta"
internal const val EXPORTED_AUDIO_META = "exportedAudioMeta"

// Screens
internal const val SCREEN_CAMERA = "camera"
internal const val SCREEN_PIP = "pip"
internal const val SCREEN_TRIMMER = "trimmer"
internal const val SCREEN_AICLIPPING = "aiClipping"
internal const val SCREEN_TEMPLATES = "templates"
internal const val SCREEN_DRAFTS = "drafts"
internal const val SCREEN_EDITOR = "editor"

// Features config params
internal const val FEATURES_CONFIG_CAPTIONS = "captions"
internal const val FEATURES_CONFIG_CAPTIONS_UPLOAD_URL = "uploadUrl"
internal const val FEATURES_CONFIG_CAPTIONS_TRANSCRIBE_URL = "transcribeUrl"
internal const val FEATURES_CONFIG_CAPTIONS_API_KEY = "apiKey"
internal const val FEATURES_CONFIG_CAPTIONS_API_V2_KEY = "apiV2Key"

internal const val FEATURES_CONFIG_AI_CLIPPING = "aiClipping"
internal const val FEATURES_CONFIG_AI_CLIPPING_AUDIO_DATA_URL = "audioDataUrl"
internal const val FEATURES_CONFIG_AI_CLIPPING_AUDIO_TRACK_URL = "audioTracksUrl"

internal const val FEATURES_CONFIG_AUDIO_BROWSER = "audioBrowser"
internal const val FEATURES_CONFIG_AUDIO_BROWSER_SOURCE = "source"
internal const val FEATURES_CONFIG_AUDIO_BROWSER_PARAMS = "params"

internal const val FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_LOCAL = "local"
internal const val FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_MUBERT = "mubert"
internal const val FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_SOUNDSTRIPE = "soundstripe"
internal const val FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_BANUBA_MUSIC = "banubaMusic"
internal const val FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_DISABLED = "disabled"

internal const val FEATURES_CONFIG_AUDIO_BROWSER_PARAMS_MUBERT_LICENCE = "mubertLicence"
internal const val FEATURES_CONFIG_AUDIO_BROWSER_PARAMS_MUBERT_TOKEN = "mubertToken"

internal const val FEATURES_CONFIG_CAMERA_CONFIG = "cameraConfig"
internal const val FEATURES_CONFIG_CAMERA_CONFIG_SUPPORTS_BEAUTY = "supportsBeauty"
internal const val FEATURES_CONFIG_CAMERA_CONFIG_SUPPORTS_COLOR_EFFECTS = "supportsColorEffects"
internal const val FEATURES_CONFIG_CAMERA_CONFIG_SUPPORTS_MASKS = "supportsMasks"
internal const val FEATURES_CONFIG_CAMERA_CONFIG_AUTOSTART_LOCAL_MASK = "autoStartLocalMask"
internal const val FEATURES_CONFIG_CAMERA_RECORD_MODES = "recordModes"
internal const val FEATURES_CONFIG_CAMERA_RECORD_MODES_VIDEO = "video"
internal const val FEATURES_CONFIG_CAMERA_RECORD_MODES_PHOTO = "photo"

internal const val FEATURES_CONFIG_EDITOR_CONFIG = "editorConfig"
internal const val FEATURES_CONFIG_EDITOR_CONFIG_ENABLE_VIDEO_ASPECT_FILL = "enableVideoAspectFill"
internal const val FEATURES_CONFIG_EDITOR_CONFIG_SUPPORTS_COLOR_EFFECTS = "supportsColorEffects"
internal const val FEATURES_CONFIG_EDITOR_CONFIG_SUPPORTS_VISUAL_EFFECTS = "supportsVisualEffects"
internal const val FEATURES_CONFIG_EDITOR_CONFIG_SUPPORTS_VOICE_OVER = "supportsVoiceOver"
internal const val FEATURES_CONFIG_EDITOR_CONFIG_SUPPORTS_AUDIO_EDITING = "supportsAudioEditing"

internal const val FEATURES_CONFIG_COVER_CONFIG = "coverConfig"
internal const val FEATURES_CONFIG_COVER_CONFIG_SUPPORTS_COVER_SCREEN = "supportsCoverScreen"

internal const val FEATURES_CONFIG_DRAFTS_CONFIG = "draftsConfig"
internal const val FEATURES_CONFIG_DRAFTS_CONFIG_OPTION = "option"

internal const val FEATURES_CONFIG_DRAFTS_CONFIG_ASK_TO_SAVE = "askToSave"
internal const val FEATURES_CONFIG_DRAFTS_CONFIG_CLOSE_ON_SAVE = "closeOnSave"
internal const val FEATURES_CONFIG_DRAFTS_CONFIG_AUTO = "auto"
internal const val FEATURES_CONFIG_DRAFTS_CONFIG_DISABLED = "disabled"

internal const val FEATURES_CONFIG_GIF_PICKER_CONFIG = "gifPickerConfig"
internal const val FEATURES_CONFIG_GIF_PICKER_CONFIG_API_KEY = "giphyApiKey"

// Video Duration Config
internal const val FEATURES_CONFIG_VIDEO_DURATION_CONFIG = "videoDurationConfig"
internal const val FEATURES_CONFIG_VIDEO_DURATION_CONFIG_MAX_TOTAL_VIDEO_DURATION = "maxTotalVideoDuration"
internal const val FEATURES_CONFIG_VIDEO_DURATION_CONFIG_VIDEO_DURATIONS = "videoDurations"

// Editor V2 Config
internal const val FEATURES_CONFIG_ENABLE_EDITOR_V2 = "enableEditorV2"
internal const val FEATURES_CONFIG_EXTRA_USE_EDITOR_V2 = "EXTRA_USE_EDITOR_V2"

internal const val FEATURES_CONFIG_PROCESS_PICTURE_EXTERNALLY = "processPictureExternally"

internal const val EXPORT_DATA_EXPORTED_VIDEOS = "exportedVideos"

// Exported video params
internal const val EXPORTED_VIDEOS_FILE_NAME = "fileName"

internal const val EXPORTED_VIDEOS_HEVC_CODEC = "useHevcIfPossible"

internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION = "videoResolution"
internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION_VGA360p = "vga360p"
internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION_VGA480p = "vga480p"
internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION_QHD540p = "qhd540p"
internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION_HD720p = "hd720p"
internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION_FHD1080p = "fhd1080p"
internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION_QHD1440p = "qhd1440p"
internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION_UHD2160p = "uhd2160p"
internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION_AUTO = "auto"
internal const val EXPORTED_VIDEOS_VIDEO_RESOLUTION_ORIGINAL = "original"

internal const val EXPORT_DATA_WATERMARK = "watermark"
internal const val EXPORT_DATA_WATERMARK_IMAGE_PATH = "imagePath"
internal const val EXPORT_DATA_WATERMARK_ALIGNMENT = "alignment"

internal const val EXPORT_DATA_WATERMARK_ALIGNMENT_TOP_LEFT = "topLeft"
internal const val EXPORT_DATA_WATERMARK_ALIGNMENT_TOP_RIGHT = "topRight"
internal const val EXPORT_DATA_WATERMARK_ALIGNMENT_BOTTOM_LEFT = "bottomLeft"
internal const val EXPORT_DATA_WATERMARK_ALIGNMENT_BOTTOM_RIGHT = "bottomRight"

internal const val TRACK_DATA_ID = "id"
internal const val TRACK_DATA_TITLE = "title"
internal const val TRACK_DATA_SUBTITLE = "subtitle"
internal const val TRACK_DATA_LOCAL_URL = "localUrl"

// Errors
internal const val ERR_CODE_SDK_NOT_INITIALIZED = "ERR_SDK_NOT_INITIALIZED"
internal const val ERR_CODE_SDK_LICENSE_REVOKED = "ERR_SDK_LICENSE_REVOKED"
internal const val ERR_MISSING_HOST = "ERR_MISSING_HOST"
internal const val ERR_INVALID_PARAMS = "ERR_INVALID_PARAMS"
internal const val ERR_MISSING_EXPORT_RESULT = "ERR_MISSING_EXPORT_RESULT"
internal const val ERR_VIDEO_EXPORT_CANCEL = "ERR_VIDEO_EXPORT_CANCEL"
internal const val ERR_UNKNOWN_REQUEST_CODE = "ERR_UNKNOWN_REQUEST_CODE"

internal const val ERR_MESSAGE_SDK_NOT_INITIALIZED = """
    Failed to initialize SDK!!!
    The license token is incorrect: empty or truncated.
    Please check the license token and try again.
"""
internal const val ERR_MESSAGE_LICENSE_REVOKED = """
    WARNING!!!
    YOUR LICENSE TOKEN EITHER EXPIRED OR REVOKED!
    Please contact Banuba
"""

internal const val ERR_MESSAGE_MISSING_TOKEN =
    "Missing license token: pass correct license token value"

internal const val ERR_MESSAGE_MISSING_SCREEN =
    "Missing screen: set correct value to $INPUT_PARAM_SCREEN input params"

internal const val ERR_MESSAGE_MISSING_PIP_VIDEO =
    "Missing pip video source: set correct value to $INPUT_PARAM_VIDEO_SOURCES input params"

internal const val ERR_MESSAGE_MISSING_TRIMMER_VIDEO_SOURCES =
    "Missing trimmer video sources: set correct value to $INPUT_PARAM_VIDEO_SOURCES input params"

internal const val ERR_MESSAGE_MISSING_EDITOR_VIDEO_SOURCES =
    "Missing editor video sources: set correct value to $INPUT_PARAM_VIDEO_SOURCES input params"

internal const val ERR_MESSAGE_UNKNOWN_SCREEN =
    "Invalid $INPUT_PARAM_SCREEN value: available values($SCREEN_CAMERA, $SCREEN_PIP, $SCREEN_TRIMMER, $SCREEN_EDITOR, $SCREEN_DRAFTS, $SCREEN_TEMPLATES)"

internal const val ERR_MESSAGE_MISSING_EXPORT_RESULT =
    "Missing export result: video export has not been completed successfully. Please try again"

internal const val ERR_MESSAGE_MISSING_HOST = "Missing host Activity to start video editor"

internal const val ERR_MESSAGE_VIDEO_EXPORT_CANCEL = "The user has canceled video editing flow!"

internal const val ERR_MESSAGE_UNKNOWN_REQUEST_CODE = "Unknown request code"

internal const val MESSAGE_MISSING_EXPORT_DATA =
    "Export data is not set. Default implementation will be used. Input export config: $INPUT_PARAM_EXPORT_DATA"

internal const val MESSAGE_MISSING_WATERMARK_IMAGE_PATH =
    "Watermark image is no set. Watermark will not be used."

//Prepare Extras from captions
internal fun prepareExtras(featuresConfig: FeaturesConfig): Bundle {
  val bundle = Bundle()
  featuresConfig.captions?.let { params ->
    if (params.apiV2Key != "null") {
        bundle.putString(CaptionsApiService.ARG_API_KEY_V2, params.apiV2Key)
    } else {
        bundle.putString(CaptionsApiService.ARG_CAPTIONS_UPLOAD_URL, params.uploadUrl)
        bundle.putString(CaptionsApiService.ARG_CAPTIONS_TRANSCRIBE_URL, params.transcribeUrl)
        bundle.putString(CaptionsApiService.ARG_API_KEY, params.apiKey)
    }
  }
  bundle.putBoolean(FEATURES_CONFIG_EXTRA_USE_EDITOR_V2, featuresConfig.enableEditorV2)
  return bundle
}

// Date time formatter
val dateTimeFormatter = SimpleDateFormat("yyyy-MM-dd'T'HH-mm-ss.SSS")

// Empty Feature Config
internal val defaultFeaturesConfig = FeaturesConfig()
internal val defaultExportData = ExportData()
