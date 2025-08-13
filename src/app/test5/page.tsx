'use client';
import { Input, Button, Card, Text, Title, Stack, Group, Loader, Container } from '@mantine/core';
import { IconBrandTwitter, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

type Tweet = {
    text: string;
    edit_history_tweet_ids: string[];
    id: string; 
};
export default function Test5(){
    const [username,setUsername]=useState('');
    const [tweet,setTweet]=useState<Tweet|null>(null);
    const [loading,setLoading]=useState(false);
    const fetchTweets=async()=>{
        if(!username) return;
        setLoading(true);
        try{
            await fetch(`/api/users?username=${username}`).then(response=>{
                console.log(response);
                return response.json();
            }).then(data=>{
                console.log(data);
                setTweet(data.tweets.data[0]);
                return data;
            }).catch(error=>{
                console.error('Error fetching tweets:',error);
            });
            
        }catch(error){
            console.error('Error fetching tweets:',error);
        }
        setLoading(false);
    };
    
            return (
        <Container size="md" py="xl">
            <Stack gap="xl">
                {/* 標題區域 */}
                <Group justify="center" gap="md">
                    <IconBrandTwitter size={32} color="#1da1f2" />
                    <Title order={1} c="blue" ta="center">
                        Twitter 最新推文獲取器5
                    </Title>
                </Group>
                
                {/* 輸入區域 */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Stack gap="md">
                        <Text size="sm" c="dimmed">
                            輸入 Twitter 用戶名來獲取他們的最新推文
                        </Text>
                        
                        <Group grow>
                            <Input
                                size="md"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="輸入 Twitter 用戶名..."
                                leftSection={<IconBrandTwitter size={16} />}
                                disabled={loading}
                            />
                            <Button
                                size="md"
                                onClick={fetchTweets}
                                loading={loading}
                                disabled={!username.trim()}
                                leftSection={<IconSearch size={16} />}
                                variant="filled"
                            >
                                獲取推文
                            </Button>
                        </Group>
                    </Stack>
                </Card>

                {/* 載入狀態 */}
                {loading && (
                    <Group justify="center">
                        <Loader size="md" />
                        <Text size="sm" c="dimmed">正在獲取推文...</Text>
                    </Group>
                )}

                {/* 推文顯示區域 */}
                {tweet && !loading && (
                    <Card shadow="md" padding="lg" radius="md" withBorder>
                        <Stack gap="sm">
                            <Group justify="space-between" align="center">
                                <Text size="lg" fw={600} c="blue">
                                    @{username} 的最新推文
                                </Text>
                                <IconBrandTwitter size={20} color="#1da1f2" />
                            </Group>
                            
                            <Text size="md" style={{ lineHeight: 1.6 }}>
                                {tweet.text}
                            </Text>
                            
                            <Text size="xs" c="dimmed" ta="right">
                                來自 Twitter API
                            </Text>
                        </Stack>
                    </Card>
                )}
            </Stack>
        </Container>
    );

}
