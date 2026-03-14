'use client';
import styles from "./header.module.css";
import Image from "next/image";
import Link from "next/link";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";

const Header = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
      <header className={styles.header}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.brand}>
            <Image src="/icon.svg" alt="" width={30} height={30} className={styles.titleIcon} aria-hidden="true" />
            <h1 className={styles.title}>HydroDane</h1>
          </Link>
        <ActionIcon variant="subtle" color="gray" onClick={toggleColorScheme} aria-label="Zmień motyw">
          {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
        </ActionIcon>
      </div>
      <h4 className={styles.subtitle}>Wykresy archiwalnych danych hydrologicznych</h4>
    </header>
  );
};

export default Header;
