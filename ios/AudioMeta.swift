import BanubaVideoEditorSDK

enum AudioType: String, Encodable, Decodable {
  case voice = "VOICE"
  case track = "TRACK"
}

struct AudioMeta: Codable {
  let title: String
  let url: URL
  let type: AudioType

  static func getAudioMeta(tracks: [BanubaVideoEditorSDK.MusicEditorTrack]?) -> [AudioMeta] {
    guard let tracks else { return [] }
    let audioMeta = tracks.compactMap {
      return AudioMeta(
        title: $0.title,
        url: $0.url,
        type: $0.isAudioRecord ? .voice : .track
      )
    }
    return audioMeta
  }
}