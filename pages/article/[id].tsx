import Link from 'next/link'
import { prepareConnection } from 'db/index'
import { observer } from 'mobx-react-lite';
import { useStore } from 'store/index';
import MarkDown from 'markdown-to-jsx';
import { Article } from 'db/entity'
import { IArticle } from 'pages/api';
import styles from './index.module.scss'
import { Avatar } from 'antd';

interface IProps {
    article: IArticle
}

export async function getServerSideProps({ params }: any) {
    console.log(222);
    // console.log(params);//{ id: '1' },也就是这条信息的id

    const articleId = params?.id;
    const db = await prepareConnection()
    const articleRepo = db.getRepository(Article)
    const article = await articleRepo.findOne({
        where: {
            id: articleId
        },
        relations: ['user']
    })
    // console.log(4545, articles);

    if (article) {
        //阅读次数加一
        article.views = article?.views + 1
        await articleRepo.save(article)
    }
    return {
        props: {
            article: JSON.parse(JSON.stringify(article))
        }
    }

}

const ArticleDetail = (props: IProps) => {
    const { article } = props
    const store = useStore()
    const loginUserInfo = store?.user?.userInfo

    const { user: { nickname, avatar, id } } = article

    return <div>
        <div className='content-layout'>
            <h2 className={styles.title}>{article?.title}</h2>
            <div className={styles.user}>
                <Avatar src={avatar} size={50} />
                <div className={styles.info}>
                    <div className={styles.name}>
                        {nickname}
                    </div>
                    <div className={styles.date}>
                        <div>{article?.update_time}</div>
                        <div>阅读 {article?.views}</div>
                        {
                            Number(loginUserInfo?.userId) === Number(id) && (
                                <Link href={`/editor/${article?.id}`}>编辑</Link>
                            )
                        }
                    </div>
                </div>
            </div>
            <MarkDown>
                {article?.content}
            </MarkDown>
        </div>
    </div>
}

export default observer(ArticleDetail)