import Foundation
import BanubaVideoEditorSDK
import BanubaAudioBrowserSDK
import BanubaVideoEditorCore
import React

protocol VideoEditor {
    func initVideoEditor(token: String, featuresConfig: FeaturesConfig, exportData: ExportData) -> Bool

    func openVideoEditorDefault(fromViewController controller: UIViewController, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock)

    func openVideoEditorPIP(fromViewController controller: UIViewController, videoURL: URL, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock)

    func openVideoEditorTrimmer(fromViewController controller: UIViewController, videoSources: Array<URL>, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock)

    func openVideoEditorAiClipping(fromViewController controller: UIViewController, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock)

    func openVideoEditorTemplates(fromViewController controller: UIViewController, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock)
}

class VideoEditorModule: VideoEditor {

    private var videoEditorSDK: BanubaVideoEditor?
    private var exportData: ExportData?
    private var currentController: UIViewController?
    private var currentResolve: RCTPromiseResolveBlock?
    private var currentReject: RCTPromiseRejectBlock?
    private var featuresConfig: FeaturesConfig?

    // Use “true” if you want users could restore the last video editing session.
    private let restoreLastVideoEditingSession: Bool = false

    func initVideoEditor(token: String, featuresConfig: FeaturesConfig, exportData: ExportData) -> Bool {
        guard videoEditorSDK == nil else {
            debugPrint("Video Editor SDK is already initialized")
            return true
        }

        var config = VideoEditorConfig()

        self.featuresConfig = featuresConfig

        config.applyFeatureConfig(featuresConfig)

        let lutsPath = Bundle(for: VideoEditorModule.self).bundleURL.appendingPathComponent("luts", isDirectory: true)
        config.filterConfiguration.colorEffectsURL = lutsPath

        videoEditorSDK = BanubaVideoEditor(
            token: token,
            arguments: [.useEditorV2 : featuresConfig.enableEditorV2],
            configuration: config,
            externalViewControllerFactory: provideCustomViewFactory(featuresConfig: featuresConfig)
        )

        if videoEditorSDK == nil {
            return false
        }

        self.exportData = exportData

        videoEditorSDK?.delegate = self
        return true
    }

    func provideCustomViewFactory(featuresConfig: FeaturesConfig) -> FlutterCustomViewFactory? {
        let factory: FlutterCustomViewFactory?

        if featuresConfig.audioBrowser.source == "soundstripe"{
            return nil
        }

        factory = nil

        return factory
    }

    func openVideoEditorDefault(
        fromViewController controller: UIViewController,
        _ resolve: @escaping RCTPromiseResolveBlock,
        _ reject: @escaping RCTPromiseRejectBlock
    ) {
        self.currentResolve = resolve
        self.currentReject = reject

        self.currentController = controller

        let config = VideoEditorLaunchConfig(
            entryPoint: .camera,
            hostController: controller,
            animated: true
        )
        checkLicenseAndStartVideoEditor(with: config, resolve, reject)
    }

    func openVideoEditorPIP(
        fromViewController controller: UIViewController,
        videoURL: URL,
        _ resolve: @escaping RCTPromiseResolveBlock,
        _ reject: @escaping RCTPromiseRejectBlock
    ) {
        self.currentResolve = resolve
        self.currentReject = reject

        self.currentController = controller

        let pipLaunchConfig = VideoEditorLaunchConfig(
            entryPoint: .pip,
            hostController: controller,
            pipVideoItem: videoURL,
            musicTrack: nil,
            animated: true
        )

        checkLicenseAndStartVideoEditor(with: pipLaunchConfig, resolve, reject)
    }

    func openVideoEditorTrimmer(
        fromViewController controller: UIViewController,
        videoSources: Array<URL>,
        _ resolve: @escaping RCTPromiseResolveBlock,
        _ reject: @escaping RCTPromiseRejectBlock
    ) {
        self.currentResolve = resolve
        self.currentReject = reject

        self.currentController = controller

        let trimmerLaunchConfig = VideoEditorLaunchConfig(
            entryPoint: .trimmer,
            hostController: controller,
            videoItems: videoSources,
            musicTrack: nil,
            animated: true
        )

        checkLicenseAndStartVideoEditor(with: trimmerLaunchConfig, resolve, reject)
    }

    func openVideoEditorAiClipping(
        fromViewController controller: UIViewController,
        _ resolve: @escaping RCTPromiseResolveBlock,
        _ reject: @escaping RCTPromiseRejectBlock
    ) {
        self.currentResolve = resolve
        self.currentReject = reject

        self.currentController = controller

        let config = VideoEditorLaunchConfig(
            entryPoint: .aiClipping,
            hostController: controller,
            animated: true
        )

        checkLicenseAndStartVideoEditor(with: config, resolve, reject)
    }

    func openVideoEditorTemplates(
        fromViewController controller: UIViewController,
        _ resolve: @escaping RCTPromiseResolveBlock,
        _ reject: @escaping RCTPromiseRejectBlock
    ) {
        self.currentResolve = resolve
        self.currentReject = reject

        self.currentController = controller

        let config = VideoEditorLaunchConfig(
            entryPoint: .videoTemplates,
            hostController: controller,
            animated: true
        )

        checkLicenseAndStartVideoEditor(with: config, resolve, reject)
    }

    func checkLicenseAndStartVideoEditor(
        with config: VideoEditorLaunchConfig,
        _ resolve: @escaping RCTPromiseResolveBlock,
        _ reject: @escaping RCTPromiseRejectBlock
    ) {
        if videoEditorSDK == nil {
            reject(
                VideoEditorReactNative.errSdkNotInitialized,
                VideoEditorReactNative.errMessageSdkNotInitialized,
                nil
            )
            return
        }

        // Checking the license might take around 1 sec in the worst case.
        // Please optimize use if this method in your application for the best user experience
        videoEditorSDK?.getLicenseState(completion: { [weak self] isValid in
            guard let self else { return }
            if isValid {
                print("✅ The license is active")
                DispatchQueue.main.async {
                    self.videoEditorSDK?.presentVideoEditor(
                        withLaunchConfiguration: config,
                        completion: nil
                    )
                }
            } else {
                if self.restoreLastVideoEditingSession == false {
                    self.videoEditorSDK?.clearSessionData()
                }
                self.videoEditorSDK = nil
                print("❌ Use of SDK is restricted: the license is revoked or expired")
                reject(VideoEditorReactNative.errLicenseRevoked, VideoEditorReactNative.errMessageLicenseRevoked, nil)
            }
        })
    }
}


// MARK: - Export flow
extension VideoEditorModule {
    func exportVideo() {

        guard let exportData, let currentController else {
            print("❌ Export Config is not set")
            return
        }

        let progressView = createProgressViewController()

        progressView.cancelHandler = { [weak self] in
            self?.videoEditorSDK?.stopExport()
        }

        getTopViewController()?.present(progressView, animated: true)

        debugPrint("Add Export Param with params: \(exportData)")

        let watermarkConfiguration = exportData.watermark?.watermarkConfigurationValue(controller: currentController)

        let exportProvider = ExportProvider(exportData: exportData, watermarkConfiguration: watermarkConfiguration)

        videoEditorSDK?.export(
            using: exportProvider.provideExportConfiguration(),
            exportProgress: { [weak progressView] progress in progressView?.updateProgressView(with: Float(progress)) }
        ) { [weak self] (error, coverImage) in
            // Export Callback
            DispatchQueue.main.async {
                progressView.dismiss(animated: true) {
                    // if export cancelled just hide progress view
                    if let error, error as NSError == exportCancelledError {
                        return
                    }
                    var metadataUrl: URL?
                    if let analytics = self?.videoEditorSDK?.metadata?.analyticsMetadataJSON {
                        let url = FileManager.default.temporaryDirectory.appendingPathComponent("\(UUID().uuidString)_metadata.json")
                        do {
                            try analytics.write(to: url, atomically: true, encoding: .utf8)
                            metadataUrl = url
                        } catch {
                            print("Error during metadata saving: \(error)")
                        }
                    }
                    var audioMetaJSON: String?
                    if let jsonData = try? JSONEncoder().encode(AudioMeta.getAudioMeta(tracks: self?.videoEditorSDK?.musicMetadata?.tracks)),
                        let jsonString = String(data: jsonData, encoding: .utf8) {
                      audioMetaJSON = jsonString.replacingOccurrences(of: "\\/", with: "/")
                    }

                    // TODO 1. simplify method
                    self?.completeExport(
                        videoUrls: Array(exportProvider.fileUrls.values),
                        metaUrl: metadataUrl,
                        previewUrl: FileManager.default.temporaryDirectory
                          .appendingPathComponent("export_preview.png"),
                        audioMetaJSON: audioMetaJSON,
                        error: error,
                        previewImage: coverImage?.coverImage
                    )
                }
            }
        }
    }

    private func completeExport(
        videoUrls: [URL],
        metaUrl: URL?,
        previewUrl: URL,
        audioMetaJSON: String?,
        error: Error?,
        previewImage: UIImage?
    ) {
        videoEditorSDK?.dismissVideoEditor(animated: true) {
            let success = error == nil
            if success {
                print("Video exported successfully: video sources = \(videoUrls)), meta = \(metaUrl)), , audio metadata = \(String(describing: audioMetaJSON)), preview = \(previewUrl))")

                let previewImageData = previewImage?.pngData()

                try? previewImageData?.write(to: previewUrl)

                self.currentResolve?([
                    VideoEditorReactNative.argExportedVideoSources: videoUrls.compactMap { $0.path },
                    VideoEditorReactNative.argExportedPreview: previewUrl.path,
                    VideoEditorReactNative.argExportedMeta : metaUrl?.path,
                    VideoEditorReactNative.argExportedAudioMeta: audioMetaJSON
                ])
            } else {
                print("Error while exporting video = \(String(describing: error))")
                self.currentReject?(VideoEditorReactNative.errMissingExportResult, VideoEditorReactNative.errMessageMissingExportResult, nil)
            }

            // Remove strong reference to video editor sdk instance
            if self.restoreLastVideoEditingSession == false {
                self.videoEditorSDK?.clearSessionData()
            }
            self.videoEditorSDK = nil
        }
    }

    func getTopViewController() -> UIViewController? {
        let keyWindow = UIApplication
            .shared
            .connectedScenes
            .flatMap { ($0 as? UIWindowScene)?.windows ?? [] }
            .last { $0.isKeyWindow }

        var topController = keyWindow?.rootViewController

        while let newTopController = topController?.presentedViewController {
            topController = newTopController
        }

        return topController
    }

    func createProgressViewController() -> ProgressViewController {
        let progressViewController = ProgressViewController.makeViewController()
        progressViewController.message = NSLocalizedString("com.banuba.alert.progressView.exportingVideo", comment: "")
        return progressViewController
    }
}

// MARK: - BanubaVideoEditorSDKDelegate
extension VideoEditorModule: BanubaVideoEditorDelegate {
    func videoEditorDidCancel(_ videoEditor: BanubaVideoEditor) {
        videoEditor.dismissVideoEditor(animated: true) {
            // remove strong reference to video editor sdk instance
            if self.restoreLastVideoEditingSession == false {
                self.videoEditorSDK?.clearSessionData()
            }
            self.videoEditorSDK = nil
        }
    }

    func videoEditorDone(_ videoEditor: BanubaVideoEditor) {
        exportVideo()
    }

  func videoEditor(_ videoEditor: BanubaVideoEditor, shouldProcessMediaUrls urls: [URL]) -> Bool {
      guard let featuresConfig else {
          return true
      }
      if featuresConfig.processPictureExternally {
          print("\(featuresConfig.processPictureExternally)")
          guard let jpegURL = urls.first(where: { $0.pathExtension.lowercased() == "jpeg" }),
                let imageData = try? Data(contentsOf: jpegURL),
                !imageData.isEmpty,
                let resultImage = UIImage(data: imageData) else {
              return true
          }

          videoEditor.dismissVideoEditor(animated: true) {
              DispatchQueue.main.async { [weak self] in
                  guard let self else { return }
                  // Calling clearSessionData() also removes any files stored in urls array
                  self.videoEditorSDK?.clearSessionData()

                  let dateFormatter = DateFormatter()
                  dateFormatter.dateFormat = "yyyy-MM-dd'T'HH-mm-ss.SSS"

                  self.completeExport(
                      videoUrls: [],
                      metaUrl: nil,
                      previewUrl: FileManager.default.temporaryDirectory.appendingPathComponent(
                        "\(dateFormatter.string(from: Date())).png"
                      ),
                      audioMetaJSON: nil,
                      error: nil,
                      previewImage: resultImage
                  )
              }
          }
          return false
      } else {
          return true
      }
  }
}

// MARK: - Feature Config flow
extension VideoEditorConfig {
    mutating func applyFeatureConfig(_ featuresConfig: FeaturesConfig) {

        print("Add Features Config with params: \(featuresConfig)")

        if featuresConfig.audioBrowser.source != VideoEditorConfig.featuresConfigAudioBrowserSourceDisabled {
            AudioBrowserConfig.shared.musicSource = featuresConfig.audioBrowser.value()
        } else {
            applyDisabledMusicConfig()
        }

        if featuresConfig.audioBrowser.source == VideoEditorConfig.featuresConfigAudioBrowserSourceMubert {
            addMubertParams(featuresConfig)
        }
        if featuresConfig.enableEditorV2 {
            self.combinedGalleryConfiguration.visibleTabsInGallery = [GalleryMediaType.video, GalleryMediaType.photo]
        }

        if let captions = featuresConfig.captions {
            self.captionsConfiguration.captionsUploadUrl = captions.uploadUrl
            self.captionsConfiguration.captionsTranscribeUrl = captions.transcribeUrl
            self.captionsConfiguration.apiKey = captions.apiKey
            self.captionsConfiguration.apiV2Key = captions.apiV2Key
        }

        if let aiClipping = featuresConfig.aiClipping, let audioTracksUrl = URL(string: aiClipping.audioTracksUrl) {
            self.aiClippingConfiguration.embeddingsDownloadUrl = aiClipping.audioDataUrl
            self.aiClippingConfiguration.musicProvider =
                switch featuresConfig.audioBrowser.value() {
                    case .banubaMusic:
                        .banubaMusic(tracksURL: audioTracksUrl)
                    default:
                        .soundstripe(tracksURL: audioTracksUrl)
                }
        }

        if !featuresConfig.cameraConfig.supportsColorEffects {
            self.recorderConfiguration.additionalEffectsButtons = self.recorderConfiguration.additionalEffectsButtons.filter({
                    $0.identifier != .colorEffects
            })
        }

        if !featuresConfig.cameraConfig.supportsBeauty {
              self.recorderConfiguration.additionalEffectsButtons = self.recorderConfiguration.additionalEffectsButtons.filter({
                      $0.identifier != .beauty
              })
        }

        if !featuresConfig.cameraConfig.supportsMasks {
            self.recorderConfiguration.additionalEffectsButtons = self.recorderConfiguration.additionalEffectsButtons.filter({
                    $0.identifier != .masks
            })
        }

        var recordModes: [BanubaVideoEditorSDK.RecordButtonViewMode] = []
        featuresConfig.cameraConfig.recordModes.forEach { mode in
            switch mode {
                case VideoEditorConfig.featuresConfigCameraConfigRecordModeVideo:
                    recordModes.append(.video)
                case VideoEditorConfig.featuresConfigCameraConfigRecordModePhoto:
                    recordModes.append(.photo)
                default:
                    recordModes = [.video, .photo]
            }
        }

        self.recorderConfiguration.captureButtonModes = recordModes

        self.editorConfiguration.isVideoAspectFillEnabled = featuresConfig.editorConfig.enableVideoAspectFill

        if !featuresConfig.editorConfig.supportsColorEffects {
            self.videoEditorViewConfiguration.toolsPanelConfiguration.buttons = self.videoEditorViewConfiguration.toolsPanelConfiguration.buttons.filter({
                    $0.identifier != .filters
            })
        }

        if !featuresConfig.editorConfig.supportsVisualEffects {
            self.videoEditorViewConfiguration.toolsPanelConfiguration.buttons = self.videoEditorViewConfiguration.toolsPanelConfiguration.buttons.filter({
                    $0.identifier != .effects
            })
        }

        self.featureConfiguration.draftsConfig = featuresConfig.draftsConfig.value()

        if let gifPickerConfig = featuresConfig.gifPickerConfig {
            self.gifPickerConfiguration.giphyAPIKey = gifPickerConfig.giphyApiKey
        }

        self.videoDurationConfiguration = featuresConfig.videoDurationConfig.value()

        // Make customization here

        AudioBrowserConfig.shared.setPrimaryColor(#colorLiteral(red: 0.2350233793, green: 0.7372031212, blue: 0.7565478683, alpha: 1))

        var featureConfiguration = self.featureConfiguration
        featureConfiguration.supportsTrimRecordedVideo = true
        featureConfiguration.isMuteCameraAudioEnabled = true
        self.updateFeatureConfiguration(featureConfiguration: featureConfiguration)
    }

    private func addMubertParams(_ featuresConfig: FeaturesConfig){
       guard let audioBrowserParams = featuresConfig.audioBrowser.params else { return }
       guard let mubertLicence = audioBrowserParams.mubertLicence, let mubertToken = audioBrowserParams.mubertToken else { return }
       BanubaAudioBrowser.setMubertKeys(
           license: mubertLicence,
           token: mubertToken
       )
    }

    private mutating func applyDisabledMusicConfig(){
       self.recorderConfiguration.additionalEffectsButtons = self.recorderConfiguration.additionalEffectsButtons.filter{$0.identifier != .sound}
       self.musicEditorConfiguration.mainMusicViewControllerConfig.editButtons = self.musicEditorConfiguration.mainMusicViewControllerConfig.editButtons
           .filter({$0.type != .track})
       self.videoEditorViewConfiguration.timelineConfiguration.isAddAudioEnabled = false
    }
}
