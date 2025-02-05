import { House, Clock, TagsIcon, EllipsisVertical, Asterisk, FileText } from "lucide-react";

export function TypeIcon({type}:{type:string}){
    const _className = "h-4 w-4"
    let _component;
    switch (type) {
        case "Personal":
           _component = <House className={_className}/>; break;
        case "Work":
            _component = <FileText className={_className}/>; break;
        default:
            _component = <Asterisk className={_className}/>; break;
    }
    return _component
}