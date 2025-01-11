package com.videoeditorreactnative

import com.banuba.sdk.core.data.TrackData
import androidx.fragment.app.Fragment
import com.banuba.sdk.audiobrowser.domain.AudioBrowserMusicProvider
import com.banuba.sdk.audiobrowser.soundstripe.SoundstripeProvider
import com.banuba.sdk.audiobrowser.feedfm.BanubaMusicProvider
import com.banuba.sdk.core.ui.ContentFeatureProvider
import com.banuba.sdk.core.domain.DraftConfig
import org.json.JSONObject

internal data class FeaturesConfig(
    val aiClipping: AiClipping? = null,
    val aiCaptions: AiCaptions? = null,
    val audioBrowser: AudioBrowser = defaultAudioBrowser,
    val editorConfig: EditorConfig = defaultEditorConfig,
    val draftsConfig: DraftsConfig = defaultDraftsConfig,
    val gifPickerConfig: GifPickerConfig? = null,
    val processPictureExternally: Boolean = false,
)

internal data class AiClipping(
    val audioDataUrl: String,
    val audioTracksUrl: String
)

internal data class AiCaptions(
    val uploadUrl: String,
    val transcribeUrl: String,
    val apiKey: String
)

internal data class AudioBrowser(
    val source: String,
    val params: JSONObject?
) {
    internal fun value(): ContentFeatureProvider<TrackData, Fragment> {
        return when (this.source) {
            FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_SOUNDSTRIPE -> SoundstripeProvider()
            FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_BANUBA_MUSIC -> BanubaMusicProvider()
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

internal data class EditorConfig(
    val enableVideoAspectFill: Boolean
)

internal val defaultEditorConfig = EditorConfig(
    enableVideoAspectFill = true
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
