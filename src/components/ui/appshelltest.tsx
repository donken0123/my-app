"use client"
import { AppShell, Badge, Burger, Button, Group, Menu, Text, Stack, Flex, ActionIcon, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconExternalLink, IconBell, IconUser, IconSettings, IconSearch, IconMenu2, IconHome, IconChevronDown } from '@tabler/icons-react';
import Link from "next/link";
import { useState } from 'react';







export default function AppShellExample1({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();
  const [active, setActive] = useState<string|null>('test2');
  

  return (
          <AppShell
        header={{ height: 60 }}
        padding="md"
      >
      <AppShell.Header bg="black">
        
        <Group gap={64} h="100%" px="md" justify="space-start" align="center">
          
          <Group gap="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text style={{color: 'white'}} size="lg" fw={600}>我的應用程序</Text>
            <Badge color="green" variant="light" size="sm">v1.0</Badge>
          </Group>
          
          
          <Group gap="sm">
            <Button 
              bg={active==='test2'?'red':'transparent'} 
              variant="subtle" 
              leftSection={<IconExternalLink size="1rem" /> } 
              component={Link} 
              href="/test2" 
              onClick={() => {setActive('test2')}}
              style={{backgroundColor: active==='test2'?'red':'transparent'}}
            >test2</Button>
            
            <Button
              bg={active==='test3'?'red':'transparent'}
              variant="subtle" 
              component={Link} 
              href="/test3" 
              leftSection={<IconExternalLink size="1rem" />}
              onClick={() => {setActive('test3')}}
              style={{backgroundColor: active==='test3'?'red':'transparent'}}
            >test3</Button>
            <Button
              bg={active==='test5'?'red':'transparent'}
              variant="subtle" 
              component={Link} 
              href="/test5" 
              leftSection={<IconExternalLink size="1rem" />}
              onClick={() => {setActive('test5')}}
              style={{backgroundColor: active==='test5'?'red':'transparent'}}
            >test5</Button>


            
          </Group>
          
          
          {/* <Group gap="sm">
            <ActionIcon variant="subtle" aria-label="搜尋">
              <IconSearch size="1.2rem" />
            </ActionIcon>
            <ActionIcon variant="subtle" aria-label="通知">
              <IconBell size="1.2rem" />
            </ActionIcon>
            <Menu trigger="click-hover">
              <Menu.Target>
                <Button variant="subtle" rightSection={<IconChevronDown size="1rem" />}>
                  <Avatar size="sm" />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size="1rem" />}>個人資料</Menu.Item>
                <Menu.Item leftSection={<IconSettings size="1rem" />}>設定</Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red">登出</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group> */}
        </Group>
      </AppShell.Header>

      {/* <AppShell.Navbar p="md" style={{border: '5px solid green'}}>
      
                <Menu width="target" trigger="click-hover" openDelay={100} closeDelay={100}>
                    <Menu.Target>
                        <Button >更多選項</Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item component={Link} leftSection={<IconExternalLink size="2rem" />} href="/test2">test2</Menu.Item>
                        <Menu.Item component={Link} leftSection={<IconExternalLink size="2rem" />} href="/test3">test3</Menu.Item>
                        <Menu.Item disabled>結束</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                
            
      </AppShell.Navbar> */}

      <AppShell.Main style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 60px)' // 扣除 header 高度
      }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
}