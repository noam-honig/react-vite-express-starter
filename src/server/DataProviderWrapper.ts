
import { DataProvider, EntityDataProvider, EntityDataProviderFindOptions, EntityMetadata, Filter, JsonDataProvider, repo } from 'remult';



export class DataProviderWrapper implements DataProvider{
    constructor(private dataProvider:DataProvider){
        this.ensureSchema = dataProvider.ensureSchema;
    }
    getEntityDataProvider(entity: EntityMetadata<any>): EntityDataProvider {
        return new EntityDataProviderWrapper(entity,this.dataProvider.getEntityDataProvider(entity))
    }
    async transaction(action: (dataProvider: DataProvider) => Promise<void>): Promise<void> {
        await this.dataProvider.transaction(async dp=>{
                await action(this)
        })
    }
    ensureSchema?(entities: EntityMetadata<any>[]): Promise<void> 
    isProxy?: boolean | undefined;
}
const cache = new Map<string,Map<string,any>>()
class EntityDataProviderWrapper implements EntityDataProvider{
    cache:Map<string,any>
    constructor(private meta:EntityMetadata<any>,private orig:EntityDataProvider){
        this.cache = cache.get(meta.key)!;
        if (!this.cache){
            cache.set(meta.key,this.cache = new Map())
        }
    }
    count(where: Filter): Promise<number> {
        return this.orig.count(where)
    }
    async find(options?: EntityDataProviderFindOptions | undefined): Promise<any[]> {
        
        const filter = ( options?.where as unknown as {toJson():any})?.toJson();
        const keys = Object.keys(filter);
        const id = filter["id"]
        const shouldCache = keys.length==1&&keys[0]==="id"&&id!==undefined
        if (shouldCache)    {
            let result = this.cache.get(id)
            if (result){
                console.log(`Found id ${id} in cache`)
                return result;
            }
        }
        else {
            console.log("Filter doesn't match cache")
        }
        
        
        const result = await  this.orig.find(options)
        if (shouldCache){
            this.cache.set(id,result)
            console.log(`Add id ${id} to cache`)
        }
        return result
    }
    update(id: any, data: any): Promise<any> {
        return this.orig.update(id,data)
    }
    delete(id: any): Promise<void> {
        return this.orig.delete(id)
    }
    insert(data: any): Promise<any> {
        return this.orig.insert(data)
    }
}