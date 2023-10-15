import { prepareConnection } from 'db';
import { Article, Tag } from 'db/entity'
import { Divider } from 'antd'
import ListItem from 'components/ListItem';
import { IArticle } from 'pages/api/index';
import classNames from 'classnames';
import { useState,useEffect } from 'react';
import styles from './index.module.scss';
import request from 'service/fetch';

interface ITag {
  id: number;
  title: string;
}
interface IProps {
  articles: IArticle[],
  tags: ITag[]
}

export async function getServerSideProps() {
  const db = await prepareConnection()
  const articles = await db.getRepository(Article).find({
    relations: ['user', 'tags']
  })

  const tags = await db.getRepository(Tag).find({
    relations: ['users']
  })

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || []
    }
  }

}

const Home = (props: IProps) => {
  const { articles, tags } = props
  console.log(tags,'tags');
  
  const [selectTag, setSelectTag] = useState(0)
  const [showArticles,setShowArticles] = useState([...articles])
  
  const handleSelectTag = (event: any) => {
    const { tagid } = event?.target?.dataset || {}
    console.log(tagid);

    setSelectTag(Number(tagid))
  }
  useEffect(()=>{
    selectTag&&request.get(`/api/article/get?tag_id=${selectTag}`).then((res:any)=>{
      if (res.code===0) {
        setShowArticles(res?.data)
      }
    })
  },[selectTag])

  return <div>
    <div className={styles.tags} onClick={handleSelectTag}>
      {tags?.map((tag) => (
        <div key={tag?.id} data-tagid={tag?.id} className={classNames(styles.tag, selectTag === tag?.id ? styles['active'] : '')}>
          {tag?.title}
        </div>
      ))}

    </div>
    <div className='content-layout'>
      {showArticles?.map(article => (
        <>
          <ListItem article={article} key={article?.id}></ListItem>
          <Divider />
        </>
      ))}
    </div>
  </div>;
};

export default Home;
