import React from 'react';
import { shallow } from 'enzyme';
import filesize from 'filesize';

import FileManager from './index';

const backendUrl = 'http://localhost.mock';
const testFile = {
  filename: 'testfile.png',
  size: 100,
  created: '2018-01-01 10:00:00',
  modified: '2018-01-01 10:00:00',
};

let wrapper;

describe('FileManager component', () => {
  beforeEach(() => {
    wrapper = shallow(<FileManager backendUrl={backendUrl} />);
  });

  it('should render without crashing', () => {
    expect(wrapper.find('.filemanager').length).toBe(1);
    expect(fetch).toHaveBeenCalledWith(`${backendUrl}/files`);
  });

  it('should render file list', () => {
    expect(wrapper.find('.filemanager__list').length).toBe(1);
  });

  it('should render file upload', () => {
    expect(wrapper.find('.filemanager__fileupload').length).toBe(1);
  });

  describe('fetchFiles function', () => {
    it('should fetch files from given backend url', () => {
      wrapper.instance().fetchFiles();
      expect(global.fetch).toHaveBeenLastCalledWith(`${backendUrl}/files`);
    });
  });

  describe('getColumnsConfig function', () => {
    it('should add actions to default columns config', () => {
      expect(wrapper.instance().getColumnsConfig().find(column => column.key === 'actions'));
    });
  });

  describe('getFilesForList function', () => {
    it('should add key and display filesize in human readable format', () => {
      wrapper.setState({ files: [testFile] });
      const filesForList = wrapper.instance().getFilesForList();
      expect(filesForList[0].key).toBe(0);
      expect(filesForList[0].size).toBe(filesize(testFile.size));
    });
  });

  describe('handleUploadChange function', () => {
    it('should add new file to list after successful upload', () => {
      const info = {
        file: {
          status: 'done',
          response: testFile,
        },
      };
      wrapper.instance().handleUploadChange(info);
      expect(wrapper.state().files).toEqual([testFile]);
    });
  });
});
