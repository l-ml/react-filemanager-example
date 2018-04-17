import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  message,
  Table,
  Upload,
} from 'antd';
import filesize from 'filesize';

import './index.css';

const COLUMNS_CONFIG = [
  {
    title: 'Filename',
    dataIndex: 'filename',
    key: 'filename',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: 'Modified',
    dataIndex: 'modified',
    key: 'modified',
  },
];

/**
 * @class FileManager
 *
 * Handles displaying and uploading files.
 */
class FileManager extends Component {
  static displayName = 'FileManager';

  static propTypes = {
    backendUrl: PropTypes.string.isRequired,
  };

  state = {
    files: [],
    isLoadingFiles: true,
  }

  /**
   * React's lifecycle method.
   */
  componentDidMount = () => {
    this.fetchFiles();
  }

  /**
   * Adds actions to default columns config and returns it.
   * @returns {Array} Columns config with actions.
   */
  getColumnsConfig = () => (
    [
      ...COLUMNS_CONFIG,
      {
        title: 'Actions',
        key: 'actions',
        render: text => (
          <a href={`${this.props.backendUrl}/uploads/${text.filename}`}>Show</a>
        ),
      },
    ]
  )

  /**
   * Modifies files to be displayed in list.
   * @returns {Array} Files for list.
   */
  getFilesForList = () => (
    this.state.files.map((file, key) => ({
      ...file,
      key,
      size: filesize(file.size),
    }))
  )

  /**
   * Fetches files from provided backend url.
   */
  fetchFiles = () => {
    fetch(`${this.props.backendUrl}/files`)
      .then(response => response.json())
      .then((files) => {
        this.setState({ files });
      })
      .catch((error) => {
        message.error(`Error fetching files: ${error}`);
      })
      .then(() => {
        this.setState({ isLoadingFiles: false });
      });
  }

  /**
   * Handles upload's status changes.
   * @param {Object} info - Object containing upload information.
   */
  handleUploadChange = (info) => {
    const { file } = info;

    if (file.status === 'done') {
      this.setState({
        files: [
          ...this.state.files.filter(f => f.filename !== file.response.filename),
          file.response,
        ],
      });
      message.success(`${file.name} file uploaded successfully`);
    }

    if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`);
    }
  }

  /**
   * Renders file upload.
   * @returns {JSX} File upload.
   */
  renderFileUpload = () => (
    <div className="filemanager__fileupload">
      <Upload
        action={`${this.props.backendUrl}/files`}
        name="file"
        onChange={this.handleUploadChange}
      >
        <Button type="primary">
          <Icon type="upload" /> Upload new file
        </Button>
      </Upload>
    </div>
  )

  /**
   * Render file list.
   * @returns {JSX} List of files.
   */
  renderFileList = () => (
    <Table
      className="filemanager__list"
      columns={this.getColumnsConfig()}
      dataSource={this.getFilesForList()}
      loading={this.state.isLoadingFiles}
    />
  )

  /**
   * React's render function.
   * @returns {JSX} Contents of component.
   */
  render = () => (
    <div className="filemanager">
      { this.renderFileUpload() }
      { this.renderFileList() }
    </div>
  )
}

export default FileManager;
