package com.videoeditorreactnative

import android.app.Application
import android.content.Context
import androidx.fragment.app.Fragment
import com.banuba.sdk.effectplayer.adapter.BanubaEffectPlayerKoinModule
import com.banuba.sdk.export.di.VeExportKoinModule
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
import com.banuba.sdk.audiobrowser.autocut.AutoCutTrackLoaderSoundstripe
import com.banuba.sdk.core.data.autocut.AutoCutTrackLoader
import com.banuba.sdk.core.domain.DraftConfig
import com.banuba.sdk.ve.data.autocut.AutoCutConfig
import com.banuba.sdk.veui.data.stickers.GifPickerConfigurations
import com.banuba.sdk.audiobrowser.domain.SoundstripeProvider
import com.banuba.sdk.audiobrowser.data.MubertApiConfig
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin
import org.koin.core.qualifier.named
import org.koin.dsl.module
import org.koin.core.module.Module
import android.util.Log
import org.json.JSONException

class VideoEditorKoinModule {
  internal fun initialize(application: Context, featuresConfig: FeaturesConfig) {
    startKoin {
      androidContext(application)
      allowOverride(true)

      // IMPORTANT! order of modules is required
      modules(
        VeSdkKoinModule().module,
        VeExportKoinModule().module,
        VePlaybackSdkKoinModule().module,

        AudioBrowserKoinModule().module,

        // IMPORTANT! ArCloudKoinModule should be set before TokenStorageKoinModule to get effects from the cloud
        ArCloudKoinModule().module,

        VeUiSdkKoinModule().module,
        VeFlowKoinModule().module,
        BanubaEffectPlayerKoinModule().module,
        GalleryKoinModule().module,

        // Sample integration module
        SampleIntegrationVeKoinModule(featuresConfig).module,
      )
    }
  }
}

/**
 * All dependencies mentioned in this module will override default
 * implementations provided in VE UI SDK.
 * Some dependencies has no default implementations. It means that
 * these classes fully depends on your requirements
 */
private class SampleIntegrationVeKoinModule(featuresConfig: FeaturesConfig) {

  val module = module {
    single<ArEffectsRepositoryProvider>(createdAtStart = true) {
      ArEffectsRepositoryProvider(
        arEffectsRepository = get(named("backendArEffectsRepository")),
        ioDispatcher = get(named("ioDispatcher"))
      )
    }
    Log.d(
      TAG_FEATURES_CONFIG,
      "Add $INPUT_PARAM_FEATURES_CONFIG with params: ${featuresConfig}"
    )
    this.applyFeaturesConfig(featuresConfig)
  }

  private fun Module.applyFeaturesConfig(featuresConfig: FeaturesConfig) {
    this.single<ContentFeatureProvider<TrackData, Fragment>>(
      named("musicTrackProvider")
    ) {
      when (featuresConfig.audioBrowser.source) {
        FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_SOUNDSTRIPE -> SoundstripeProvider()
        else -> {
          AudioBrowserMusicProvider()
        }
      }
    }

    if (featuresConfig.audioBrowser.source == FEATURES_CONFIG_AUDIO_BROWSER_SOURCE_MUBERT) {
      this.addMubertParams(featuresConfig)
    }

    featuresConfig.aiClipping?.let { params ->
      this.single<AutoCutConfig> {
        AutoCutConfig(
          audioDataUrl = params.audioDataUrl,
          audioTracksUrl = params.audioTracksUrl
        )
      }
      this.single<AutoCutTrackLoader> {
        AutoCutTrackLoaderSoundstripe(
          soundstripeApi = get()
        )
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
}

