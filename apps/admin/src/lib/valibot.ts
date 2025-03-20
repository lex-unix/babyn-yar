import * as v from 'valibot'

v.setGlobalConfig({ lang: 'uk' })

export const Email = v.pipe(v.string(), v.email())
export const FullName = v.pipe(v.string(), v.minLength(3))
