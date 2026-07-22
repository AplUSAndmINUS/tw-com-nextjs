import styles from './GitHubActivity.module.scss';

export interface GitHubActivityProps {
  /** GitHub usernames (personal accounts) to show a contribution chart for. */
  users: string[];
}

/**
 * GitHub contribution charts.
 *
 * A build-time, server-rendered flex of the classic green-square activity grid
 * for each personal account — carried over from the old GitHub page. The image
 * comes from ghchart.rshah.org (a third party), tinted to the brand accent.
 *
 * Only personal accounts get a chart; organisations don't have a contribution
 * graph, so the caller filters those out.
 */
export function GitHubActivity({ users }: GitHubActivityProps) {
  if (users.length === 0) return null;

  return (
    <section className={styles.card} aria-label='GitHub contribution activity'>
      <div className={styles.header}>
        <span className={styles.kicker}>Contribution activity</span>
        <a
          className={styles.profileLink}
          href={`https://github.com/${users[0]}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          View profile &#8599;
        </a>
      </div>

      <div className={styles.charts}>
        {users.map((user) => (
          <figure key={user} className={styles.chartWrap}>
            <figcaption className={styles.user}>@{user}</figcaption>
            <div className={styles.chartScroll}>
              {/* Tinted to glacier cyan (5FB8D1) — ghchart bakes the colour into
                  the image, so this can't be a token; kept in sync with
                  --tw-glacier-cyan by hand.
                  eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.chart}
                src={`https://ghchart.rshah.org/5FB8D1/${user}`}
                alt={`${user}'s GitHub contribution graph`}
                loading='lazy'
                decoding='async'
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default GitHubActivity;
