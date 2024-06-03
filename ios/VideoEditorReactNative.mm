#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VideoEditorReactNative, NSObject)

RCT_EXTERN_METHOD(multiply:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock) reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
