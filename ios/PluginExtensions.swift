extension VideoEditorReactNative {
    
    func parseFeatureConfig(_ rawConfigParams: String?) -> FeaturesConfig {
        guard let featuresConfigData = rawConfigParams?.data(using: .utf8) else {return defaultFeaturesConfig}
        do {
            let decodedFeatureConfig = try JSONDecoder().decode(FeaturesConfig.self, from: featuresConfigData)
            return decodedFeatureConfig
        } catch {
            print(VideoEditorReactNative.errMessageMissingConfigParams)
            return defaultFeaturesConfig
        }
    }
    
    func parseExportData(_ rawExportParams: String?) -> ExportData {
        guard let exportParamsData = rawExportParams?.data(using: .utf8) else {return defaultExportData}
        do {
            let decodedExportParams = try JSONDecoder().decode(ExportData.self, from: exportParamsData)
            return decodedExportParams
        } catch {
            print(VideoEditorReactNative.errMessageMissingExportData)
            return defaultExportData
        }
    }
}
