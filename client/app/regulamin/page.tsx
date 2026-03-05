import { Text, Title, Stack } from "@mantine/core";
import Header from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import styles from "../page.module.css";

export const metadata = {
  title: "Regulamin strony – HydroData",
};

export default function RegulaminPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Stack gap="md">
          <Title order={2} fw={400}>Regulamin strony</Title>
          <Text c="dimmed" size="sm">Treść regulaminu zostanie uzupełniona wkrótce.</Text>
        </Stack>
      </main>
      <Footer />
    </>
  );
}
