```ts
import { format, parseISO, add } from 'date-fns'

//convert date:Date or date:string into string date with a format.
//toUtc=false: get local time
//toUtc=true: get utc time.
formatDate: (date: Date | string | undefined, _format = Define.FORMAT_DATE, toUTC = false) => {
    if (typeof date === "string") {
        return date && format(add(parseISO(date), { hours: toUTC ? new Date().getTimezoneOffset() / 60 : 0 }), _format)
    }
    else {
        return date && format(add(date, { hours: toUTC ? new Date().getTimezoneOffset() / 60 : 0 }), _format)
    }
},


```