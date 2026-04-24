import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Platform } from 'react-native';

import VideoEditorPlugin, {
  FeaturesConfigBuilder,
} from 'video-editor-react-native';

const LICENSE_TOKEN = SET BANUBA LICENSE TOKEN

export default class App extends Component {

  private featuresConfig = new FeaturesConfigBuilder()
    // Set release Video Editor SDK on Export to false to open last edited video
    .setReleaseOnExport(false)
    .build();

  private draftID: string | null = null

  constructor() {
    super();
    this.state = {
      errorText: '',
    };
  }

  handleVideoExport(response) {
    let exportedVideoSources = response?.exportedVideoSources
    let exportedPreview = response?.exportedPreview
    let exportedMeta = response?.exportedMeta
    let exportedDraftId = response?.savedDraftId
    console.log('Export completed successfully: video = ' + exportedVideoSources + '; videoPreview = '
      + exportedPreview + "; meta = " + exportedMeta + ": savedDraftId = " + exportedDraftId);

    this.draftID = exportedDraftId
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
      case 'ERR_MISSING_DRAFT_ID':
        message = "Provided Draft ID doesn't exist!";
      case 'ERR_VIDEO_EXPORT_CANCEL':
        message = "The user has canceled video editing flow!";
      case 'ERR_ENTRY_NOT_SUPPORTED':
        message = "Draft by ID is not supported on Android"
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

  handleVideoEditor(response) {
    console.log(response);
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
                const videoEditor = new VideoEditorPlugin();
                videoEditor.openFromDraft(LICENSE_TOKEN, this.featuresConfig, this.draftID ?? "")
                  .then(response => this.handleVideoExport(response))
                  .catch(e => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>Open Video Editor - Draft</Text>
            </TouchableOpacity>

            // Delete the draft and release the Video Editor SDK on user done action
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const videoEditor = new VideoEditorPlugin();
                videoEditor.deleteDraft(this.draftID ?? "")
                  .then(response => {
                      this.handleVideoEditor(response)
                      videoEditor.release()
                        .then(response => this.handleVideoEditor(response))
                  })
                  .catch(e => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>Delete Draft</Text>
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
