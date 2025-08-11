"use client"
import { Button, Group, Menu } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";
export default function Nav() {
    return (
        <nav>
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
        </nav>)}