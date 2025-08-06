import{NextRequest, NextResponse} from 'next/server';
export async function GET(request: NextRequest){
    try{    
        const {searchParams} = new URL(request.url);
        const username=searchParams.get('username');
        if(!username){
            return NextResponse.json({error:'Username is required'},{status:400});
        }
        const userResponse=await fetch(
            `https://api.twitter.com/2/users/by/username/${username}`,
            {
                headers:{
                    Authorization:`Bearer ${process.env.twitter_bear_token}`
                }
            }
        ).then(response=>{
            console.log('=== 使用者查詢 API 使用量 ===');
            console.log('剩餘請求數:', response.headers.get('x-rate-limit-remaining'));
            console.log('總限制數:', response.headers.get('x-rate-limit-limit'));
            console.log('重置時間:', response.headers.get('x-rate-limit-reset'));
            console.log(response);
            return response.json();
        }).then(data => {
            console.log(data);
            return data;
        }).catch(error=>{
            console.error('Error fetching user data:', error);
            return null;
        });

        if(!userResponse){
            return NextResponse.json({error:'Failed to fetch user data'},{status:500});
        }
        const userData=userResponse;
        const userId=userData.data.id;
        const tweetsResponse=await fetch(
            `https://api.twitter.com/2/users/${userId}/tweets?exclude=retweets,replies&max_results=5`,
            {
                headers:{
                    Authorization:`Bearer ${process.env.twitter_bear_token}`
                }
            }

            ).then(tweetsResponse=>{
            console.log('=== 使用者查詢 API 使用量 ===');
            console.log('剩餘請求數:', tweetsResponse.headers.get('x-rate-limit-remaining'));
            console.log('總限制數:', tweetsResponse.headers.get('x-rate-limit-limit'));
            console.log('重置時間:', tweetsResponse.headers.get('x-rate-limit-reset'));
            return tweetsResponse.json();
        }).then(tweetsData=>{
            console.log(tweetsData);
            return tweetsData;
        }).catch(error=>{
            console.error('Error fetching tweets:', error);
            return null;
        });
        return NextResponse.json({
            user:userData,
            tweets:tweetsResponse
        });
    }
    catch(error){
        console.error('Error fetching user data:', error);
        return NextResponse.json({error:'Internal server error'},{status:500});
    }


}