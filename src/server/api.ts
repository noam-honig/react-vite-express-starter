import { remultExpress } from 'remult/remult-express';
import { Task } from '../shared/tasks';
import { JsonDataProvider, remult, repo } from 'remult';
import {JsonEntityFileStorage} from 'remult/server'
import { DataProviderWrapper } from './DataProviderWrapper';

export const api = remultExpress({
    dataProvider:async ()=>new DataProviderWrapper( new JsonDataProvider(new JsonEntityFileStorage("./db"))),
    entities:[Task],
    initRequest:async (req)=>{
        remult.context.setHeader = (key,value)=>req.setHeader(key,value)
    },
    initApi:async ()=>{
        if (!await repo(Task).count()){
            await repo(Task).insert([{title:'task1'},{title:'task2'}])
        }
    }
});

