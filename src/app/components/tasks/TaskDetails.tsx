import { Task } from "@/app/types/utils";

export function TaskDetails({task} : {task:Task}){

    // create/POST needs modal on taskTable 
    // others RUD need special row component TaskDetails
    /*
    completed: integer("completed", { mode: "boolean" }).default(false).notNull(),

    title: text("title").notNull(),
    
    important: integer("important").default(0).notNull(),
    */
    return <div className="flex flex-row">
        <input type="checkbox" checked={task.completed} onChange={()=>{}} />
        <span className={"mx-2 text-bold " + (task.important == 1 ? "text-green-500" : "text-red-500")}>{task.title}</span>
    </div>
}

