import React, { useCallback, useEffect, useState } from "react"

const formatTime = (dt, locale, format) => {
    const time = new Date(dt)
    return new Intl.DateTimeFormat(locale ?? 'en-US', format ?? {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(time)
}

export const DateTime = ({time, locale = 'en-US', format} : {time: Date, locale?: string, format?: Intl.DateTimeFormatOptions}) => {
    return <>{formatTime(time, locale, format)}</>
}

export const TimeDiff = ({time, interval = 30, prefix, postfix} : {time: Date, interval?: number, prefix?: string, postfix?: string}) => {
    const [now, setNow] = useState<number>(Date.now())

    const timeDiff = useCallback((timeUnlock) => {
        let mins = Math.floor(Math.abs(timeUnlock.getTime() - now) / 60000) + 1
        if(mins < 60)
            return `${mins} minute${mins===1 ? '' : 's'}`
        let hours = Math.floor(mins / 60)
        mins = mins % 60
        if(hours < 24)
            return `${hours} hour${hours===1 ? '' : 's'} ${mins > 0 ? `${mins} minute${mins===1 ? '' : 's'}` : ''}`
        let days = Math.floor(hours / 24)
        hours = hours % 24
        return `${days} day${days===1 ? '' : 's'} ${hours > 0 ? `${hours} hour${hours===1 ? '' : 's'}` : ''}`
    }, [now])

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), interval * 1000)
        return () => clearInterval(timer)
    }, [interval])
    
    return <>
        {prefix ? `${prefix} ` : ''}
        {timeDiff(time)}
        {postfix ? ` ${postfix}` : ''}
    </>
}