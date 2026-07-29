import { useState } from 'react';
import Search from './Search';

export default function SearchDemo() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <section>
      <h1>Search</h1>
      <Search onSelectItem={setSelectedItem} />
      {selectedItem && <p>Selected: {selectedItem}</p>}
    </section>
  );
}
