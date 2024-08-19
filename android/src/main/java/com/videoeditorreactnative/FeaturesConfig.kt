package com.videoeditorreactnative

import org.json.JSONObject

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
)

internal val defaultDraftsConfig = DraftsConfig(
    option = "askToSave"
)

internal data class GifPickerConfig(
    val giphyApiKey: String
)
