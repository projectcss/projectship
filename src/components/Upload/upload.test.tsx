import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import axios from 'axios'
import {render, RenderResult, waitFor, fireEvent, getByText, createEvent} from '@testing-library/react'
import Upload,{UploadProps } from './upload'
jest.mock("../Icon/icon", () => {
    return (props: any) => {
      return <span onClick={props.onClick}>{props.icon}</span>;
    };
});

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const testProps: UploadProps = {
    action: "fakeurl.com",
    onSuccess: jest.fn(),
    onChange: jest.fn(),
    onRemove: jest.fn(),
    drag: true
}

let wrapper: RenderResult, fileInput: HTMLInputElement, uploadArea: HTMLElement;

const testFile = new File(['xyz'], 'test.png', {type: 'image/png'})
describe('test upload component', () => {
    beforeEach(() => {
        wrapper = render(<Upload {...testProps} >Click to upload</Upload>)
        fileInput = wrapper.container.querySelector('.viking-file-input') as HTMLInputElement
        uploadArea = wrapper.queryByText('Click to upload') as HTMLElement
    })

    it("upload process should works fine", async () => {
        const { queryByText } = wrapper;
        mockedAxios.post.mockResolvedValue({'data': 'cool'})
        expect(uploadArea).toBeInTheDocument();
        expect(fileInput).not.toBeVisible();
        fireEvent.change(fileInput,{target:{files: [testFile]}})
        expect(queryByText('spinner')).toBeInTheDocument();
        await waitFor (() => {
            expect(queryByText('test.png')).toBeInTheDocument()
        })
        expect(queryByText('check-circle')).toBeInTheDocument();
        expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile)
        expect(testProps.onChange).toHaveBeenCalledWith(testFile);

        //remove then uploaded file
        expect(queryByText('times')).toBeInTheDocument()
        fireEvent.click(wrapper.getByText('times'))
        expect(queryByText('test.png')).not.toBeInTheDocument();
    })

    it('drag and drop files should works file', async() => {
        fireEvent.dragOver(uploadArea);
        expect(uploadArea).toHaveClass('is-dragover');
        fireEvent.dragLeave(uploadArea);
        expect(uploadArea).not.toHaveClass('is-dragover')
        //由于jsdom不支持dataTransfer属性，只能用createEvent创建一个新的事件并添加dataTransfer属性
        const mockDropEvent = createEvent.drop(uploadArea)
        Object.defineProperty(mockDropEvent, "dataTransfer", {
          value: {
            files: [testFile]
          }
        })
        fireEvent(uploadArea, mockDropEvent)
        // await waitFor(() => {
        //     expect(wrapper.queryByText('test.png')).toBeInTheDocument()
        // })
        // expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile)
    })
})