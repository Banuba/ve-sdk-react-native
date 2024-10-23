package com.videoeditorreactnative

import android.util.Log
import org.json.JSONException
import org.json.JSONObject

internal fun parseExportData(rawExportData: String?): ExportData? =
    if (rawExportData.isNullOrEmpty()) {
        null
    } else {
        try {
            val exportDataObject = JSONObject(rawExportData)
            ExportData(
                exportDataObject.extractExportedVideos(),
                exportDataObject.extractWatermark()
            )
        } catch (e: JSONException) {
            Log.w(TAG, "Missing Export Param", e)
            null
        }
    }

internal fun JSONObject.extractExportedVideos(): List<ExportedVideo> {
    return try {
        val jsonArray = this.getJSONArray(EXPORT_DATA_EXPORTED_VIDEOS)
        val exportedVideos = mutableListOf<ExportedVideo>()

        for (i in 0 until jsonArray.length()) {
            val exportConfigObject = jsonArray.getJSONObject(i)

            val exportedVideo = ExportedVideo(
                fileName = exportConfigObject.optString(EXPORTED_VIDEOS_FILE_NAME),
                videoResolution = exportConfigObject.optString(EXPORTED_VIDEOS_VIDEO_RESOLUTION),
                useHevcIfPossible = exportConfigObject.optBoolean(EXPORTED_VIDEOS_HEVC_CODEC, true)
            )

            exportedVideos.add(exportedVideo)
        }
        exportedVideos
    } catch (e: JSONException) {
        Log.w(TAG, "Missing Exported Video params", e)
        defaultExportData.exportedVideos
    }
}

private fun JSONObject.extractWatermark(): Watermark? {
    return try {
        this.optJSONObject(EXPORT_DATA_WATERMARK)?.let { json ->
            Watermark(
                imagePath = json.optString(EXPORT_DATA_WATERMARK_IMAGE_PATH),
                alignment = json.optString(EXPORT_DATA_WATERMARK_ALIGNMENT)
            )
        } ?: null
    } catch (e: JSONException) {
        Log.d(TAG, "Missing Watermark params", e)
        null
    }
}