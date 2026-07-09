export type OfferCategory = "Credit Builder" | "Personal Loan" | "Cash Advance";

export type Offer = {
  id: string;
  title: string;
  category: OfferCategory;
  apr: number | null;
  recommended: boolean;
};

export const offersData: Offer[] = [
  { id: "1", title: "Credit Builder Plus", category: "Credit Builder", apr: 5.99, recommended: true },
  { id: "2", title: "Everyday Personal Loan", category: "Personal Loan", apr: 12.5, recommended: false },
  { id: "3", title: "Instacash Advance", category: "Cash Advance", apr: null, recommended: true },
  { id: "4", title: "Flexible Personal Loan", category: "Personal Loan", apr: 9.75, recommended: true },
  { id: "5", title: "Starter Credit Builder", category: "Credit Builder", apr: 3.5, recommended: false }
];