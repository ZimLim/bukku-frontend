import styles from "./page.module.css";
import AddPurchase from "./components/AddPurchase";
import AddSale from "./components/AddSale";
import TransactionTable from "./components/TransactionsTable";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <AddPurchase></AddPurchase>
        <AddSale></AddSale>
        <TransactionTable></TransactionTable>
      </main>
    </div>
  );
}
