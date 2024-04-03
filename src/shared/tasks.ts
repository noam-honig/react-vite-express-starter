import { Entity, Fields, remult } from "remult";

@Entity("tasks",{
    allowApiCrud:true,
    allowApiRead:()=>{
        remult.context.setHeader?.("noam","test");
        return true
    }
})
export class Task {
    @Fields.cuid()
    id = ''
    @Fields.string()
    title = ''
}