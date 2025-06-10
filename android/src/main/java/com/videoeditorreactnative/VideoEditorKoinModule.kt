package com.videoeditorreactnative

import android.app.Application
import android.content.Context
import androidx.fragment.app.Fragment
import com.banuba.sdk.export.di.VeExportKoinModule
import com.banuba.sdk.export.data.ExportParamsProvider
import com.banuba.sdk.ve.effects.watermark.WatermarkProvider
import com.banuba.sdk.gallery.di.GalleryKoinModule
import com.banuba.sdk.playback.di.VePlaybackSdkKoinModule
import com.banuba.sdk.ve.di.VeSdkKoinModule
import com.banuba.sdk.ve.flow.di.VeFlowKoinModule
import com.banuba.sdk.veui.di.VeUiSdkKoinModule
import com.banuba.sdk.arcloud.di.ArCloudKoinModule
import com.banuba.sdk.audiobrowser.di.AudioBrowserKoinModule
import com.banuba.sdk.arcloud.data.source.ArEffectsRepositoryProvider
import com.banuba.sdk.audiobrowser.domain.AudioBrowserMusicProvider
import com.banuba.sdk.core.data.TrackData
import com.banuba.sdk.core.ui.ContentFeatureProvider
import com.banuba.sdk.playback.PlayerScaleType
import com.banuba.sdk.core.data.autocut.AutoCutTrackLoader
import com.banuba.sdk.audiobrowser.domain.AiClippingRecommendedSoundProvider
import com.banuba.sdk.audiobrowser.feedfm.AiClippingBanubaMusicTrackLoader
import com.banuba.sdk.audiobrowser.soundstripe.AiClippingSoundstripeTrackLoader
import com.banuba.sdk.ve.data.aiclipping.AiClippingConfig
import com.banuba.sdk.core.domain.DraftConfig
import com.banuba.sdk.cameraui.data.CameraConfig
import com.banuba.sdk.cameraui.ui.RecordMode
import com.banuba.sdk.cameraui.data.CameraRecordingModesProvider
import com.banuba.sdk.veui.data.EditorConfig
import com.banuba.sdk.veui.data.music.MusicEditorConfig
import com.banuba.sdk.veui.data.stickers.GifPickerConfigurations
import com.banuba.sdk.audiobrowser.data.MubertApiConfig
import com.banuba.sdk.core.domain.MediaNavigationProcessor
import com.banuba.sdk.export.data.ExportResult
import com.banuba.sdk.ve.flow.VideoCreationActivity
import com.banuba.sdk.export.data.ExportSessionHelper
import com.banuba.sdk.ve.flow.session.FlowExportSessionHelper
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin
import org.koin.core.qualifier.named
import org.koin.dsl.module
import org.koin.core.module.Module
import android.util.Log
import com.banuba.sdk.core.EditorUtilityManager
import com.banuba.sdk.ve.ext.VideoEditorUtils.getKoin
import org.json.JSONException
import org.koin.core.context.stopKoin
import org.koin.core.error.InstanceCreationException
import android.app.Activity
import android.net.Uri
import android.os.Bundle
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.util.Date

class VideoEditorKoinModule {
  internal fun initialize(application: Context, featuresConfig: FeaturesConfig, exportData: ExportData?) {
    startKoin {
      androidContext(application)
      allowOverride(true)

      // IMPORTANT! order of modules is required
      val modulesList = mutableListOf (
        VeSdkKoinModule().module,
        VeExportKoinModule().module,
        VePlaybackSdkKoinModule().module,
        AudioBrowserKoinModule().module,
        ArCloudKoinModule().module,
        VeUiSdkKoinModule().module,
        VeFlowKoinModule().module,
        GalleryKoinModule().module,
        SampleIntegrationVeKoinModule(featuresConfig, exportData).module,
      )

      if (BuildConfig.ENABLE_FACE_AR) {
        Log.d(TAG, "Effect Player is added")
        try {
          val effectPlayerInstance = Class.forName("com.banuba.sdk.effectplayer.adapter.BanubaEffectPlayerKoinModule")
            .getDeclaredConstructor()
            .newInstance()
          val module = effectPlayerInstance.javaClass.getDeclaredField("module")
            .apply {
              isAccessible = true
            }
            .get(effectPlayerInstance) as? Module
          module?.let {
            modulesList.add(it)
          }
        } catch (e: Exception) {
          Log.w(TAG, "Error while adding the Effect Player Module: ${e.message}")
        }
      }

      modules(modulesList)
    }
  }

    fun releaseVideoEditor() {
      releaseUtilityManager()
      stopKoin()
    }

    private fun releaseUtilityManager() {
      val utilityManager = try {
          getKoin().getOrNull<EditorUtilityManager>()
      } catch (e: InstanceCreationException) {
          Log.w(TAG, "EditorUtilityManager was not initialized!", e)
          null
      }

      utilityManager?.release()
    }
}

/**
 * All dependencies mentioned in this module will override default
 * implementations provided in VE UI SDK.
 * Some dependencies has no default implementations. It means that
 * these classes fully depends on your requirements
 */
private class SampleIntegrationVeKoinModule(featuresConfig: FeaturesConfig, exportData: ExportData?) {

  val module = module {
    single<ArEffectsRepositoryProvider>(createdAtStart = true) {
      ArEffectsRepositoryProvider(
        arEffectsRepository = get(named("backendArEffectsRepository"))
      )
    }
    Log.d(
      TAG_FEATURES_CONFIG,
      "Add $INPUT_PARAM_FEATURES_CONFIG with params: ${featuresConfig}"
    )
    this.applyFeaturesConfig(featuresConfig)

    this.addExportData(exportData)
  }

  private fun Module.applyFeaturesConfig(featuresConfig: FeaturesConfig) {
    this.single<ContentFeatureProvider<TrackData, Fragment>>(
      named("musicTrackProvider")
    ) {
        featuresConfig.audioBrowser.value()
    }

    when (featuresConfig.audioBrowser.source){
      FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_MUBERT -> this.addMubertParams(featuresConfig)
      FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_DISABLED -> this.applyDisabledMusicConfig(featuresConfig)
    }

    featuresConfig.aiClipping?.let { params ->
      factory {
        AiClippingConfig(
          audioDataUrl = params.audioDataUrl,
          audioTracksUrl = params.audioTracksUrl
        )
      }

      factory<ContentFeatureProvider<TrackData, Fragment>>(
        named("recommendedSoundsMusicTrackProvider")
      ) {
        AiClippingRecommendedSoundProvider()
      }

      single<AutoCutTrackLoader> {
        when (featuresConfig.audioBrowser.source) {
          FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_BANUBA_MUSIC -> {
            AiClippingBanubaMusicTrackLoader(
              contentProvider = get()
            )
          }
          else -> {
            AiClippingSoundstripeTrackLoader(
              soundstripeApi = get()
            )
          }
        }
      }
    }

    if (!featuresConfig.editorConfig.enableVideoAspectFill) {
      factory<PlayerScaleType>(named("editorVideoScaleType")) {
        PlayerScaleType.CENTER_INSIDE
      }
    }

    factory<DraftConfig> {
      featuresConfig.draftsConfig.value()
    }

    featuresConfig.gifPickerConfig?.let { params ->
      factory<GifPickerConfigurations> {
        GifPickerConfigurations(
          giphyApiKey = params.giphyApiKey
        )
      }
    }

    single<CameraConfig> {
      CameraConfig(
        maxRecordedTotalVideoDurationMs = featuresConfig.videoDurationConfig.maxTotalVideoDuration,
        videoDurations = featuresConfig.videoDurationConfig.videoDurations,
        supportsExternalMusic = featuresConfig.audioBrowser.source != FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_DISABLED,
        banubaMasksAssetsPath = if (featuresConfig.cameraConfig.supportsMasks) "effects" else null,
        banubaColorEffectsAssetsPath = if (featuresConfig.cameraConfig.supportsColorEffects) "luts" else null,
      )
    }

    single<CameraRecordingModesProvider> {
      object : CameraRecordingModesProvider {
        override var availableModes = featuresConfig.cameraConfig.recordModes
      }
    }

    single <EditorConfig>{
      EditorConfig(
        maxTotalVideoDurationMs = featuresConfig.videoDurationConfig.maxTotalVideoDuration,
        editorSupportsVisualEffects = featuresConfig.editorConfig.supportsVisualEffects,
        editorBanubaColorEffectsAssetsPath = if (featuresConfig.editorConfig.supportsColorEffects) "luts" else null,
      )
    }

    this.single<ExportSessionHelper> {
      FlowExportSessionHelper(
        draftManager = get()
      )
    }

    if (featuresConfig.processPictureExternally){
      this.single<MediaNavigationProcessor> {
        object : MediaNavigationProcessor {
          override fun process(activity: Activity, mediaList: List<Uri>): Boolean {
            val pngs = mediaList.filter { media ->
              media.path?.let { path ->
                path.contains(".png") || path.contains("external/images")
              } ?: false
            }
            return if (pngs.isEmpty()) {
              true
            } else {
              // Cache image before clearing sessing
              val savedImage = saveImageToCache(activity, pngs.first())
              val sessionKoin = getKoin().getOrNull<ExportSessionHelper>()
              sessionKoin?.cleanSessionData()
              (activity as? VideoCreationActivity)?.closeWithResult(
                ExportResult.Success(
                  emptyList(),
                  savedImage,
                  Uri.EMPTY,
                  Bundle()
                )
              )
              false
            }
          }
        }
      }
    }
  }

  private fun Module.addMubertParams(featuresConfig: FeaturesConfig) {
    val paramsObject = featuresConfig.audioBrowser.params

    if (paramsObject != null) {
      try {
        val paramsMap = paramsObject.keys().asSequence().associateWith { key ->
          paramsObject.get(key)
        }

        val mubertLicence =
          paramsMap[FEATURES_CONFIG_AUDIO_BROWSER_PARAMS_MUBERT_LICENCE] as? String
        val mubertToken =
          paramsMap[FEATURES_CONFIG_AUDIO_BROWSER_PARAMS_MUBERT_TOKEN] as? String

        if (mubertLicence != null && mubertToken != null) {
          this.single {
            MubertApiConfig(
              mubertLicence = mubertLicence,
              mubertToken = mubertToken
            )
          }
        } else {
          Log.w(TAG, "Missing parameters mubertLicence and mubertToken")
          return
        }
      } catch (e: JSONException) {
        Log.w(TAG, "Error parsing Params of AudioBrowser")
        return
      }
    } else {
      Log.w(TAG, "Missing Params in AudioBrowser")
      return
    }
  }

  private fun Module.applyDisabledMusicConfig(featuresConfig: FeaturesConfig) {
    this.single<MusicEditorConfig>{
      MusicEditorConfig(supportsExternalMusic = false)
    }
  }

  private fun Module.addExportData(exportData: ExportData?) {
    if (exportData == null) {
      Log.d(TAG, MESSAGE_MISSING_EXPORT_DATA)
    } else {
      Log.d(
        TAG,
        "add $INPUT_PARAM_EXPORT_DATA with params: ${exportData}"
      )
      val watermarkImagePath = exportData.watermark?.imagePath
      if (watermarkImagePath != null) {
        this.factory<WatermarkProvider> {
          CustomWatermarkProvider(get(), watermarkImagePath)
        }
      } else {
        Log.d(TAG, MESSAGE_MISSING_WATERMARK_IMAGE_PATH)
      }

      this.factory<ExportParamsProvider> {
        CustomExportParamsProvider(
          exportDir = get(named("exportDir")),
          watermarkBuilder = get(),
          exportData = exportData
        )
      }
    }
  }

  fun saveImageToCache(context: Context, uri: Uri): Uri {
    try {
      val contentResolver = context.contentResolver
      val cacheFile = File(context.cacheDir, "${dateTimeFormatter.format(Date())}.png")

      contentResolver.openInputStream(uri)?.use { inputStream ->
        FileOutputStream(cacheFile).use { outputStream ->
          inputStream.copyTo(outputStream)
        }
      }
      return Uri.fromFile(cacheFile)
    } catch (e: IOException) {
      Log.w(TAG, "Failed to cache an image: ${e.printStackTrace()}")
    }
    return Uri.EMPTY
  }
}

