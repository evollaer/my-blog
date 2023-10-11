import type { NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Input, Button } from 'antd';
import styles from './index.module.scss';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePublish = () => {};

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange} />
        <Button type="primary" onClick={handlePublish}>
          发布
        </Button>
      </div>
      <div className={styles.editorContainer}>
        <MDEditor value={content} height={'100%'} onChange={setContent} />
      </div>
    </div>
  );
};

NewEditor.layout = null;

export default NewEditor;
