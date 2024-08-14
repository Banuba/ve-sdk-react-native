#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VideoEditorReactNative, NSObject)

RCT_EXTERN_METHOD(openVideoEditor:(NSString *) token rawConfigParams:(NSString *)rawConfigParams inputParams:(NSDictionary *) inputParams resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
