#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VideoEditorReactNative, NSObject)

RCT_EXTERN_METHOD(openVideoEditor:(NSString *) token inputParams:(NSDictionary *) inputParams resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

@interface RCT_EXTERN_MODULE(DraftManager, NSObject)

RCT_EXTERN_METHOD(initManager:(NSString *) token resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deleteDraftById:(NSString *) draftId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deinitManager: (RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
