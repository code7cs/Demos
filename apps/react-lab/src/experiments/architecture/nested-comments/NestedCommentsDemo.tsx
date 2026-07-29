import NestedComments from './NestedComments';
import { sampleComments } from './comments.fixture';
import './nested-comments.css';

export default function NestedCommentsDemo() {
  return (
    <section className="nested-comments-demo">
      <header className="comments-hero">
        <p className="comments-kicker">Frontend interview practice · 60 minutes</p>
        <h1>Nested comments</h1>
        <p>
          Transform a flat list into a tree, render arbitrary reply depth, and keep collapse state
          predictable.
        </p>
      </header>

      <div className="comments-panel">
        <div className="comments-panel-heading">
          <div>
            <p className="comments-overline">Discussion</p>
            <h2>Frontend architecture</h2>
          </div>
          <span className="comments-count">{sampleComments.length} comments</span>
        </div>

        <NestedComments comments={sampleComments} />
      </div>
    </section>
  );
}
