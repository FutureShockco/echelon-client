import { Client } from 'dsteem';
import store from "@/store";
import { AccountService } from "../services";

const CLIENT_OPTIONS = { timeout: 15000 };
const ORACLE_USERNAME = 'steemscript';
const ORACLE_PERMLINK = 'top-apps';

let rawClient = new Client('https://api.steemit.com', CLIENT_OPTIONS);
const handler = {
    get(target, prop) {
        if (prop === 'updateClient') {
            return address => {
                rawClient = new Client(address, CLIENT_OPTIONS);
            };
        }
        return rawClient[prop];
    },
};

const client = new Proxy({}, handler);
class AppsService {
    public async loadApps(): Promise<any> {
        const username = ORACLE_USERNAME;
        const step = 100;
        let follows = await client.call('follow_api', 'get_following', [username, '', 'blog', step]);
        let apps = follows.map(follow => follow.following);
        while (follows.length === step) {
            const startFrom = apps[apps.length - 1];
            // eslint-disable-next-line
            follows = await client.call('follow_api', 'get_following', [username, startFrom, 'blog', step]);
            follows = follows.map(follow => follow.following);
            apps.push(...follows.slice(1));
        }
        AccountService.findMany(apps).then(result =>{
            store.dispatch("network/setApps", 
                result
            );
        })
        return
    }

    public async loadTopApps(): Promise<(data: any[]) => any[]> {
        client.database.call('get_content', [ORACLE_USERNAME, ORACLE_PERMLINK]).then(content => {
            let metadata = [];
            try {
                metadata = JSON.parse(content.json_metadata);
            } catch (error) {
                console.log(error)
            }
            // @ts-ignore
            AccountService.findMany(metadata.data).then(result =>{
                store.dispatch("network/setTopApps", 
                    result
                );
            })
        });
        return
    }
}

export default new AppsService();
