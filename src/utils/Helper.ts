import { format, parseISO, add } from 'date-fns'
import Define from './Define'

const Helper = {

    getToday: () => {
        return format(new Date(), "yyyy-MM-dd")
        // return moment().format("YYYY-MM-DD")
    },

    formatDate: (date: Date | string | undefined, _format = Define.FORMAT_DATE, toUTC = false) => {
        if (typeof date === "string") {
            return date && format(add(parseISO(date), { hours: toUTC ? new Date().getTimezoneOffset() / 60 : 0 }), _format)
        }
        else {
            return date && format(add(date, { hours: toUTC ? new Date().getTimezoneOffset() / 60 : 0 }), _format)
        }
    },
    //Helper.validateField("", "", "")
    //if return true-> we no error.false-> have error.
    isValidateField: (...arr: any[]): boolean => {
        const n_arr = arr.filter(itm => {
            if (itm && itm !== null && itm !== undefined) {
                //ck for array
                if (Array.isArray(itm) && itm.length === 0) {
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        })

        if (n_arr.length === arr.length) {
            return true;//valid all field
        } else {
            return false;//invalid all field
        }
    },//validateField
    uniqBy: (a: any[], key: (obj: any) => string) => {
        let seen: any = {};
        return a.filter(function (item) {
            let k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    },
    updateArray: (arr: any[], newitem: any) => {
        if (arr[0].id) {
            const idx = arr.findIndex(item => item?.id === newitem?.id)
            arr.splice(idx, 1, newitem)
            return arr
        } else {
            return []
        }
    },
    uniqueArray: (arr: any[], key: string) => {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    },
    upperCase: (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }
}

export default Helper