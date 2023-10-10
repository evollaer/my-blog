import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { prepareConnection } from 'db/index'
import { User, UserAuth } from 'db/entity/index'
import { message } from 'antd';



export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body);
    const session: ISession = req.session
    const { phone = '', verify = '', identity_type = 'phone' } = req.body;
    console.log('222', phone, verify);

    const db = await prepareConnection();

    const userAuthRepo = db.getRepository(UserAuth)

    const userRepo = db.getRepository(User)
    const users = userRepo.find();
    console.log(users);

    if (String(session.verifyCode) === String(verify)) {
        //验证码正确，到user_auth中查找  identity_type 是否有记录
        const userAuth = await userAuthRepo.findOne(
            {
                identity_type,
                identifier: phone
            },
            {
                relations: ['user']
            }
        )
        if (userAuth) {
            console.log(333, userAuth);

            //已存在用户
            const user = userAuth.user
            const { id, nickname, avatar } = user

            session.userId = id;
            session.nickname = nickname;
            session.avatar = avatar;
            await session.save()
            res?.status(200).json({
                code: 0,
                msg: '登录成功',
                data: {
                    userId: id,
                    nickname,
                    avatar
                }
            })
        } else {
            //新用户自动注册
            const user = new User()
            user.nickname = `用户_${Math.floor(Math.random() * 10000)}`
            user.avatar = `/images/avatar.jpg`
            user.job = '暂无'
            user.introduce = '暂无'

            const userAuth = new UserAuth()
            userAuth.identity_type = identity_type
            userAuth.identifier = phone
            userAuth.credential = session.verifyCode
            userAuth.user = user

            const resUserAuth = await userAuthRepo.save(userAuth)
            const { user: { id, nickname, avatar } } = resUserAuth

            console.log(444, resUserAuth);


            session.userId = id;
            session.nickname = nickname;
            session.avatar = avatar;
            await session.save()
            message.error('登录成功！')

            res?.status(200).json({
                code: 0,
                msg: '登录成功',
                data: {
                    userId: id,
                    nickname,
                    avatar
                }
            })
            
        }
    } else {
        console.log('验证码错误');
        
        res?.status(200).json({
            code: -1,
            msg: '验证码错误！',
        })
        message.error('验证码错误！')
    }

    // res?.status(200).json({
    //     phone, verify, code: 0,
        
    // })

}