import React from 'react'
import { UploadFile } from './upload'
import Icon from '../Icon/icon'
interface UploadListProps {
    fileList: UploadFile[];
    onRemove: (file: UploadFile) => void;
}

const UplaodList:React.FC<UploadListProps> = (props) => {
    const {
        fileList,
        onRemove
    } = props;

    return (
        <ul className="viking-upload-list">
            {
                fileList.map(item => {
                    return(
                        <li className="viking-upload-list-item" key={item.uid}>
                            <span className={`file-name file-name-${item.status}`}>
                                <Icon icon="file-alt" theme="secondary"/>
                                {item.name}
                            </span>
                            <span className="file-status">
                                {(item.status === 'uploading' || item.status === 'ready') && <Icon icon="spinner" spin theme="primary" />}
                                {item.status === 'success' && <Icon icon="check-circle" theme="success" />}
                                {item.status === 'error' && <Icon icon="times-circle" theme="danger" />}
                            </span>
                            <span className="file-actions">
                                <Icon icon="times" onClick={() => { onRemove(item)}}/>
                            </span>
                        </li>
                    )
                })
            }
        </ul>
    )
} 

export default UplaodList