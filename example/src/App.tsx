import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Platform } from 'react-native';

import VideoEditorPlugin, {
  AiClipping,
  AiCaptions,
  AudioBrowser,
  AudioBrowserSource,
  DraftsConfig,
  DraftsOption,
  EditorConfig,
  GifPickerConfig,
  FeaturesConfigBuilder,
  ExportData,
  ExportedVideo,
  Watermark,
  VideoResolution,
  WatermarkAlignment,
  VideoDurationConfig,
} from 'video-editor-react-native';

import PhotoEditorPlugin from 'pe-sdk-react-native';

import { launchImageLibrary } from 'react-native-image-picker';

const LICENSE_TOKEN = SET BANUBA LICENSE TOKEN

const videoOptions = { mediaType: 'video' };

export default class App extends Component {

  private featuresConfig = new FeaturesConfigBuilder()
    // Specify your Config params in the builder below
    //.setAudioBrowser(...)
    //...
    .setProcessPictureExternally(true)
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

  constructor() {
    super();
    this.state = {
      errorText: '',
    };
  }

  handleVideoExport = async(response) => {
    let exportedVideoSources = response?.exportedVideoSources
    let exportedPreview = response?.exportedPreview
    let exportedMeta = response?.exportedMeta
    console.log('Export completed successfully: video = ' + exportedVideoSources + '; videoPreview = '
      + exportedPreview + "; meta = " + exportedMeta);

    // exportedVideoSource is an empty Array in case of exporting the photo from the Video Editor

    if (Array.isArray(exportedVideoSources) && exportedVideoSources.length === 0) {

      // Open Photo Editor after Video Editor export
      await this.openPhotoEditorWithImagePath(response?.exportedPreview)

    }
  }

  handlePhotoExport(response) {
    let exportedPhotoSource = response?.exportedPhotoSource;
    this.setState({ imageUri: `file://${exportedPhotoSource}` });
    console.log('Export completed successfully: photo = ' + imageUri);
  }

  openPhotoEditorWithImagePath = async (photoUri: string) => {
        const photoEditor = new PhotoEditorPlugin();
        photoEditor
          .openFromEditor(LICENSE_TOKEN, photoUri)
          .then((response) => this.handlePhotoExport(response))
          .catch((e) => this.handleSdkError(e));
      };

  handleSdkError(e) {
    console.log('handle sdk error = ' + e.code);

    var message = '';
    switch (e.code) {
      case 'ERR_SDK_NOT_INITIALIZED':
        message = 'Failed to initialize SDK!!! The license token is incorrect: empty or truncated. Please check the license token and try again.';
        break;
      case 'ERR_SDK_LICENSE_REVOKED':
        message = 'WARNING!!! YOUR LICENSE TOKEN EITHER EXPIRED OR REVOKED! Please contact Banuba';
        break;
      case 'ERR_MISSING_EXPORT_RESULT':
        message = 'Missing export result: video export has not been completed successfully. Please try again';
      case 'ERR_MISSING_HOST':
        message = "Missing host Activity to start video editor";
      case 'ERR_VIDEO_EXPORT_CANCEL':
        message = "The user has canceled video editing flow!";
      case 'ERR_PHOTO_EXPORT_CANCEL':
        message = 'The user has canceled photo editing flow!';
      case 'ERR_INVALID_PARAMS':
        message = e.message;
      default:
        message = '';
        console.log(
          'Banuba ' +
          Platform.OS.toUpperCase() +
          ' Video Editor export failed = ' +
          e,
        );
        break;
    }
    this.setState({ errorText: message });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            Sample integration of Banuba Video into React Native project
          </Text>
        </View>
        <View style={styles.buttonsWrapper}>
          <View style={styles.buttonsContainer}>
            {this.state.errorText ? (
              <Text style={styles.errorText}>{this.state.errorText}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const videoEditor = new VideoEditorPlugin();
                videoEditor.openFromCamera(LICENSE_TOKEN, this.featuresConfig)
                  .then(response => this.handleVideoExport(response))
                  .catch(e => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>Open Video Editor - Default</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                launchImageLibrary(
                  videoOptions,
                  (response) => {
                    console.log('Response = ', response);
                    if (response.didCancel) {
                      console.warn('User cancelled photo picker');
                    } else if (response.error) {
                      console.warn('ImagePicker Error: ', response.error);
                    } else {
                      let videoUri = response.uri || response.assets?.[0]?.uri;
                      console.log('# Picked video source for pip = ' + videoUri);

                      const videoEditor = new VideoEditorPlugin();
                      videoEditor.openFromPip(LICENSE_TOKEN, this.featuresConfig, videoUri)
                        .then(response => { this.handleVideoExport(response); })
                        .catch(e => { this.handleSdkError(e); });
                    }
                  },
                );
              }}
            >
              <Text style={styles.buttonText}>Open Video Editor - PIP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                launchImageLibrary(
                  videoOptions,
                  (response) => {
                    console.log('Response = ', response);
                    if (response.didCancel) {
                      console.warn('User cancelled photo picker');
                    } else if (response.error) {
                      console.warn('ImagePicker Error: ', response.error);
                    } else {
                      let videoUri = response.uri || response.assets?.[0]?.uri;
                      console.log('# Picked video source for trimmer = ' + videoUri);
                      let videoSources = [videoUri];

                      const videoEditor = new VideoEditorPlugin();
                      videoEditor.openFromTrimmer(LICENSE_TOKEN, this.featuresConfig, videoSources)
                        .then(response => { this.handleVideoExport(response); })
                        .catch(e => { this.handleSdkError(e); });
                    }
                  },
                );
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
  headerContainer: {
    height: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonsWrapper: {
    position: 'absolute',
    top: 50,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonsContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
