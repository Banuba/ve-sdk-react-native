import Foundation
import BanubaVideoEditorSDK
import BanubaAudioBrowserSDK
import VideoEditor
import VEExportSDK
import React

protocol VideoEditor {
    func initVideoEditor(token: String, featuresConfig: FeaturesConfig) -> Bool

    func openVideoEditorDefault(fromViewController controller: UIViewController, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock)

    func openVideoEditorPIP(fromViewController controller: UIViewController, videoURL: URL, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock)

    func openVideoEditorTrimmer(fromViewController controller: UIViewController, videoSources: Array<URL>, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock)
}

class VideoEditorModule: VideoEditor {

    private var videoEditorSDK: BanubaVideoEditor?
    private var currentResolve: RCTPromiseResolveBlock?
    private var currentReject: RCTPromiseRejectBlock?

    // Use “true” if you want users could restore the last video editing session.
    private let restoreLastVideoEditingSession: Bool = false

    func initVideoEditor(token: String, featuresConfig: FeaturesConfig) -> Bool {
        guard videoEditorSDK == nil else {
            debugPrint("Video Editor SDK is already initialized")
            return true
        }

        var config = VideoEditorConfig()

        config.applyFeatureConfig(featuresConfig)

        let lutsPath = Bundle(for: VideoEditorModule.self).bundleURL.appendingPathComponent("luts", isDirectory: true)
        config.filterConfiguration.colorEffectsURL = lutsPath

        videoEditorSDK = BanubaVideoEditor(
            token: token,
            configuration: config,
            externalViewControllerFactory: provideCustomViewFactory(featuresConfig: featuresConfig)
        )

        if videoEditorSDK == nil {
            return false
        }

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

        let trimmerLaunchConfig = VideoEditorLaunchConfig(
            entryPoint: .trimmer,
            hostController: controller,
            videoItems: videoSources,
            musicTrack: nil,
            animated: true
        )

        checkLicenseAndStartVideoEditor(with: trimmerLaunchConfig, resolve, reject)
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
        let progressView = createProgressViewController()

        progressView.cancelHandler = { [weak self] in
            self?.videoEditorSDK?.stopExport()
        }

        getTopViewController()?.present(progressView, animated: true)

        let manager = FileManager.default
        // File name

        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH-mm-ss.SSS"

        let previewURL = manager.temporaryDirectory.appendingPathComponent("export_preview.png")

        // TODO handle multiple exported video files
        let firstFileURL = manager.temporaryDirectory.appendingPathComponent("export_\(dateFormatter.string(from: Date())).mov")
        if manager.fileExists(atPath: firstFileURL.path) {
            try? manager.removeItem(at: firstFileURL)
        }

        // Video configuration
        let exportVideoConfigurations: [ExportVideoConfiguration] = [
            ExportVideoConfiguration(
                fileURL: firstFileURL,
                quality: .auto,
                useHEVCCodecIfPossible: true,
                watermarkConfiguration: nil
            )
        ]

        // Set up export
        let exportConfiguration = ExportConfiguration(
            videoConfigurations: exportVideoConfigurations,
            isCoverEnabled: true,
            gifSettings: nil
        )

        videoEditorSDK?.export(
            using: exportConfiguration,
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

                    // TODO 1. simplify method
                    self?.completeExport(videoUrls: [firstFileURL], metaUrl: metadataUrl, previewUrl: previewURL, error: error, previewImage: coverImage?.coverImage)
                }
            }
        }
    }

    private func completeExport(videoUrls: [URL], metaUrl: URL?, previewUrl: URL, error: Error?, previewImage: UIImage?) {
        videoEditorSDK?.dismissVideoEditor(animated: true) {
            let success = error == nil
            if success {
                print("Video exported successfully: video sources = \(videoUrls)), meta = \(metaUrl)), preview = \(previewUrl))")

                let previewImageData = previewImage?.pngData()

                try? previewImageData?.write(to: previewUrl)

                self.currentResolve?([
                    VideoEditorReactNative.argExportedVideoSources: videoUrls.compactMap { $0.path },
                    VideoEditorReactNative.argExportedPreview: previewUrl.path,
                    VideoEditorReactNative.argExportedMeta : metaUrl?.path
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
}

// MARK: - Feature Config flow
extension VideoEditorConfig {
    mutating func applyFeatureConfig(_ featuresConfig: FeaturesConfig) {

        print("\(VideoEditorConfig.featuresConfigTag): Add Features Config with params: \(featuresConfig)")

        AudioBrowserConfig.shared.musicSource = featuresConfig.audioBrowser.value()

        if featuresConfig.audioBrowser.source == VideoEditorConfig.featuresConfigAudioBrowserSourceMubert {
            guard let audioBrowserParams = featuresConfig.audioBrowser.params else { return }
            guard let mubertLicence = audioBrowserParams.mubertLicence, let mubertToken = audioBrowserParams.mubertToken else { return }

            BanubaAudioBrowser.setMubertKeys(
                license: mubertLicence,
                token: mubertToken
            )
        }

        if let aiCaptions = featuresConfig.aiCaptions {
            self.captionsConfiguration.captionsUploadUrl = aiCaptions.uploadUrl
            self.captionsConfiguration.captionsTranscribeUrl = aiCaptions.transcribeUrl
            self.captionsConfiguration.apiKey = aiCaptions.apiKey
        }


        if let aiClipping = featuresConfig.aiClipping {
            self.autoCutConfiguration.embeddingsDownloadUrl = aiClipping.audioDataUrl
            self.autoCutConfiguration.musicApiSelectedTracksUrl = aiClipping.audioTracksUrl
        }

        self.editorConfiguration.isVideoAspectFillEnabled = featuresConfig.editorConfig.enableVideoAspectFill

        self.featureConfiguration.draftsConfig = featuresConfig.draftsConfig.value()

        if let gifPickerConfig = featuresConfig.gifPickerConfig {
            self.gifPickerConfiguration.giphyAPIKey = gifPickerConfig.giphyApiKey
        }

        // Make customization here

        AudioBrowserConfig.shared.setPrimaryColor(#colorLiteral(red: 0.2350233793, green: 0.7372031212, blue: 0.7565478683, alpha: 1))

        var featureConfiguration = self.featureConfiguration
        featureConfiguration.supportsTrimRecordedVideo = true
        featureConfiguration.isMuteCameraAudioEnabled = true
        self.updateFeatureConfiguration(featureConfiguration: featureConfiguration)
    }
}
