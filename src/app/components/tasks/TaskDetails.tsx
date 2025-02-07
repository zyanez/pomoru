import { Task } from "@/app/types/utils";
import { Check, Clock, EllipsisVertical, X } from "lucide-react";
import { useMemo, useState } from "react";

export function TaskDetails({task} : {task:Task}){
    const [pressed, setPressed] = useState(false);
    // create/POST needs modal on taskTable 
    // others RUD need special row component TaskDetails

    return <div className="flex flex-row items-center h-10 mb-2 bg-slate-200">
        <Completed completed={task.completed} onClick={()=>setPressed(true)}/>
        <Title title={task.title}/>
        <Importance type={task.important}/>
        <Options onClick={()=>alert("hello there")} />
    </div>
}
function Title({title}:{title:string}){
    return <span className={"mx-2 text-black text-bold"}>{title}</span>
}
function Completed({completed, onClick}:{completed:boolean, onClick : ()=>void}) {
    const className = "bg-slate-500 p-[0.05rem] h-8 w-8";
    return (
        <button onClick={onClick} disabled={completed}>
            {
                completed 
                ? <Check className={className + " text-green-300"} />
                : <X className={className +  " text-red-300 hover:bg-slate-900"} />
            }
        </button>
    )
}
function Importance({type}:{type:number}){

    const typeString = ["Low","Medium","High"][type]
    const typeColor = ["green","blue","red"][type]

    return <span className={"mx-2 text-"+typeColor+"-500"}>
        {typeString}
    </span>
}
function Options({onClick}:{onClick : ()=>void}){
    return <button onClick={onClick}>
        <EllipsisVertical className="text-black items-between inline-flex justify-end h-6 w-6" />
    </button>
}