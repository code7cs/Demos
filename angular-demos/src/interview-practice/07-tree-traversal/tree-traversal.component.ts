import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountNode, FlatAccount, FLAT_ACCOUNTS } from '../shared/models';

@Component({
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Tree traversal</h1>
      <input [(ngModel)]="searchId" placeholder="Account id" />
      <button (click)="find()">Find</button>

      <p>{{ selected?.name ?? 'Not found' }}</p>
      <p>DFS order: {{ flattenTree(tree).join(' → ') }}</p>
    </main>
  `,
  styles: [
    `
      main {
        max-width: 700px;
        margin: auto;
        padding: 2rem;
      }
      input,
      button {
        padding: 0.5rem;
        margin-right: 0.5rem;
      }
    `,
  ],
})
export class TreeTraversalComponent {
  readonly tree = this.buildTree(FLAT_ACCOUNTS);

  searchId = '';
  selected: AccountNode | undefined;

  find(): void {
    this.selected = this.findNodeById(this.tree, this.searchId);
  }

  buildTree(items: FlatAccount[]): AccountNode[] {
    const nodes = new Map(items.map((item) => [item.id, { ...item, children: [] } as AccountNode]));
    const roots: AccountNode[] = [];

    for (const item of items) {
      const node = nodes.get(item.id)!;
      const parent = item.parentId ? nodes.get(item.parentId) : undefined;
      (parent?.children ?? roots).push(node);
    }

    return roots;
  }

  findNodeById(nodes: AccountNode[], id: string): AccountNode | undefined {
    const stack = [...nodes].reverse();

    while (stack.length > 0) {
      const node = stack.pop()!;
      if (node.id === id) return node;
      stack.push(...[...node.children].reverse());
    }

    return undefined;
  }

  flattenTree(nodes: AccountNode[]): string[] {
    const result: string[] = [];
    const stack = [...nodes].reverse();

    while (stack.length > 0) {
      const node = stack.pop()!;
      result.push(node.id);
      stack.push(...[...node.children].reverse());
    }

    return result;
  }
}
