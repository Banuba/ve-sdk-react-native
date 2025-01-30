import Foundation
import BanubaVideoEditorSDK
import BanubaVideoEditorCore

struct ExportProvider {

    let exportData: ExportData
    let watermarkConfiguration: WatermarkConfiguration?
    let fileUrls: [String: URL]

    init(exportData: ExportData, watermarkConfiguration: WatermarkConfiguration?) {
        self.exportData = exportData
        self.watermarkConfiguration = watermarkConfiguration
        self.fileUrls = Dictionary(uniqueKeysWithValues: exportData.exportedVideos.map { ($0.fileName, ExportProvider.createFileUrl(exportedVideo: $0)) })
    }

    func provideExportConfiguration() -> ExportConfiguration {
        let exportVideoConfigurations = exportData.exportedVideos.map {
            guard let fileUrl = fileUrls[$0.fileName] else {
                fatalError("URL not found for file: \($0.fileName)")
            }
            return ExportVideoConfiguration(
                fileURL: fileUrl,
                quality: $0.qualityValue(),
                useHEVCCodecIfPossible: $0.useHevcIfPossible ?? true,
                watermarkConfiguration: watermarkConfiguration
            )
        }

        return ExportConfiguration(
            videoConfigurations: exportVideoConfigurations,
            isCoverEnabled: true,
            gifSettings: nil
        )
    }

    private static func createFileUrl(exportedVideo: ExportedVideo) -> URL {
        let manager = FileManager.default
        let fileUrl = manager.temporaryDirectory.appendingPathComponent(
            "\(exportedVideo.fileName).mov"
        )
        if manager.fileExists(atPath: fileUrl.path) {
            try? manager.removeItem(at: fileUrl)
        }
        return fileUrl
    }
}
