import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';

import VideoEditorPlugin from 'video-editor-react-native';

import { launchImageLibrary } from 'react-native-image-picker';

const LICENSE_TOKEN = SET BANUBA LICENSE TOKEN

const videoOptions = { mediaType: 'video' };

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      errorText: '',
    };
  }

  handleVideoExport(response) {
    let exportedVideoUri = response?.videoUri
    let exportedPreviewUri = response?.previewUri
    console.log('Export completed successfully: video = ' + exportedVideoUri + '; videoPreview = '
      + exportedPreviewUri);
  }

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
        <Text style={{ padding: 16, textAlign: 'center', fontSize: 18 }}>
          Sample integration of Banuba Video and Photo Editor into React Native
        </Text>

        <Text
          style={{
            padding: 16,
            textAlign: 'center',
            color: '#ff0000',
            fontSize: 16,
            fontWeight: '800',
          }}>
          {this.state.errorText}
        </Text>

        <View style={{ marginVertical: 8 }}>
          <Button title="Open Video Editor - Default"
            onPress={async () => {
              const videoEditor = new VideoEditorPlugin();
              videoEditor.openFromCamera(LICENSE_TOKEN)
                .then(response => { this.handleVideoExport(response); })
                .catch(e => { this.handleSdkError(e); });
            }
            }
          />
        </View>

        <View style={{ marginVertical: 8 }}>
          <Button title="Open Video Editor - PIP"
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
                    videoEditor.openFromPip(LICENSE_TOKEN, videoUri)
                      .then(response => { this.handleVideoExport(response); })
                      .catch(e => { this.handleSdkError(e); });
                  }
                },
              );
            }
            }
          />
        </View>

        <View style={{ marginVertical: 8 }}>
          <Button title="Open Video Editor - Trimmer"
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
                    videoEditor.openFromTrimmer(LICENSE_TOKEN, videoSources)
                      .then(response => { this.handleVideoExport(response); })
                      .catch(e => { this.handleSdkError(e); });
                  }
                },
              );
            }
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
