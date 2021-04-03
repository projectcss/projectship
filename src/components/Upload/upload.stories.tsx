import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Upload from "./upload";
const checkfileSize = (file: File) => {
  if(Math.round(file.size / 1024) > 50) {
    alert("file too big")
    return false
  }
  return true;
}

const filePromise = (file: File) => {
  //新建一个新的file文件
  const newFile = new File([file], Date.now()+'new_name.docx', {type: file.type})
  console.log(newFile)
  return Promise.resolve(newFile)
}

const SimpleUpload = () => {
  return (
    <Upload
      action="http://jsonplaceholder.typicode.com/posts"
      onProgress={action("progress")}
      onSuccess={action('success')}
      onError = {action('error')}
      beforeUpload = {filePromise}
    >
    </Upload>
  );
};

storiesOf("Upload component", module)
.add("Upload", SimpleUpload);
