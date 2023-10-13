import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { prepareConnection } from 'db/index'
import { Article } from 'db/entity/index'
import { EXCEPTION_ARTICLE } from 'pages/api/config/code'



export default withIronSessionApiRoute(update, ironOptions);

async function update(req: NextApiRequest, res: NextApiResponse) {
    const { title = '', content = '', id = 0 } = req.body
    console.log(title, content, id,12121);
    
    const db = await prepareConnection()
    const articleRepo = db.getRepository(Article)
    const article = await articleRepo.findOne({//此处切记要加await 不然后面更新的可能是之前的信息
        where: {
            id:id
        },
        relations: ['user','tags']
    })

    if (article) {
        console.log(777,article);
        
        article.title = title
        article.content = content
        article.update_time = new Date()

        const resArticle = await articleRepo.save(article)
        if (resArticle) {
            res.status(200).json({ code: 0, name: resArticle, msg: '更新成功' })
        } else {
            res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILED })
        }
    }else{
        res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUND })
        
    }



}