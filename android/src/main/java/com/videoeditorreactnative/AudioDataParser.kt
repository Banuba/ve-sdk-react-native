package com.videoeditorreactnative

import android.util.Log
import org.json.JSONException
import org.json.JSONObject

internal fun parseAudioData(rawAudioData: String?): AudioData? =
    if (rawAudioData.isNullOrEmpty()) {
        null
    } else {
        try {
            val audioDataObject = JSONObject(rawAudioData)
            AudioData(
                id = audioDataObject.optString(AUDIO_DATA_ID),
                title = audioDataObject.optString(AUDIO_DATA_TITLE), 
                subtitle = audioDataObject.optString(AUDIO_DATA_SUBTITLE),
                localUrl = audioDataObject.optString(AUDIO_DATA_LOCAL_URL),
            )
        } catch (e: JSONException) {
            Log.w(TAG, "Missing Audio Data Param", e)
            null
        }
    }