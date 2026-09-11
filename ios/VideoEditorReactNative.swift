import UIKit
import AVKit
import BanubaAudioBrowserSDK
import React
import BanubaVideoEditorSDK
import BanubaVideoEditorCore
import AVKit

@objc(VideoEditorReactNative)
class VideoEditorReactNative: NSObject {

    let videoEditor = VideoEditorModule()

    @objc(openVideoEditor:inputParams:resolver:rejecter:)
    func openVideoEditor(_ token: String, _inputParams: NSDictionary, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) -> Void {

        guard let args = _inputParams as? Dictionary<String, Any> else {
            debugPrint("# Input params not set")
            reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errMessageInvalidParams, nil)
            return
        }

        let featuresConfig = parseFeatureConfig(args[VideoEditorReactNative.inputParamFeaturesConfig] as? String)

        let exportData = parseExportData(args[VideoEditorReactNative.inputParamExportData] as? String)

        let trackData = obtainTrackData(args[VideoEditorReactNative.inputParamTrackData] as? String)

        if (!videoEditor.initVideoEditor(token: token, featuresConfig: featuresConfig, exportData: exportData)) {
            debugPrint("# Cannot initialize video editor")
            reject(VideoEditorReactNative.errSdkNotInitialized, VideoEditorReactNative.errMessageSdkNotInitialized, nil)
            return
        }

        guard let screen = args[VideoEditorReactNative.inputParamScreen] as? String else {
            debugPrint("# Screen is not set")
            reject(VideoEditorReactNative.errInvalidParams,  VideoEditorReactNative.errMessageMissingScreen, nil)
            return
        }

        guard let controller = RCTPresentedViewController() else {
            reject(VideoEditorReactNative.errMissingHost, VideoEditorReactNative.errMessageMissingHost, nil)
            return
        }


        switch screen {
        case VideoEditorReactNative.screenCamera:
            videoEditor.openVideoEditorDefault(fromViewController: controller, resolve, reject)

        case VideoEditorReactNative.screenPip:
            let videoSources = args[VideoEditorReactNative.inputParamVideoSources] as? Array<String>
            guard let videoSource = videoSources?.first, let videoURL = URL(string: videoSource) else {
                reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errMessageInvalidPiPVideo, nil)
                return
            }

            videoEditor.openVideoEditorPip(fromViewController: controller, videoSource: videoURL, resolve, reject)

        case VideoEditorReactNative.screenCameraLayout:
            videoEditor.openVideoEditorCameraLayout(fromViewController: controller, resolve, reject)

        case VideoEditorReactNative.screenTrimmer:
            let videoSources = args[VideoEditorReactNative.inputParamVideoSources] as? Array<String>
            if (videoSources == nil || videoSources!.isEmpty) {
                reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errMessageInvalidTrimmerVideo, nil)
                return
            }
            let videoURLs = videoSources!.compactMap { URL(string: $0) }

            videoEditor.openVideoEditorTrimmer(fromViewController: controller, videoSources: videoURLs, resolve, reject)

        case VideoEditorReactNative.screenEditor:
            let videoSources = args[VideoEditorReactNative.inputParamVideoSources] as? Array<String>
            if (videoSources == nil || videoSources!.isEmpty) {
                reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errMessageInvalidEditorVideo, nil)
                return
            }
            let videoURLs = videoSources!.compactMap { URL(string: $0) }

            videoEditor.openVideoEditorEditor(
                fromViewController: controller,
                videoSources: videoURLs,
                mediaTrack: trackData,
                resolve,
                reject
            )

        case VideoEditorReactNative.screenAiClipping:
            videoEditor.openVideoEditorAiClipping(fromViewController: controller, resolve, reject)

        case VideoEditorReactNative.screenTemplates:
            videoEditor.openVideoEditorTemplates(fromViewController: controller, resolve, reject)

        case VideoEditorReactNative.screenDrafts:
            videoEditor.openVideoEditorDrafts(fromViewController: controller, resolve, reject)

        case VideoEditorReactNative.screenDraft:
            guard let draftId = args[VideoEditorReactNative.inputParamDraftId] as? String else {
              reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errMessageInvalidDraftId, nil)
              return
            }
            videoEditor.openVideoEditorDraft(fromViewController: controller, draftId: draftId, resolve, reject)

        case VideoEditorReactNative.screenGallery:
            videoEditor.openVideoEditorGallery(fromViewController: controller, resolve, reject)

        default:
            debugPrint("Unknown screen value = \(screen)")
            reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errInvalidParams, nil)
            return
        }
    }

    @objc(deleteDraft:resolver:rejecter:)
    func deleteDraft(draftId: String,  _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) -> Void {
      if let videoEditorSDK = videoEditor.videoEditorSDK {
          // draftsService is @MainActor-isolated as of BanubaVideoEditorSDK 1.54.2; this bridge
          // method isn't guaranteed to run on the main thread, so hop over explicitly - same
          // pattern already used for BanubaVideoEditor(...) in VideoEditorModule.initVideoEditor.
          let removed = DispatchQueue.main.sync {
              videoEditorSDK.draftsService.removeExternalDraft(id: draftId)
          }
          guard removed else {
              reject(VideoEditorReactNative.errMissingDraftId, VideoEditorReactNative.errMessageInvalidDraftId, nil)
              return
          }

          resolve(VideoEditorReactNative.messageDraftSuccessfullyRemoved)
      } else {
          reject(VideoEditorReactNative.errLicenseRevoked, VideoEditorReactNative.errMessageMissingToken, nil)
      }
    }

    @objc(release:rejecter:)
    func release(_ resolver: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) -> Void {
        videoEditor.videoEditorSDK = nil
        resolver(VideoEditorReactNative.messageVideoEditorReleased)
    }
}
