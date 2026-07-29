export type Transaction = {
  id: string;
  description: string;
  category: 'Income' | 'Food' | 'Bills' | 'Shopping';
  amount: number;
  date: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
};

const TRANSACTIONS_URL =
  'https://dummyjson.com/products?limit=12&delay=3000';

export async function getTransactions(
  signal?: AbortSignal,
): Promise<Transaction[]> {
  const response = await fetch(TRANSACTIONS_URL, { signal });

  if (!response.ok) {
    throw new Error('Unable to load transactions');
  }

  const data = (await response.json()) as { products?: Product[] };

  if (!Array.isArray(data.products)) {
    throw new Error('Unable to load transactions');
  }

  const categories: Transaction['category'][] = [
    'Income',
    'Food',
    'Bills',
    'Shopping',
  ];

  return data.products.map((product, index) => {
    const category = categories[index % categories.length];
    const date = new Date();
    date.setDate(date.getDate() - index);

    return {
      id: String(product.id),
      description: product.title,
      category,
      amount: category === 'Income' ? product.price : -product.price,
      date: date.toISOString(),
    };
  });
}
