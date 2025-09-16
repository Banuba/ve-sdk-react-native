//
//  AudioData.swift
//  video-editor-react-native
//
//  Created by German Khodyrev on 16.09.25.
//

import AVFoundation
import BanubaUtilities

struct AudioData: Codable {
  let id: String
  let title: String
  let subtitle: String
  let localUrl: URL

  func getMediaTrack() -> MediaTrack {
    let urlAsset = AVURLAsset(url: localUrl)
    let urlAssetTimeRange = CMTimeRange(start: .zero, duration: urlAsset.duration)
    let mediaTrackTimeRange = MediaTrackTimeRange(startTime: .zero, playingTimeRange: urlAssetTimeRange)
    return MediaTrack(
      uuid: UUID(uuidString: id) ?? UUID(),
      id: nil,
      url: localUrl,
      coverURL: nil,
      timeRange: mediaTrackTimeRange,
      isEditable: true,
      title: title
    )
  }
}
