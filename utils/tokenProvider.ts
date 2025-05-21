import {supabase} from '../lib/supabase'

export const tokenProvider = async () => {
    const {data} = await supabase.functions.invoke('token-server')
    console.log(data)
    return data.token
}