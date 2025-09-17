package com.videoeditorreactnative

import com.banuba.sdk.core.data.TrackData
import androidx.fragment.app.Fragment
import com.banuba.sdk.audiobrowser.domain.AudioBrowserMusicProvider
import com.banuba.sdk.audiobrowser.soundstripe.SoundstripeProvider
import com.banuba.sdk.audiobrowser.api.BanubaMusicProvider
import com.banuba.sdk.core.ui.SimpleMusicTrackProvider
import com.banuba.sdk.core.ui.ContentFeatureProvider
import com.banuba.sdk.core.domain.DraftConfig
import com.banuba.sdk.cameraui.ui.RecordMode
import org.json.JSONObject
import org.json.JSONArray

internal data class FeaturesConfig(
    val aiClipping: AiClipping? = null,
    val captions: Captions? = null,
    val audioBrowser: AudioBrowser = defaultAudioBrowser,
    val cameraConfig: CameraConfig = defaultCameraConfig,
    val editorConfig: EditorConfig = defaultEditorConfig,
    val coverConfig: CoverConfig = defaultCoverConfig,
    val draftsConfig: DraftsConfig = defaultDraftsConfig,
    val gifPickerConfig: GifPickerConfig? = null,
    val videoDurationConfig: VideoDurationConfig = defaultVideoDurationConfig,
    val enableEditorV2: Boolean = true,
    val processPictureExternally: Boolean = false,
)

internal data class AiClipping(
    val audioDataUrl: String,
    val audioTracksUrl: String
)

internal data class Captions(
    val uploadUrl: String?,
    val transcribeUrl: String?,
    val apiKey: String?,
    val apiV2Key: String?
)

internal data class AudioBrowser(
    val source: String,
    val params: JSONObject?
) {
    internal fun value(): ContentFeatureProvider<TrackData, Fragment> {
        return when (this.source) {
            FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_SOUNDSTRIPE -> SoundstripeProvider()
            FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_BANUBA_MUSIC -> BanubaMusicProvider()
            FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_DISABLED -> SimpleMusicTrackProvider()
            else -> {
                AudioBrowserMusicProvider()
            }
        }
    }
}

internal val defaultAudioBrowser = AudioBrowser(
    source = FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_LOCAL,
    params = null
)

internal data class CameraConfig(
    val supportsBeauty: Boolean,
    val supportsColorEffects: Boolean,
    val supportsMasks: Boolean,
    val recordModes: Set<RecordMode>,
    val autoStartLocalMask: String?
)

internal val defaultCameraConfig = CameraConfig(
    supportsBeauty = true,
    supportsColorEffects = true,
    supportsMasks = true,
    recordModes = setOf(RecordMode.Video, RecordMode.Photo),
    autoStartLocalMask = null
)

internal data class EditorConfig(
    val enableVideoAspectFill: Boolean,
    val supportsColorEffects: Boolean,
    val supportsVisualEffects: Boolean,
    var supportsVoiceOver: Boolean,
    var supportsAudioEditing: Boolean
)

internal val defaultEditorConfig = EditorConfig(
    enableVideoAspectFill = true,
    supportsColorEffects = true,
    supportsVisualEffects = true,
    supportsVoiceOver = true,
    supportsAudioEditing = true,
)

internal data class CoverConfig(
    val supportsCoverScreen: Boolean
)

internal val defaultCoverConfig = CoverConfig(
    supportsCoverScreen = true
)

internal data class DraftsConfig(
    val option: String
) {
    internal fun value(): DraftConfig {
        return when (this.option) {
            FEATURES_CONFIG_DRAFTS_CONFIG_AUTO -> DraftConfig.ENABLED_SAVE_BY_DEFAULT
            FEATURES_CONFIG_DRAFTS_CONFIG_CLOSE_ON_SAVE -> DraftConfig.ENABLED_ASK_IF_SAVE_NOT_EXPORT
            FEATURES_CONFIG_DRAFTS_CONFIG_DISABLED -> DraftConfig.DISABLED
            else -> DraftConfig.ENABLED_ASK_TO_SAVE
        }
    }
}

internal val defaultDraftsConfig = DraftsConfig(
    option = "askToSave"
)

internal data class GifPickerConfig(
    val giphyApiKey: String
)

internal data class VideoDurationConfig(
  val maxTotalVideoDuration: Long,
  val videoDurations: List<Long>,
)
internal val defaultVideoDurationConfig = VideoDurationConfig(
  maxTotalVideoDuration = 120000,
  videoDurations = listOf(60000, 30000, 15000),
)
