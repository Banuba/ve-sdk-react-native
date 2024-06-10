package com.videoeditorreactnative

// Input params
internal const val INPUT_PARAM_SCREEN = "screen"
internal const val INPUT_PARAM_VIDEO_SOURCES = "videoSources"

// Exported params
internal const val EXPORTED_VIDEO_SOURCES = "exportedVideoSources"
internal const val EXPORTED_PREVIEW = "exportedPreview"
internal const val EXPORTED_META = "exportedMeta"

// Screens
internal const val SCREEN_CAMERA = "camera"
internal const val SCREEN_PIP = "pip"
internal const val SCREEN_TRIMMER = "trimmer"

// Errors
internal const val ERR_CODE_SDK_NOT_INITIALIZED = "ERR_SDK_NOT_INITIALIZED"
internal const val ERR_CODE_SDK_LICENSE_REVOKED = "ERR_SDK_LICENSE_REVOKED"
internal const val ERR_MISSING_HOST = "ERR_MISSING_HOST"
internal const val ERR_INVALID_PARAMS = "ERR_INVALID_PARAMS"
internal const val ERR_MISSING_EXPORT_RESULT = "ERR_MISSING_EXPORT_RESULT"
internal const val ERR_VIDEO_EXPORT_CANCEL = "ERR_VIDEO_EXPORT_CANCEL"

internal const val ERR_MESSAGE_SDK_NOT_INITIALIZED = """
    Failed to initialize SDK!!! 
    The license token is incorrect: empty or truncated.
    Please check the license token and try again.
"""
internal const val ERR_MESSAGE_LICENSE_REVOKED = """
    WARNING!!!
    YOUR LICENSE TOKEN EITHER EXPIRED OR REVOKED!
    Please contact Banuba
"""

internal const val ERR_MESSAGE_MISSING_TOKEN =
    "Missing license token: pass correct license token value"

internal const val ERR_MESSAGE_MISSING_SCREEN =
    "Missing screen: set correct value to $INPUT_PARAM_SCREEN input params"

internal const val ERR_MESSAGE_MISSING_PIP_VIDEO =
    "Missing pip video source: set correct value to $INPUT_PARAM_VIDEO_SOURCES input params"

internal const val ERR_MESSAGE_MISSING_TRIMMER_VIDEO_SOURCES =
    "Missing trimmer video sources: set correct value to $INPUT_PARAM_VIDEO_SOURCES input params"

internal const val ERR_MESSAGE_UNKNOWN_SCREEN =
    "Invalid $INPUT_PARAM_SCREEN value: available values($SCREEN_CAMERA, $SCREEN_PIP, $SCREEN_TRIMMER)"

internal const val ERR_MESSAGE_MISSING_EXPORT_RESULT =
    "Missing export result: video export has not been completed successfully. Please try again"

internal const val ERR_MESSAGE_MISSING_HOST = "Missing host Activity to start video editor"

internal const val ERR_MESSAGE_VIDEO_EXPORT_CANCEL = "The user has canceled video editing flow!"