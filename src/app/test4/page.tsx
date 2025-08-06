"use client"
import { AppShell, Burger, Button, Group, Menu, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconExternalLink } from '@tabler/icons-react';
import Link from "next/link";

export default function AppShellExample({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text>我的應用程序</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
      <Group gap="md" justify="center">
                <Menu trigger="click-hover" openDelay={100} closeDelay={100}>
                    <Menu.Target>
                        <Button>更多選項</Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item component={Link} leftSection={<IconExternalLink size="1rem" />} href="/test2">test2</Menu.Item>
                        <Menu.Item component={Link} leftSection={<IconExternalLink size="1rem" />} href="/test3">test3</Menu.Item>
                        <Menu.Item disabled>結束</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                
            </Group>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}