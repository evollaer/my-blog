import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, message, Select } from 'antd';
import styles from './index.module.scss';
import request from 'service/fetch';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store/index';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor = () => {
  const store = useStore()
  const { push } = useRouter()
  const { userId } = store.user.userInfo;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagIds, setTagIds] = useState([])
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res.code === 0) {
        console.log(res?.data?.allTags);

        setAllTags(res?.data?.allTags || [])
      }
    })
  }, [])

  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题')
      return
    }

    request.post('/api/article/publish', {
      title,
      content,
      tagIds
    }).then((res: any) => {
      if (res?.code === 0) {
        message.success('发布成功')
        userId ? push(`/user/${userId}`) : push('/')
      } else {
        message.error(res?.msg || '发布失败')
      }
    })
  };

  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };

  const handleSelect = (value: []) => {
    setTagIds(value)
  }

  const handleContentChange = (content: any) => {
    setContent(content)
  }
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange} />
        <Select className={styles.tag} mode='multiple' allowClear placeholder='请选择标签' onChange={handleSelect}
          options={
            allTags?.map((tag: any) => {
              return { label: tag?.title, value: tag.id }
            })
          }
          size='large'
        />
        <Button type="primary" onClick={handlePublish}>
          发布
        </Button>
      </div>
      <div className={styles.editorContainer}>
        <MDEditor value={content} height={'100%'} onChange={handleContentChange} />
      </div>
    </div>
  );
};

(NewEditor as any).layout = null;

export default observer(NewEditor);
