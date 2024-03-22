import React from "react"
import { Fraction, TokenAmount } from "constants/uniswap"

const Decimal = ({ value, abbr = false, decimals = 2, postfix, prefix }: { value: TokenAmount | Fraction, abbr?: boolean, decimals?: number, prefix?: string, postfix?: string }) => {
    if(value===undefined)
        return <></>
    const units = { 3: 'K', 6: 'M', 9: 'B'}
    const size = value.toFixed(0).length
    let unit = 0
    if(abbr) for(const n in units) {
        if(size > Number(n))
            unit = Number(n)
    }
    const [part1, part2] = value.divide(String(10 ** unit)).toFixed(18).split('.')
    if(Number(part1)===0 && part2) {
      const matches = /^(0*)([^0]\d*)(0*)$/.exec(part2)
      if(matches && matches[1]?.length > 2) {
        return <span>
            { prefix ? prefix : '' }
            <span dangerouslySetInnerHTML={{ __html: [part1?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? 0, `0<sub>${matches[1].length}</sub>${matches[2]?.slice(0, decimals)}`].join('.') }} />
            { unit ? units[unit] : '' }
            { postfix ? postfix : '' }
        </span>
      }
    }
    return <span>
        { prefix ? prefix : '' }
        <span dangerouslySetInnerHTML={{ __html: [part1?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? 0, part2?.replace(/0*$/, '')?.slice(0, decimals)].filter(p => !!p).join('.') }}/>
        { unit ? units[unit] : '' }
        { postfix ? postfix : '' }
    </span>
}

export default Decimal