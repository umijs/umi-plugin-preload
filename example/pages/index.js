import Link from 'umi/link';
import styles from './index.css';

export default function() {
  return (
    <div className={styles.normal}>
      <h1>Page index</h1>
      <hr/>
      <Link to="/a">a</Link>
      <br/>
      <Link to="/b">b</Link>
    </div>
  );
}
