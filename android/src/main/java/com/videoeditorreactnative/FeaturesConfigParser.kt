package com.videoeditorreactnative

import android.util.Log
import org.json.JSONException
import org.json.JSONObject

internal fun parseFeaturesConfig(rawConfigParams: String?): FeaturesConfig =
    if (rawConfigParams.isNullOrEmpty()) {
        defaultFeaturesConfig
    } else {
        try {
            val featuresConfigObject = JSONObject(rawConfigParams)
            FeaturesConfig(
                featuresConfigObject.extractAiClipping(),
                featuresConfigObject.extractAiCaptions(),
                featuresConfigObject.extractAudioBrowser(),
                featuresConfigObject.extractEditorConfig(),
                featuresConfigObject.extractDraftsConfig(),
                featuresConfigObject.extractGifPickerConfig()
            )
        } catch (e: JSONException) {
            defaultFeaturesConfig
        }
    }

private fun JSONObject.extractAiClipping(): AiClipping? {
    return try {
        this.optJSONObject(FEATURES_CONFIG_AI_CLIPPING)?.let { json ->
            AiClipping(
                audioDataUrl = json.optString(FEATURES_CONFIG_AI_CLIPPING_AUDIO_DATA_URL),
                audioTracksUrl = json.optString(FEATURES_CONFIG_AI_CLIPPING_AUDIO_TRACK_URL)
            )
        }
    } catch (e: JSONException) {
        Log.w(TAG, "Missing AiClipping params", e)
        null
    }
}

private fun JSONObject.extractAiCaptions(): AiCaptions? {
    return try {
        this.optJSONObject(FEATURES_CONFIG_AI_CAPTIONS)?.let { json ->
            AiCaptions(
                uploadUrl = json.optString(FEATURES_CONFIG_AI_CAPTIONS_UPLOAD_URL),
                transcribeUrl = json.optString(FEATURES_CONFIG_AI_CAPTIONS_TRANSCRIBE_URL),
                apiKey = json.optString(FEATURES_CONFIG_AI_CAPTIONS_API_KEY)
            )
        }
    } catch (e: JSONException) {
        Log.w(TAG, "Missing AiCaptions params", e)
        null
    }
}

private fun JSONObject.extractAudioBrowser(): AudioBrowser =
    try {
        this.optJSONObject(FEATURES_CONFIG_AUDIO_BROWSER)?.let { json ->
            AudioBrowser(
                source = json.optString(FEATURES_CONFIG_AUDIO_BROWSER_SOURCE),
                params = json.optJSONObject(FEATURES_CONFIG_AUDIO_BROWSER_PARAMS)
            )
        }
    } catch (e: JSONException) {
        Log.w(TAG, "Missing Audio Browser params", e)
        defaultAudioBrowser
    } ?: defaultAudioBrowser

private fun JSONObject.extractEditorConfig(): EditorConfig =
    try {
        this.optJSONObject(FEATURES_CONFIG_EDITOR_CONFIG)?.let { json ->
            EditorConfig(
                enableVideoAspectFill = json.optBoolean(
                    FEATURES_CONFIG_EDITOR_CONFIG_ENABLE_VIDEO_ASPECT_FILL
                )
            )
        }
    } catch (e: JSONException) {
        Log.w(TAG, "Missing Editor Config params", e)
        defaultEditorConfig
    } ?: defaultEditorConfig

private fun JSONObject.extractDraftsConfig(): DraftsConfig =
    try {
        this.optJSONObject(FEATURES_CONFIG_DRAFTS_CONFIG)?.let { json ->
            DraftsConfig(
                option = json.optString(FEATURES_CONFIG_DRAFTS_CONFIG_OPTION)
            )
        }
    } catch (e: JSONException) {
        Log.w(TAG, "Missing Draft Config params", e)
        defaultDraftsConfig
    } ?: defaultDraftsConfig

private fun JSONObject.extractGifPickerConfig(): GifPickerConfig? {
    return try {
        this.optJSONObject(FEATURES_CONFIG_GIF_PICKER_CONFIG)?.let { json ->
            GifPickerConfig(
                giphyApiKey = json.optString(FEATURES_CONFIG_GIF_PICKER_CONFIG_API_KEY)
            )
        }
    } catch (e: JSONException) {
        Log.w(TAG, "Missing Gif Picker Config params", e)
        null
    }
}
