import { prepareConnection } from 'db/index'
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
import { Article } from 'db/entity'
import { IArticle } from 'pages/api';

interface IProps {
    article: IArticle
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export async function getServerSideProps({ params }: any) {
    // console.log(params);//{ id: '1' },也就是这条信息的id

    const articleId = params?.id;
    const db = await prepareConnection()
    const articleRepo = db.getRepository(Article)
    const article = await articleRepo.findOne({
        where: {
            id: articleId
        },
        relations: ['user','tags']
    })

    return {
        props: {
            article: JSON.parse(JSON.stringify(article))
        }
    }

}
const ModifyEditor = ({ article }: IProps) => {
    
    
    const store = useStore()
    const { push, query } = useRouter()
    const articleId = Number(query?.id)
    const [title, setTitle] = useState(article?.title || '');
    const [content, setContent] = useState(article?.content || '');
    const [tagIds, setTagIds] = useState([])
    const [allTags, setAllTags] = useState([])
    console.log(article);
    
    useEffect(() => {
        request('/api/tag/get').then((res: any) => {
            if (res.code === 0) {
                console.log(res?.data?.allTags);

                setAllTags(res?.data?.allTags || [])
            }
        })
    }, [])
    useEffect(()=>{
        if (article?.tags.length) {
            let tags=article?.tags.map(item=>{
                return item.id
            })
            console.log(tags);
            setTagIds(tags||[])
        }

    },[allTags])
    const handlePublish = () => {
        if (!title) {
            message.warning('请输入文章标题')
            return
        }

        request.post('/api/article/update', {
            id: articleId,
            title,
            content,
            tagIds
        }).then((res: any) => {
            if (res?.code === 0) {
                message.success('更新成功')
                articleId ? push(`/article/${articleId}`) : push('/')
            } else {
                message.error(res?.msg || '更新失败')
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

(ModifyEditor as any).layout = null;

export default observer(ModifyEditor);
