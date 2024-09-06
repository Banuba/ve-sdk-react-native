package com.videoeditorreactnative

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.util.Log
import com.banuba.sdk.cameraui.data.PipConfig
import com.banuba.sdk.core.ext.isFileUrl
import com.banuba.sdk.core.license.BanubaVideoEditor
import com.banuba.sdk.export.data.ExportResult
import com.banuba.sdk.export.utils.EXTRA_EXPORTED_SUCCESS
import com.banuba.sdk.ve.flow.VideoCreationActivity
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import org.json.JSONObject
import org.json.JSONException
import java.io.File

class VideoEditorModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val TAG = "VideoEditorModule"

        // For Video Editor
        private const val OPEN_VIDEO_EDITOR_REQUEST_CODE = 1111
    }

    private var resultPromise: Promise? = null
    private var editorSDK: BanubaVideoEditor? = null
    private var videoEditorModule: VideoEditorKoinModule? = null
    override fun getName(): String = TAG

    private val videoEditorResultListener = object : ActivityEventListener {
        override fun onActivityResult(
            activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?
        ) {
            try {
                if (requestCode == OPEN_VIDEO_EDITOR_REQUEST_CODE) {
                    when {
                        resultCode == Activity.RESULT_OK -> {
                            val exportResult = data?.getParcelableExtra<ExportResult.Success>(
                                EXTRA_EXPORTED_SUCCESS
                            )

                            val videoSources =
                                exportResult?.videoList?.map { it.sourceUri.toString() } ?: emptyList()
                            val previewUri = exportResult?.preview
                            val metaUri = exportResult?.metaUri

                            if (videoSources.isEmpty()) {
                                Log.w(TAG, "Missing export result")
                                resultPromise?.reject(
                                    ERR_MISSING_EXPORT_RESULT,
                                    ERR_MESSAGE_MISSING_EXPORT_RESULT
                                )
                            } else {
                                // Send video export results to React
                                val arguments: WritableMap = Arguments.createMap()
                                val videoSourcesArray = Arguments.createArray()
                                videoSources.onEach { videoSourcesArray.pushString(it) }

                                arguments.putArray(EXPORTED_VIDEO_SOURCES, videoSourcesArray)
                                arguments.putString(EXPORTED_PREVIEW, previewUri?.toString())
                                arguments.putString(EXPORTED_META, metaUri?.toString())
                                Log.d(TAG, "Send video export results to React")
                                resultPromise?.resolve(arguments)
                            }
                        }

                        resultCode == Activity.RESULT_CANCELED -> resultPromise?.reject(
                            ERR_VIDEO_EXPORT_CANCEL,
                            ERR_MESSAGE_VIDEO_EXPORT_CANCEL
                        )
                    }
                resultPromise = null
            }
            } finally {
                videoEditorModule?.releaseVideoEditor()
                videoEditorModule = null
            }
        }

        override fun onNewIntent(intent: Intent?) {}
    }

    init {
        reactApplicationContext.addActivityEventListener(videoEditorResultListener)
    }

    /**
     * Open Video Editor SDK
     */
    @ReactMethod
    fun openVideoEditor(
        licenseToken: String,
        inputParams: ReadableMap,
        promise: Promise
    ) {
        resultPromise = promise

        if (licenseToken.isEmpty()) {
            Log.e(TAG, "Banuba license token cannot be empty!")
            resultPromise?.reject(ERR_INVALID_PARAMS, ERR_MESSAGE_MISSING_TOKEN, null)
            return
        }

        val screen = inputParams.getString(INPUT_PARAM_SCREEN)
        if (screen.isNullOrEmpty()) {
            resultPromise?.reject(ERR_INVALID_PARAMS, ERR_MESSAGE_MISSING_SCREEN, null)
            return
        }

        val featuresConfig = parseFeaturesConfig(inputParams.getString(INPUT_PARAM_FEATURES_CONFIG))

        initialize(licenseToken, featuresConfig) {
            val hostActivity = currentActivity

            if (hostActivity == null) {
                resultPromise?.reject(ERR_MISSING_HOST, ERR_MESSAGE_MISSING_HOST)
                return@initialize
            }

            val intent = when (screen) {
                SCREEN_CAMERA -> {
                    Log.d(TAG, "Start video editor from camera screen")
                    VideoCreationActivity.startFromCamera(
                        hostActivity,
                        PipConfig(video = Uri.EMPTY, openPipSettings = false),
                        null,
                        null,
                        extras = prepareExtras(featuresConfig)
                    )
                }

                SCREEN_PIP -> {
                    val videoSources = extractVideoSources(inputParams)
                    Log.d(TAG, "Received pip video sources = $videoSources")

                    if (videoSources.isEmpty()) {
                        resultPromise?.reject(
                            ERR_INVALID_PARAMS,
                            ERR_MESSAGE_MISSING_PIP_VIDEO,
                            null
                        )
                        return@initialize
                    }

                    val videoUri = Uri.parse(videoSources.first())
                    Log.d(TAG, "Start video editor in pip mode with video = $videoUri")
                    VideoCreationActivity.startFromCamera(
                        context = hostActivity,
                        // setup data that will be acceptable during export flow
                        additionalExportData = null,
                        // set TrackData object if you open VideoCreationActivity with preselected music track
                        audioTrackData = null,
                        // set PiP video configuration
                        pictureInPictureConfig = PipConfig(
                            video = videoUri,
                            openPipSettings = false
                        ),
                        extras = prepareExtras(featuresConfig)
                    )
                }

                SCREEN_TRIMMER -> {
                    val videoSources = extractVideoSources(inputParams)
                    Log.d(TAG, "Received trimmer video sources = $videoSources")

                    if (videoSources.isEmpty()) {
                        resultPromise?.reject(
                            ERR_INVALID_PARAMS,
                            ERR_MESSAGE_MISSING_TRIMMER_VIDEO_SOURCES,
                            null
                        )
                        return@initialize
                    }

                    Log.d(TAG, "Start video editor from trimmer with video = $videoSources")
                    VideoCreationActivity.startFromTrimmer(
                        context = hostActivity,
                        // setup data that will be acceptable during export flow
                        additionalExportData = null,
                        // set TrackData object if you open VideoCreationActivity with preselected music track
                        audioTrackData = null,
                        // set Trimmer video configuration
                        predefinedVideos = videoSources.map { Uri.parse(it) }
                            .toTypedArray(),
                        extras = prepareExtras(featuresConfig)
                    )
                }

                else -> {
                    Log.w(TAG, "Unknown screen = $screen")
                    null
                }
            }

            if (intent == null) {
                Log.e(TAG, "Cannot start Video Editor with passed params")
                resultPromise?.reject(ERR_INVALID_PARAMS, ERR_MESSAGE_UNKNOWN_SCREEN)
                return@initialize
            }

            hostActivity.startActivityForResult(intent, OPEN_VIDEO_EDITOR_REQUEST_CODE)
        }
    }

    private fun initialize(
        token: String,
        featuresConfig: FeaturesConfig,
        block: () -> Unit
    ) {
        val activity = currentActivity

        if (activity == null) {
            Log.e(TAG, ERR_MESSAGE_MISSING_HOST)
            resultPromise?.reject(ERR_MISSING_HOST, ERR_MESSAGE_MISSING_HOST, null)
            return
        }

        val sdk = BanubaVideoEditor.initialize(token)

        if (sdk == null) {
            // The SDK token is incorrect - empty or truncated
            Log.e(TAG, ERR_MESSAGE_SDK_NOT_INITIALIZED)
            resultPromise?.reject(
                ERR_CODE_SDK_NOT_INITIALIZED,
                ERR_MESSAGE_SDK_NOT_INITIALIZED,
                null
            )
            return
        }

        if (videoEditorModule == null) {
            // Initialize video editor sdk dependencies
            videoEditorModule = VideoEditorKoinModule().apply {
                initialize(activity.application, featuresConfig)
            }
        }

        editorSDK = sdk

        sdk.getLicenseState { isValid ->
            if (isValid) {
                Log.d(TAG, "The license token is valid!")
                block()
            } else {
                Log.e(TAG, ERR_MESSAGE_LICENSE_REVOKED)
                resultPromise?.reject(
                    ERR_CODE_SDK_LICENSE_REVOKED,
                    ERR_MESSAGE_LICENSE_REVOKED,
                    null
                )
            }
        }
    }

    private fun extractVideoSources(readableMap: ReadableMap): List<String> {
        val rawArray = readableMap.getArray(INPUT_PARAM_VIDEO_SOURCES)
        Log.d(TAG, "extractVideoSources raw = $rawArray")
        if (rawArray == null) {
            return emptyList()
        }

        val values = mutableListOf<String>()
        for (i in 0 until rawArray.size()) {
            values.add(rawArray.getString(i))
        }
        return values
    }
}
