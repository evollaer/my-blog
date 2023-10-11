import userStore, { IUserStore } from './userStore'

export interface IStore {
    user: IUserStore;
}

export default function createStore(initialValue: any): () => IStore {
    return () => {
        return {
            //先用userStore()初始化，再接收initialValue中的user信息对前面的进行覆盖
            user: { ...userStore(), ...initialValue?.user },
            // article: { ...userStore(), ...initialValue?.user },
        }
    }
}