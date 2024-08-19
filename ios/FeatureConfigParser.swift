//
//  FeatureConfigParser.swift
//  ve_sdk_flutter
//
//  Created by German Khodyrev on 6.08.24.
//

import Foundation

extension VideoEditorReactNative {
    func parseFeatureConfig(_ rawConfigParams: String?) -> FeaturesConfig {
        guard let featuresConfigData = rawConfigParams?.data(using: .utf8) else {return emptyFeaturesConfig}
        do {
            let decodedFeatureConfig = try JSONDecoder().decode(FeaturesConfig.self, from: featuresConfigData)
            return decodedFeatureConfig
        } catch {
            print(VideoEditorReactNative.errMessageMissingConfigParams)
            return emptyFeaturesConfig
        }
    }
}
