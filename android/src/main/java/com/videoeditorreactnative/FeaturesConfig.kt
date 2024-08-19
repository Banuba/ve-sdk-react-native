package com.videoeditorreactnative

import org.json.JSONObject
import com.banuba.sdk.core.domain.DraftConfig

internal data class FeaturesConfig(
    val aiClipping: AiClipping? = null,
    val aiCaptions: AiCaptions? = null,
    val audioBrowser: AudioBrowser = defaultAudioBrowser,
    val editorConfig: EditorConfig = defaultEditorConfig,
    val draftsConfig: DraftsConfig = defaultDraftsConfig,
    val gifPickerConfig: GifPickerConfig? = null,
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
)

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
