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
    
    @objc (openVideoEditor:inputParams:resolver:rejecter:)
    func openVideoEditor(_ token: String, _inputParams: NSDictionary, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        guard let args = _inputParams as? Dictionary<String, Any> else {
            debugPrint("# Input params not set")
            reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errMessageInvalidParams, nil)
            return
        }
        
        let featuresConfig = parseFeatureConfig(args[VideoEditorReactNative.inputParamFeaturesConfig] as? String)

        let exportData = parseExportData(args[VideoEditorReactNative.inputParamExportData] as? String)
        
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
            if (videoSources == nil || videoSources!.isEmpty) {
                reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errMessageInvalidPiPVideo, nil)
                return
            }
            videoEditor.openVideoEditorPIP(fromViewController: controller, videoURL: URL(fileURLWithPath: videoSources!.first!), resolve, reject)
            
        case VideoEditorReactNative.screenTrimmer:
            let videoSources = args[VideoEditorReactNative.inputParamVideoSources] as? Array<String>
            if (videoSources == nil || videoSources!.isEmpty) {
                reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errMessageInvalidTrimmerVideo, nil)
                return
            }
            let videoURLs = videoSources!.compactMap { URL(string: $0) }
            
            videoEditor.openVideoEditorTrimmer(fromViewController: controller, videoSources: videoURLs, resolve, reject)

        case VideoEditorReactNative.screenAiClipping:
            videoEditor.openVideoEditorAiClipping(fromViewController: controller, resolve, reject)

        case VideoEditorReactNative.screenTemplates:
            videoEditor.openVideoEditorTemplates(fromViewController: controller, resolve, reject)
            
        default:
            debugPrint("Unknown screen value = \(screen)")
            reject(VideoEditorReactNative.errInvalidParams, VideoEditorReactNative.errInvalidParams, nil)
            return
        }
    
    }
}
