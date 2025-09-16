package com.videoeditorreactnative

import android.net.Uri
import com.banuba.sdk.core.data.TrackData
import java.util.UUID

internal data class AudioData(
    val id: String,
    val title: String,
    val subtitle: String,
    val localUrl: String,
) {
    fun getTrackData(): TrackData {
        return TrackData(
            id = UUID.fromString(id),
            title = title,
            subtitle = subtitle,
            localUri = Uri.parse(localUrl)
        )
    }
}