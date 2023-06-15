let cookieOptions = { 
    domain: 'yournote.cloud' as string, 
    sameSite: 'none' as any, 
    secure: true as boolean,
    httpOnly: true as boolean,
}

export default cookieOptions
//{domain: '.yournote.cloud', sameSite: 'strict', secure: true, httpOnly: true}
