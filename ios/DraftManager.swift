//
//  DraftManager.swift
//  Pods
//
//  Created by Herman Khodyrev on 10.04.26.
//

import BanubaVideoEditorSDK

@objc(DraftManager)
class DraftManager: NSObject {
  var videoEditorSDK: BanubaVideoEditor?
  var draftsService: DraftsService?
  
  @objc(initManager:resolver:rejecter:)
  func initManager(
    _ token: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let config = VideoEditorConfig()
    
    videoEditorSDK = BanubaVideoEditor(
      token: token,
      configuration: config
    )
    
    guard let videoEditorSDK else {
      debugPrint("# Cannot initialize video editor")
      reject(VideoEditorReactNative.errSdkNotInitialized, VideoEditorReactNative.errMessageSdkNotInitialized, nil)
      return
    }
    
    draftsService = videoEditorSDK.draftsService
    
    resolve(DraftManager.messageDraftManagerInitialized)
  }
  
  @objc(deleteDraftById:resolver:rejecter:)
  func deleteDraftById(
    _ draftId: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    
    guard let draftsService else {
      debugPrint("# Drafts Service is not created")
      reject(VideoEditorReactNative.errSdkNotInitialized, VideoEditorReactNative.errMessageSdkNotInitialized, nil)
      return
    }
    
    guard let draft = draftsService.getDrafts().first(where: { $0.sequenceId == draftId }) else {
      reject(VideoEditorReactNative.errMissingDraftId, VideoEditorReactNative.errMessageInvalidDraftId, nil)
      return
    }
    
    guard draftsService.removeExternalDraft(draft) else {
      reject(VideoEditorReactNative.errMissingDraftId, VideoEditorReactNative.errMessageInvalidDraftId, nil)
      return
    }
    
    resolve(DraftManager.messageDraftManagerRemoved)
  }
  
  @objc(deinitManager:rejecter:)
  func deinitManager(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    videoEditorSDK = nil
    draftsService = nil
    resolve(DraftManager.messageDraftManagerDeinitialized)
  }
}

extension DraftManager {
  static let messageDraftManagerInitialized = "Draft manager initialized"
  static let messageDraftManagerDeinitialized = "Draft manager deinitialized"
  static let messageDraftManagerRemoved = "Draft succesfully removed"
}
