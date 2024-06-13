
import BanubaVideoEditorSDK
import BanubaUtilities

class FlutterCustomViewFactory: ExternalViewControllerFactory {
    // Set nil to use BanubaAudioBrowser
    var musicEditorFactory: MusicEditorExternalViewControllerFactory? = nil
    
    var countdownTimerViewFactory: CountdownTimerViewFactory?
    
    var exposureViewFactory: AnimatableViewFactory?
}

