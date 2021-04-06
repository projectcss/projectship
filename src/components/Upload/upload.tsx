import React, { ChangeEvent, useRef, useState } from 'react'
import  axios from 'axios'
import UploadList from './uploadList'
// import Button, { ButtonType } from  '../Button/button'
import Dragger from './dragger'

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadProps {
    
    /**
     * 定义上传地址
     */
    
    action: string;

    /**
     * 定义文件上传的进度，参数为上传的百分比以及具体的文件
     */

    onProgress?: (percentage: number, file: File) => void;

    /**
     * 定义上传成功的回调函数
     */

    onSuccess?: (data: any, file: File) => void;

    /**
     * 定义上传失败的回调函数
     */

    onError?: (err: any, file: File) => void;

    /**
     * 定时befoewUpload生命周期函数，在上传文件之前触发该生命周期,可以去检查我们的文件是否符合规定
     * 或者将我们的文件进行过滤转换
     */

    beforeUpload?: (file: File) => boolean | Promise<File>

    /**
     * 定义onChange函数
     */

    onChange?: (file: File) => void;

    /** 
     * 自定义已经上传的文件信息
     */
    defaultFileList?: UploadFile[];

    /**
     * 定义移除文件事件
     */
    onRemove?: (file: UploadFile) => void;

    /**
     * 增加自定义请求头信息
     */
    headers?: {[key: string]: any}

    /**
     * 增加自定义文件名称
     */
    name?: string;

    /**
     * 增加自定义数据
     */

    data?: {[key: string]: any}

    /**
     * 定义发送请求时是否携带cookie
     */

    withCredentials?: boolean

    /**
     * 定义发送数据的类型
     */
    accept?: string;

    /**
     * 上传文件是否支持多选
     */
    multiple?: boolean;
    
    /**
     * 是否支持拖动文件上传
     */
    drag?: boolean;
}

//定义文件列表信息
export interface UploadFile {
    /**
     * 定义文件的id
     */
    uid: string;

    /**
     * 定义文件得大小
     */
    size: number;

    /**
     * 定义文件的名称，从原生的file中取出来
     */
    name: string;

    /**
     * 定义文件当前上传状态
     */
    status?: UploadFileStatus;

    /**
     * 定义文件上传百分比
     */
    percent?: number;
    
    /**
     * 保存文件的原始信息
     */
    row?: File;

    /**
     *定义成功上传的信息 
     */
    response?: any;

    /**
     * 定义上传出错的信息
     */
    error?: any;

} 


const Upload: React.FC<UploadProps> = (props) => {
    const {
        action,
        onError,
        onProgress,
        onSuccess,
        beforeUpload,
        onChange,
        defaultFileList,
        onRemove,
        headers,
        name,
        data,
        withCredentials,
        accept,
        multiple,
        children
    } = props;
    const [fileList,setFileList] = useState<UploadFile[]>(defaultFileList || [])
    const fileInput = useRef<HTMLInputElement>(null);
    const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
      setFileList(prevList => {
          return prevList.map(item => {
              if(item.uid === updateFile.uid) {
                  return {...item, ...updateObj}
              } else {
                  return item;
              }
          })
      })  
    } 
    const handleClick = () => {
        if(fileInput.current) {
            fileInput.current.click();
        }
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) {
            return;
        }
        uploadFile(files);
        if(fileInput.current) {
            fileInput.current.value = '';
        }
    }
    const handleRemove = (file: UploadFile) => {
        setFileList(prevList => {
            return prevList.filter(item => item.uid !== file.uid)
        })
        if(onRemove) {
            onRemove(file)
        }
    }
    const uploadFile = (files: FileList) => {
        const fileArray = Array.from(files);
        fileArray.forEach((file) => {
            if(!beforeUpload) {
                post(file)
            }else{
                const result = beforeUpload(file);
                if(result && result instanceof Promise)
                {
                    result.then(processedFile => {
                        post(processedFile)
                    })
                } else if(result !== false) {
                    post(file)
                }
            }
        })
    }
    const post = (file: File) => {
        let _file: UploadFile = {
            uid: Date.now() + 'upload-file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            row: file
        }
        setFileList(prevList => {
            return [...prevList, _file];
        })
        const formData = new FormData();
        formData.append(name || 'file', file);
        if(data) {
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            })
        }
        axios.post(action, formData, {
            headers:{
                ...headers,
                'Context-type': 'multipart/form-data'
            },
            withCredentials,
            onUploadProgress: (e) => {
              //获取当前上体积与总体积
              let percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if(percentage < 100) {
                    updateFileList(_file, {status:'uploading', percent:percentage})
                    if (onProgress) {
                        onProgress(percentage, file)
                    }
                }
            }
        }).then((res) => {
            updateFileList(_file, {status:'success', response: res.data})
            if(onSuccess) {
                onSuccess(res.data,file);
            }
            if(onChange) {
                onChange(file)
            }
        }).catch((err) => {
            updateFileList(_file, {status:'error', error: err})
            if(onError) {
                onError(err,file);
            }
            if(onChange) {
                onChange(file)
            }
        })
    }
    return (
        <div>
            <div onClick={handleClick} className="viking-upload-wrapper">
                <Dragger onFile={(files) => {uploadFile(files)}}>
                    {children}
                </Dragger>
            </div>
            <input  
                className="viking-file-input" 
                type="file" 
                ref={fileInput}
                style={{display: 'none'}}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
                />
            <UploadList
                fileList={fileList}
                onRemove={handleRemove}
            />
        </div>
    )
}
Upload.defaultProps = {
    name: 'file'
}
export default Upload