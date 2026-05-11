import { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

import VideoEditorPlugin, {
  FeaturesConfigBuilder,
  TemplatesConfig,
} from 'video-editor-react-native';

import {
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

const LICENSE_TOKEN = SET BANUBA LICENSE TOKEN

const videoOptions: ImageLibraryOptions = { mediaType: 'video' };

type AppState = {
  errorText: string;
};

export default class App extends Component<Record<string, never>, AppState> {
  private featuresConfig = new FeaturesConfigBuilder()
    // Specify your Config params in the builder below
    //.setAudioBrowser(...)
    //...
    .build();

  private templateBuilderFeaturesConfig = new FeaturesConfigBuilder()
    .setTemplatesConfig(
      new TemplatesConfig({
        url: null,
        enableBuilder: true,
        termsOfUseUrl: 'https://www.banuba.com/terms',
      })
    )
    .build();

  //   Export Data example

  // private exportData = new ExportData({
  //   exportedVideos: [
  //     new ExportedVideo({
  //       fileName: 'export_hd',
  //       videoResolution: VideoResolution.fhd1080p,
  //     }),
  //     new ExportedVideo({
  //       fileName: 'export_auto',
  //       videoResolution: VideoResolution.auto,
  //     }),
  //   ],
  //   watermark: new Watermark({
  //     imagePath: 'watermark.png',
  //     alignment: WatermarkAlignment.topLeft,
  //   }),
  // });

  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      errorText: '',
    };
  }

  handleVideoExport(response: any) {
    let exportedVideoSources = response?.exportedVideoSources;
    let exportedPreview = response?.exportedPreview;
    let exportedMeta = response?.exportedMeta;
    let exportedDraftId = response?.savedDraftId;
    console.log(
      'Export completed successfully: video = ' +
        exportedVideoSources +
        '; videoPreview = ' +
        exportedPreview +
        '; meta = ' +
        exportedMeta +
        ': savedDraftId = ' +
        exportedDraftId
    );
  }

  handleSdkError(e: { code?: string; message?: string }) {
    console.log('handle sdk error = ' + e.code);

    var message = '';
    switch (e.code) {
      case 'ERR_SDK_NOT_INITIALIZED':
        message =
          'Failed to initialize SDK!!! The license token is incorrect: empty or truncated. Please check the license token and try again.';
        break;
      case 'ERR_SDK_LICENSE_REVOKED':
        message =
          'WARNING!!! YOUR LICENSE TOKEN EITHER EXPIRED OR REVOKED! Please contact Banuba';
        break;
      case 'ERR_MISSING_EXPORT_RESULT':
        message =
          'Missing export result: video export has not been completed successfully. Please try again';
        break;
      case 'ERR_MISSING_HOST':
        message = 'Missing host Activity to start video editor';
        break;
      case 'ERR_MISSING_DRAFT_ID':
        message = "Provided Draft ID doesn't exist!";
        break;
      case 'ERR_VIDEO_EXPORT_CANCEL':
        message = 'The user has canceled video editing flow!';
        break;
      case 'ERR_ENTRY_NOT_SUPPORTED':
        message = 'Draft by ID is not supported on Android';
        break;
      case 'ERR_INVALID_PARAMS':
        message = e.message ?? '';
        break;
      default:
        message = '';
        console.log(
          'Banuba ' +
            Platform.OS.toUpperCase() +
            ' Video Editor export failed = ' +
            e
        );
        break;
    }
    this.setState({ errorText: message });
  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.appBar}>
          <Text style={styles.appBarTitle}>
            Video Editor React Native plugin
          </Text>
        </SafeAreaView>
        <View style={styles.content}>
          <View style={styles.errorContainer}>
            {this.state.errorText ? (
              <Text style={styles.errorText}>{this.state.errorText}</Text>
            ) : null}
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const videoEditor = new VideoEditorPlugin();
                videoEditor
                  .openFromCamera(LICENSE_TOKEN, this.featuresConfig)
                  .then((response) => this.handleVideoExport(response))
                  .catch((e) => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>Open Video Editor - Default</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const videoEditor = new VideoEditorPlugin();
                videoEditor
                  .openFromTemplates(LICENSE_TOKEN, this.featuresConfig)
                  .then((response) => this.handleVideoExport(response))
                  .catch((e) => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>
                Open Video Editor - Templates
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const videoEditor = new VideoEditorPlugin();
                videoEditor
                  .openFromTemplates(
                    LICENSE_TOKEN,
                    this.templateBuilderFeaturesConfig
                  )
                  .then((response) => this.handleVideoExport(response))
                  .catch((e) => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>
                Open Video Editor - Templates Builder
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                launchImageLibrary(videoOptions, (response) => {
                  console.log('Response = ', response);
                  if (response.didCancel) {
                    console.warn('User cancelled photo picker');
                  } else if (response.errorCode) {
                    console.warn('ImagePicker Error: ', response.errorMessage);
                  } else {
                    let videoUri = response.assets?.[0]?.uri;
                    if (!videoUri) {
                      console.warn(
                        'Cannot start video editor in pip mode: please pick video file'
                      );
                      return;
                    }
                    console.log('# Picked video source for pip = ' + videoUri);

                    const videoEditor = new VideoEditorPlugin();
                    videoEditor
                      .openFromPip(LICENSE_TOKEN, this.featuresConfig, videoUri)
                      .then((exportResponse) => {
                        this.handleVideoExport(exportResponse);
                      })
                      .catch((e) => {
                        this.handleSdkError(e);
                      });
                  }
                });
              }}
            >
              <Text style={styles.buttonText}>Open Video Editor - PIP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                launchImageLibrary(videoOptions, (response) => {
                  console.log('Response = ', response);
                  if (response.didCancel) {
                    console.warn('User cancelled photo picker');
                  } else if (response.errorCode) {
                    console.warn('ImagePicker Error: ', response.errorMessage);
                  } else {
                    let videoUri = response.assets?.[0]?.uri;
                    if (!videoUri) {
                      console.warn(
                        'Cannot start video editor in trimmer mode: please pick video file'
                      );
                      return;
                    }
                    console.log(
                      '# Picked video source for trimmer = ' + videoUri
                    );
                    let videoSources = [videoUri];

                    const videoEditor = new VideoEditorPlugin();
                    videoEditor
                      .openFromTrimmer(
                        LICENSE_TOKEN,
                        this.featuresConfig,
                        videoSources
                      )
                      .then((exportResponse) => {
                        this.handleVideoExport(exportResponse);
                      })
                      .catch((e) => {
                        this.handleSdkError(e);
                      });
                  }
                });
              }}
            >
              <Text style={styles.buttonText}>Open Video Editor - Trimmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  appBar: {
    backgroundColor: 'black',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  appBarTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorContainer: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 17,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'black',
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
