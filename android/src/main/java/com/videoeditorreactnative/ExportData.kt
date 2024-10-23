package com.videoeditorreactnative

import com.banuba.sdk.core.VideoResolution
import com.banuba.sdk.ve.effects.watermark.WatermarkAlignment
import com.banuba.sdk.core.ext.toPx
import java.util.Date

internal data class ExportData(
    val exportedVideos: List<ExportedVideo> = listOf(defaultExportedVideo),
    val watermark: Watermark? = null,
)

internal data class ExportedVideo(
    val fileName: String,
    val videoResolution: String,
    val useHevcIfPossible: Boolean
) {
    internal fun videoResolutionValue(): VideoResolution {
        return when (this.videoResolution) {
            EXPORTED_VIDEOS_VIDEO_RESOLUTION_VGA360p -> VideoResolution.Exact.VGA360
            EXPORTED_VIDEOS_VIDEO_RESOLUTION_VGA480p -> VideoResolution.Exact.VGA480
            EXPORTED_VIDEOS_VIDEO_RESOLUTION_QHD540p -> VideoResolution.Exact.QHD540
            EXPORTED_VIDEOS_VIDEO_RESOLUTION_HD720p -> VideoResolution.Exact.HD
            EXPORTED_VIDEOS_VIDEO_RESOLUTION_FHD1080p -> VideoResolution.Exact.FHD
            EXPORTED_VIDEOS_VIDEO_RESOLUTION_QHD1440p -> VideoResolution.Exact.QHD
            EXPORTED_VIDEOS_VIDEO_RESOLUTION_UHD2160p -> VideoResolution.Exact.UHD
            EXPORTED_VIDEOS_VIDEO_RESOLUTION_ORIGINAL -> VideoResolution.Original
            else -> VideoResolution.Auto
        }
    }
}

internal val defaultExportedVideo: ExportedVideo = ExportedVideo(
    fileName = "export_${dateTimeFormatter.format(Date())}",
    videoResolution = EXPORTED_VIDEOS_VIDEO_RESOLUTION_AUTO,
    useHevcIfPossible = true
)

internal data class Watermark(
    val imagePath: String?,
    val alignment: String?
) {
    internal fun alignmentValue(): WatermarkAlignment {
        return when (this.alignment) {
            EXPORT_DATA_WATERMARK_ALIGNMENT_TOP_LEFT -> WatermarkAlignment.TopLeft(
                marginLeftPx = 16.toPx
            )
            EXPORT_DATA_WATERMARK_ALIGNMENT_TOP_RIGHT -> WatermarkAlignment.TopRight(
                marginRightPx = 16.toPx
            )
            EXPORT_DATA_WATERMARK_ALIGNMENT_BOTTOM_LEFT -> WatermarkAlignment.BottomLeft(
                marginLeftPx = 16.toPx
            )

            else -> WatermarkAlignment.BottomRight(marginRightPx = 16.toPx)
        }
    }
}
