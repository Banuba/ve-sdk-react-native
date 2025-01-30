import Foundation
import BanubaVideoEditorCore

struct ExportData: Codable {
    let exportedVideos: [ExportedVideo]
    let watermark: Watermark?
}

struct ExportedVideo: Codable {
    let fileName: String
    let videoResolution: String
    let useHevcIfPossible: Bool?

    public func qualityValue() -> ExportQuality {
        switch videoResolution {
            case ExportData.exportedVideoVideoResolutionsVGA360p:
                return .videoConfiguration(.init(resolution: .ld360, useHEVCCodecIfPossible: useHevcIfPossible ?? true))
            case ExportData.exportedVideoVideoResolutionsVGA480p:
                return .videoConfiguration(.init(resolution: .md480, useHEVCCodecIfPossible: useHevcIfPossible ?? true))
            case ExportData.exportedVideoVideoResolutionsQHD540p:
                return .videoConfiguration(.init(resolution: .md540, useHEVCCodecIfPossible: useHevcIfPossible ?? true))
            case ExportData.exportedVideoVideoResolutionsHD720p:
                return .videoConfiguration(.init(resolution: .hd720, useHEVCCodecIfPossible: useHevcIfPossible ?? true))
            case ExportData.exportedVideoVideoResolutionsFHD1080p:
                return .videoConfiguration(.init(resolution: .fullHd1080, useHEVCCodecIfPossible: useHevcIfPossible ?? true))
            case ExportData.exportedVideoVideoResolutionsQHD1440p:
                return .videoConfiguration(.init(resolution: .qhd1440, useHEVCCodecIfPossible: useHevcIfPossible ?? true))
            case ExportData.exportedVideoVideoResolutionsUHD2160p:
                return .videoConfiguration(.init(resolution: .ultraHd2160, useHEVCCodecIfPossible: useHevcIfPossible ?? true))
            case ExportData.exportedVideoVideoResolutionsOriginal:
                return .videoConfiguration(.init(resolution: .original, useHEVCCodecIfPossible: useHevcIfPossible ?? true))
            default:
                return .auto
        }
    }
}

struct Watermark: Codable {
    let imagePath: String?
    let alignment: String?

    public func watermarkConfigurationValue(controller: UIViewController) -> WatermarkConfiguration? {
        guard let imageName = imagePath?.components(separatedBy: "/").last?.replacingOccurrences(of: ".png", with: "") else {return nil}

        guard let watermarkImage = UIImage(named: imageName) else {return nil}

        return WatermarkConfiguration(
            watermark: ImageConfiguration(image: watermarkImage),
            size: CGSize(width: 72, height: 72),
            sharedOffset: 20,
            position: watermarkAligmentValue()
        )
    }

    private func watermarkAligmentValue() -> WatermarkConfiguration.WatermarkPosition{
        switch alignment {
            case ExportData.exportDataWatermarkAlignmentTopLeft:
                return .leftTop
            case ExportData.exportDataWatermarkAlignmentTopRight:
                return .rightTop
            case ExportData.exportDataWatermarkAlignmentBottomLeft:
                return .leftBottom
            default:
                return .rightBottom
        }
    }
}
