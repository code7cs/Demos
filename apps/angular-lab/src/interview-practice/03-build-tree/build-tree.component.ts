import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FLAT_ACCOUNTS, FlatAccount, AccountNode } from '../shared/models';
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main>
    <h1>Build tree from flat data</h1>
    <pre>{{ treeText }}</pre>
  </main>`,
  styles: [
    `
      main {
        max-width: 650px;
        margin: auto;
        padding: 2rem;
      }
      pre {
        padding: 1rem;
        background: #f4f4f4;
      }
    `,
  ],
})
export class BuildTreeComponent {
  readonly tree = this.buildTree(FLAT_ACCOUNTS);
  readonly treeText = this.printTree(this.tree);
  buildTree(items: FlatAccount[]): AccountNode[] {
    const nodes = new Map(items.map((x) => [x.id, { ...x, children: [] } as AccountNode]));
    const roots: AccountNode[] = [];
    for (const item of items) {
      const node = nodes.get(item.id)!;
      const parent = item.parentId ? nodes.get(item.parentId) : undefined;
      (parent?.children ?? roots).push(node);
    }
    return roots;
  }
  private printTree(nodes: AccountNode[], depth = 0): string {
    return nodes
      .map((n) => `${'  '.repeat(depth)}- ${n.name}\n${this.printTree(n.children, depth + 1)}`)
      .join('');
  }
}
