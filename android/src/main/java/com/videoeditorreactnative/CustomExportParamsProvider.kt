package com.videoeditorreactnative

import android.net.Uri
import android.util.Log
import androidx.core.net.toFile
import com.banuba.sdk.core.ext.toPx
import com.banuba.sdk.export.data.ExportParams
import com.banuba.sdk.export.data.ExportParamsProvider
import com.banuba.sdk.ve.domain.VideoRangeList
import com.banuba.sdk.ve.effects.music.MusicEffect
import com.banuba.sdk.ve.effects.watermark.WatermarkBuilder
import com.banuba.sdk.ve.effects.Effects
import com.banuba.sdk.ve.effects.watermark.WatermarkAlignment
import com.banuba.sdk.ve.ext.withWatermark


internal class CustomExportParamsProvider(
    private val exportDir: Uri,
    private val watermarkBuilder: WatermarkBuilder,
    private val exportData: ExportData
) : ExportParamsProvider {

    override fun provideExportParams(
        effects: Effects,
        videoRangeList: VideoRangeList,
        musicEffects: List<MusicEffect>,
        videoVolume: Float
    ): List<ExportParams> {
        val exportSessionDir = exportDir.toFile().apply {
            deleteRecursively()
            mkdirs()
        }

        val exportVideoList = exportData.exportedVideos.map { exportedVideo ->
            ExportParams.Builder(exportedVideo.videoResolutionValue())
                .effects(provideEffects(effects))
                .fileName(exportedVideo.fileName)
                .videoRangeList(videoRangeList)
                .destDir(exportSessionDir)
                .musicEffects(musicEffects)
                .volumeVideo(videoVolume)
                .useHevcIfPossible(exportedVideo.useHevcIfPossible)
                .build()
        }

        return exportVideoList
    }

    private fun provideEffects(effects: Effects): Effects {
        return if (exportData.watermark == null){
            effects
        } else {
            effects.withWatermark(watermarkBuilder, exportData.watermark.alignmentValue())
        }
    }
}